const db = require("../config/db");

// Get total units sold for a specific product over the last N days
const getProductSalesVolume = async (productId, days = 30) => {
  const [rows] = await db.query(
    `SELECT COALESCE(SUM(si.quantity), 0) AS totalSold
     FROM sale_items si
     INNER JOIN sales s ON si.saleId = s.id
     WHERE si.productId = ?
       AND s.status = 'COMPLETED'
       AND s.createdAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)`,
    [productId, days]
  );
  return Number(rows[0].totalSold) || 0;
};

// Fetch all active products along with supplier lead times and total units sold
const getInventoryVelocityData = async (days = 30) => {
  const [rows] = await db.query(
    `SELECT 
       p.id AS productId,
       p.name AS productName,
       p.sku,
       p.currentStock,
       p.safetyStock,
       COALESCE(s.leadTimeDays, 1) AS leadTimeDays,
       COALESCE(sales_summary.totalSold, 0) AS totalSold
     FROM products p
     LEFT JOIN suppliers s ON p.supplierId = s.id
     LEFT JOIN (
       SELECT 
         si.productId,
         SUM(si.quantity) AS totalSold
       FROM sale_items si
       INNER JOIN sales sales_tbl ON si.saleId = sales_tbl.id
       WHERE sales_tbl.status = 'COMPLETED'
         AND sales_tbl.createdAt >= DATE_SUB(CURRENT_TIMESTAMP, INTERVAL ? DAY)
       GROUP BY si.productId
     ) AS sales_summary ON p.id = sales_summary.productId
     WHERE p.isActive = 1
     ORDER BY p.id ASC`,
    [days]
  );
  return rows;
};

module.exports = {
  getProductSalesVolume,
  getInventoryVelocityData,
};