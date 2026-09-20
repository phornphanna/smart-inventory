const db = require("../config/db");
const stockMovementModel = require("./stockMovementModel");

const getPaymentById = async (id) => {
  const [rows] = await db.query("SELECT * FROM payments WHERE id = ?", [id]);
  return rows[0] || null;
};

const getPaymentBySaleId = async (saleId) => {
  const [rows] = await db.query("SELECT * FROM payments WHERE saleId = ?", [saleId]);
  return rows[0] || null;
};

// Create a pending or instant payment entry
const createPaymentRecord = async ({
  saleId,
  method,
  amount,
  status,
  transactionId,
  paidAt,
}) => {
  const [result] = await db.query(
    `INSERT INTO payments (saleId, method, amount, status, transactionId, paidAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      saleId,
      method,
      amount,
      status || "PENDING",
      transactionId || null,
      paidAt || null,
    ]
  );
  return result.insertId;
};

// Atomically finalize a payment, deduct stock, and generate ledger rows
const finalizePaymentTransaction = async ({ paymentId, userId, amountReceived }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Lock payment row
    const [payments] = await connection.query(
      "SELECT * FROM payments WHERE id = ? FOR UPDATE",
      [paymentId]
    );

    if (payments.length === 0) {
      throw { statusCode: 404, message: "Payment record not found" };
    }

    const payment = payments[0];
    if (payment.status === "PAID") {
      throw { statusCode: 400, message: "Payment has already been confirmed as PAID" };
    }

    // 2. Lock sale row
    const [sales] = await connection.query(
      "SELECT * FROM sales WHERE id = ? FOR UPDATE",
      [payment.saleId]
    );

    if (sales.length === 0) {
      throw { statusCode: 404, message: "Sale associated with this payment not found" };
    }

    const sale = sales[0];
    if (sale.status === "CANCELLED") {
      throw { statusCode: 400, message: "Cannot pay for a cancelled sale" };
    }

    // 3. Lock products and verify stock remains sufficient
    const [saleItems] = await connection.query(
      "SELECT * FROM sale_items WHERE saleId = ?",
      [sale.id]
    );

    for (const item of saleItems) {
      const [productRows] = await connection.query(
        "SELECT id, name, currentStock FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (productRows.length === 0) {
        throw { statusCode: 404, message: `Product ID ${item.productId} no longer exists` };
      }

      const product = productRows[0];
      if (product.currentStock < item.quantity) {
        throw {
          statusCode: 400,
          message: `Stock ran out before payment confirmation for '${product.name}'. Available: ${product.currentStock}.`,
        };
      }

      const balanceBefore = product.currentStock;
      const balanceAfter = balanceBefore - item.quantity;

      // Update current stock
      await connection.query(
        "UPDATE products SET currentStock = ? WHERE id = ?",
        [balanceAfter, item.productId]
      );

      // Add to immutable stock movement ledger
      await stockMovementModel.createMovement(
        {
          productId: item.productId,
          type: "OUT",
          quantity: item.quantity,
          balanceBefore,
          balanceAfter,
          saleId: sale.id,
          createdById: userId,
          notes: `Paid via ${payment.method} for ${sale.saleNumber}`,
        },
        connection
      );
    }

    // 4. Update payment and sale status
    const actualAmount = amountReceived !== undefined ? amountReceived : payment.amount;

    await connection.query(
      `UPDATE payments 
       SET status = 'PAID', amount = ?, paidAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [actualAmount, paymentId]
    );

    await connection.query(
      "UPDATE sales SET status = 'COMPLETED' WHERE id = ?",
      [sale.id]
    );

    await connection.commit();
    return { saleId: sale.id, paymentId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getPaymentById,
  getPaymentBySaleId,
  createPaymentRecord,
  finalizePaymentTransaction,
};