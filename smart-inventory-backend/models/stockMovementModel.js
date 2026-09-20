const db = require("../config/db");

// បង្កើតកំណត់ត្រា Ledger ថ្មី (ប្រើរួចហើយក្នុង Phase 5, 6, 7)
const createMovement = async (movementData, connection = db) => {
  const {
    productId,
    type,
    quantity,
    balanceBefore,
    balanceAfter,
    purchaseOrderId,
    saleId,
    createdById,
    notes,
  } = movementData;

  const [result] = await connection.query(
    `INSERT INTO stock_movements (
       productId, type, quantity, balanceBefore, balanceAfter,
       purchaseOrderId, saleId, createdById, notes
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      productId,
      type,
      quantity,
      balanceBefore,
      balanceAfter,
      purchaseOrderId || null,
      saleId || null,
      createdById,
      notes || null,
    ]
  );

  return result.insertId;
};

// ទាញយកចលនាស្តុកទាំងអស់ (Auditing Ledger) ជាមួយ Filter
const getAllMovements = async ({ productId, type, startDate, endDate }) => {
  let query = `
    SELECT 
      sm.*,
      p.name AS productName,
      p.sku AS productSku,
      u.name AS createdByName,
      po.poNumber,
      s.saleNumber
    FROM stock_movements sm
    LEFT JOIN products p ON sm.productId = p.id
    LEFT JOIN users u ON sm.createdById = u.id
    LEFT JOIN purchase_orders po ON sm.purchaseOrderId = po.id
    LEFT JOIN sales s ON sm.saleId = s.id
    WHERE 1=1
  `;
  const params = [];

  if (productId) {
    query += " AND sm.productId = ?";
    params.push(productId);
  }

  if (type) {
    query += " AND sm.type = ?";
    params.push(type.toUpperCase());
  }

  if (startDate) {
    query += " AND sm.createdAt >= ?";
    params.push(`${startDate} 00:00:00`);
  }

  if (endDate) {
    query += " AND sm.createdAt <= ?";
    params.push(`${endDate} 23:59:59`);
  }

  query += " ORDER BY sm.id DESC";

  const [rows] = await db.query(query, params);
  return rows;
};

// ទាញយកចលនាស្តុកតាម Product ID ជាក់លាក់
const getMovementsByProductId = async (productId) => {
  const [rows] = await db.query(
    `SELECT 
       sm.*,
       p.name AS productName,
       p.sku AS productSku,
       u.name AS createdByName,
       po.poNumber,
       s.saleNumber
     FROM stock_movements sm
     LEFT JOIN products p ON sm.productId = p.id
     LEFT JOIN users u ON sm.createdById = u.id
     LEFT JOIN purchase_orders po ON sm.purchaseOrderId = po.id
     LEFT JOIN sales s ON sm.saleId = s.id
     WHERE sm.productId = ?
     ORDER BY sm.id DESC`,
    [productId]
  );
  return rows;
};

const adjustStockTransaction = async ({ productId, newStock, reason, userId }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Lock the product row to read real-time balance
    const [productRows] = await connection.query(
      "SELECT id, name, currentStock FROM products WHERE id = ? FOR UPDATE",
      [productId]
    );

    if (productRows.length === 0) {
      throw { statusCode: 404, message: "Product not found" };
    }

    const product = productRows[0];
    const balanceBefore = Number(product.currentStock);
    const balanceAfter = Number(newStock);

    if (isNaN(balanceAfter) || balanceAfter < 0) {
      throw { statusCode: 400, message: "New stock value must be a valid number of 0 or greater" };
    }

    const difference = balanceAfter - balanceBefore;
    if (difference === 0) {
      throw { statusCode: 400, message: "New stock value is identical to current stock. No adjustment needed." };
    }

    // 2. Update product stock
    await connection.query(
      "UPDATE products SET currentStock = ? WHERE id = ?",
      [balanceAfter, productId]
    );

    // 3. Log into immutable ledger (Quantity stores absolute difference changed)
    const [movementResult] = await connection.query(
      `INSERT INTO stock_movements (
         productId, type, quantity, balanceBefore, balanceAfter,
         createdById, notes
       ) VALUES (?, 'ADJUSTMENT', ?, ?, ?, ?, ?)`,
      [
        productId,
        Math.abs(difference),
        balanceBefore,
        balanceAfter,
        userId,
        reason || `Manual adjustment: ${difference > 0 ? "+" : ""}${difference} units`,
      ]
    );

    await connection.commit();
    return {
      movementId: movementResult.insertId,
      productId: product.id,
      productName: product.name,
      balanceBefore,
      balanceAfter,
      adjustedByUnits: difference,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  createMovement,
  getAllMovements,
  getMovementsByProductId,
  adjustStockTransaction
};