const db = require("../config/db");
const stockMovementModel = require("./stockMovementModel");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");

// Get the latest sequence number for SALE-001 formatting
const getNextSaleSequence = async () => {
  const [rows] = await db.query(
    "SELECT saleNumber FROM sales WHERE saleNumber LIKE 'SALE-%' ORDER BY id DESC LIMIT 1"
  );

  if (rows.length === 0) return 1;

  const lastNumber = parseInt(rows[0].saleNumber.split("-")[1], 10);
  return isNaN(lastNumber) ? 1 : lastNumber + 1;
};

// Complete Sale Transaction with Negative Stock Prevention
// Replace createSaleTransaction in models/saleModel.js
const createSaleTransaction = async ({
  saleNumber,
  customerName,
  customerPhone,
  discount,
  items,
  createdById,
}) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    let subtotal = 0;
    const validatedItems = [];

    // Validate each item and check stock availability without deducting yet
    for (const item of items) {
      const [productRows] = await connection.query(
        "SELECT id, name, sku, sellingPrice, currentStock, isActive FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (productRows.length === 0) {
        throw { statusCode: 404, message: `Product ID ${item.productId} not found` };
      }

      const product = productRows[0];

      if (!product.isActive) {
        throw {
          statusCode: 400,
          message: `Product '${product.name}' is inactive and cannot be sold`,
        };
      }

      const requestedQty = Number(item.quantity);
      if (isNaN(requestedQty) || requestedQty <= 0) {
        throw {
          statusCode: 400,
          message: `Quantity for product '${product.name}' must be greater than 0`,
        };
      }

      if (product.currentStock < requestedQty) {
        throw {
          statusCode: 400,
          message: `Insufficient stock for product '${product.name}'. Available: ${product.currentStock}.`,
        };
      }

      const unitPrice =
        item.unitPrice !== undefined && Number(item.unitPrice) >= 0
          ? Number(item.unitPrice)
          : Number(product.sellingPrice);

      const lineTotal = Number((requestedQty * unitPrice).toFixed(2));
      subtotal += lineTotal;

      validatedItems.push({
        productId: product.id,
        quantity: requestedQty,
        unitPrice,
        lineTotal,
      });
    }

    const discountAmount = Number(discount) > 0 ? Number(discount) : 0;
    const totalAmount = Math.max(0, Number((subtotal - discountAmount).toFixed(2)));

    // Create the sale in PENDING status
    const [saleResult] = await connection.query(
      `INSERT INTO sales (
         saleNumber, subtotal, discount, totalAmount, customerName, customerPhone, createdById, status
       ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING')`,
      [
        saleNumber,
        subtotal,
        discountAmount,
        totalAmount,
        customerName || null,
        customerPhone || null,
        createdById,
      ]
    );

    const saleId = saleResult.insertId;

    // Insert sale_items
    for (const validItem of validatedItems) {
      await connection.query(
        `INSERT INTO sale_items (saleId, productId, quantity, unitPrice, lineTotal)
         VALUES (?, ?, ?, ?, ?)`,
        [saleId, validItem.productId, validItem.quantity, validItem.unitPrice, validItem.lineTotal]
      );
    }

    await connection.commit();
    return saleId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Fetch sales list
// const getAllSales = async () => {
//   const [rows] = await db.query(
//     `SELECT 
//        s.*,
//        u.name AS createdByName
//      FROM sales s
//      LEFT JOIN users u ON s.createdById = u.id
//      ORDER BY s.id DESC`
//   );
//   return rows;
// };

const getSalesPaginated = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  const { status, search, startDate, endDate } = query;

  let whereClauses = [];
  let params = [];

  if (status) {
    whereClauses.push("s.status = ?");
    params.push(status);
  }

  if (search && search.trim()) {
    whereClauses.push("(s.saleNumber LIKE ? OR s.customerName LIKE ? OR s.customerPhone LIKE ?)");
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  if (startDate && endDate) {
    whereClauses.push("s.createdAt BETWEEN ? AND ?");
    params.push(startDate, endDate);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // 1. Total count
  const countSql = `SELECT COUNT(*) AS total FROM sales s ${whereSql}`;
  const [countRows] = await db.query(countSql, params);
  const totalItems = countRows[0].total;

  // 2. Fetch page records
  const dataSql = `
    SELECT 
      s.*,
      u.name AS createdByName
    FROM sales s
    LEFT JOIN users u ON s.createdById = u.id
    ${whereSql}
    ORDER BY s.id DESC
    LIMIT ? OFFSET ?
  `;

  const [items] = await db.query(dataSql, [...params, limit, offset]);

  return {
    items,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
};

// Fetch single sale with line items
const getSaleById = async (id) => {
  const [saleRows] = await db.query(
    `SELECT 
       s.*,
       u.name AS createdByName
     FROM sales s
     LEFT JOIN users u ON s.createdById = u.id
     WHERE s.id = ?`,
    [id]
  );

  if (saleRows.length === 0) return null;

  const sale = saleRows[0];

  const [items] = await db.query(
    `SELECT 
       si.*,
       p.name AS productName,
       p.sku AS productSku
     FROM sale_items si
     LEFT JOIN products p ON si.productId = p.id
     WHERE si.saleId = ?`,
    [id]
  );

  sale.items = items;
  return sale;
};

// Cancel Sale Transaction (restores stock back into products via ADJUSTMENT movement)
const cancelSaleTransaction = async (saleId, userId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [saleRows] = await connection.query(
      "SELECT * FROM sales WHERE id = ? FOR UPDATE",
      [saleId]
    );

    if (saleRows.length === 0) {
      throw { statusCode: 404, message: "Sale not found" };
    }

    const sale = saleRows[0];
    if (sale.status === "CANCELLED") {
      throw { statusCode: 400, message: "Sale is already cancelled" };
    }

    const [saleItems] = await connection.query(
      "SELECT * FROM sale_items WHERE saleId = ?",
      [saleId]
    );

    // Return stock back to inventory and log ledger
    for (const item of saleItems) {
      const [productRows] = await connection.query(
        "SELECT id, currentStock FROM products WHERE id = ? FOR UPDATE",
        [item.productId]
      );

      if (productRows.length > 0) {
        const product = productRows[0];
        const balanceBefore = product.currentStock;
        const balanceAfter = balanceBefore + item.quantity;

        await connection.query(
          "UPDATE products SET currentStock = ? WHERE id = ?",
          [balanceAfter, item.productId]
        );

        await stockMovementModel.createMovement(
          {
            productId: item.productId,
            type: "ADJUSTMENT",
            quantity: item.quantity,
            balanceBefore,
            balanceAfter,
            saleId,
            createdById: userId,
            notes: `Restored from cancelled sale ${sale.saleNumber}`,
          },
          connection
        );
      }
    }

    await connection.query(
      "UPDATE sales SET status = 'CANCELLED' WHERE id = ?",
      [saleId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = {
  getNextSaleSequence,
  createSaleTransaction,
  getSalesPaginated,
  getSaleById,
  cancelSaleTransaction,
};