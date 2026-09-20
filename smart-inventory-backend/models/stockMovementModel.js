const db = require("../config/db");
const { getPaginationParams, buildPaginationMeta } = require("../utils/pagination");
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
// const getAllMovements = async ({ productId, type, startDate, endDate }) => {
//   let query = `
//     SELECT 
//       sm.*,
//       p.name AS productName,
//       p.sku AS productSku,
//       u.name AS createdByName,
//       po.poNumber,
//       s.saleNumber
//     FROM stock_movements sm
//     LEFT JOIN products p ON sm.productId = p.id
//     LEFT JOIN users u ON sm.createdById = u.id
//     LEFT JOIN purchase_orders po ON sm.purchaseOrderId = po.id
//     LEFT JOIN sales s ON sm.saleId = s.id
//     WHERE 1=1
//   `;
//   const params = [];

//   if (productId) {
//     query += " AND sm.productId = ?";
//     params.push(productId);
//   }

//   if (type) {
//     query += " AND sm.type = ?";
//     params.push(type.toUpperCase());
//   }

//   if (startDate) {
//     query += " AND sm.createdAt >= ?";
//     params.push(`${startDate} 00:00:00`);
//   }

//   if (endDate) {
//     query += " AND sm.createdAt <= ?";
//     params.push(`${endDate} 23:59:59`);
//   }

//   query += " ORDER BY sm.id DESC";

//   const [rows] = await db.query(query, params);
//   return rows;
// };

const getStockMovementsPaginated = async (query = {}) => {
  const { page, limit, offset } = getPaginationParams(query);
  const { productId, type, startDate, endDate } = query;

  let whereClauses = [];
  let params = [];

  if (productId) {
    whereClauses.push("sm.productId = ?");
    params.push(Number(productId));
  }

  if (type) {
    whereClauses.push("sm.type = ?");
    params.push(type);
  }

  if (startDate && endDate) {
    whereClauses.push("sm.createdAt BETWEEN ? AND ?");
    params.push(startDate, endDate);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

  // 1. Total count
  const countSql = `SELECT COUNT(*) AS total FROM stock_movements sm ${whereSql}`;
  const [countRows] = await db.query(countSql, params);
  const totalItems = countRows[0].total;

  // 2. Fetch page records
  const dataSql = `
    SELECT 
      sm.*,
      p.name AS productName,
      p.sku AS productSku,
      u.name AS createdByName
    FROM stock_movements sm
    LEFT JOIN products p ON sm.productId = p.id
    LEFT JOIN users u ON sm.createdById = u.id
    ${whereSql}
    ORDER BY sm.id DESC
    LIMIT ? OFFSET ?
  `;

  const [items] = await db.query(dataSql, [...params, limit, offset]);

  return {
    items,
    pagination: buildPaginationMeta(totalItems, page, limit),
  };
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

    // 1. Lock product row and also fetch SKU
    const [productRows] = await connection.query(
      "SELECT id, name, sku, currentStock FROM products WHERE id = ? FOR UPDATE",
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

    // 2. Update currentStock
    await connection.query(
      "UPDATE products SET currentStock = ? WHERE id = ?",
      [balanceAfter, productId]
    );

    // 3. Insert into immutable movement ledger
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
        reason,
      ]
    );

    await connection.commit();

    // 4. Return all details including reason and sku
    return {
      movementId: movementResult.insertId,
      productId: product.id,
      productName: product.name,
      sku: product.sku,                   // <-- Return SKU
      balanceBefore,
      balanceAfter,
      adjustedByUnits: difference,
      reason: reason                      // <-- Return Reason
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
 getStockMovementsPaginated ,
  getMovementsByProductId,
  adjustStockTransaction
};