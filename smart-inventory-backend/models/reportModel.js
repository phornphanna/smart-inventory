const db = require("../config/db");

// 1. STOCK BALANCE SUMMARY REPORT (Opening, Received/IN, Sold/OUT, Adjustment, Current/Closing)
// Formula: Opening Stock = Current Stock - (Net Movements from startDate to Now)
const getStockSummaryReport = async ({ startDate, endDate, categoryId }) => {
  let query = `
    SELECT 
      p.id AS productId,
      p.sku,
      p.name AS productName,
      c.name AS categoryName,
      p.costPrice,
      p.sellingPrice,
      p.currentStock AS closingStock,
      
      -- Quantity Received (IN) during selected date range
      COALESCE(SUM(CASE WHEN sm.type = 'IN' AND sm.createdAt BETWEEN ? AND ? THEN sm.quantity ELSE 0 END), 0) AS receivedStock,
      
      -- Quantity Sold (OUT) during selected date range
      COALESCE(SUM(CASE WHEN sm.type = 'OUT' AND sm.createdAt BETWEEN ? AND ? THEN sm.quantity ELSE 0 END), 0) AS soldStock,
      
      -- Quantity Adjusted during selected date range
      COALESCE(SUM(CASE WHEN sm.type = 'ADJUSTMENT' AND sm.createdAt BETWEEN ? AND ? THEN sm.quantity ELSE 0 END), 0) AS adjustedStock,

      -- Net movement between startDate and CURRENT_TIMESTAMP (used to calculate Opening Stock)
      COALESCE(SUM(CASE 
        WHEN sm.createdAt >= ? THEN 
          CASE 
            WHEN sm.type = 'IN' THEN sm.quantity 
            WHEN sm.type = 'OUT' THEN -sm.quantity 
            WHEN sm.type = 'ADJUSTMENT' THEN sm.quantity 
            ELSE 0 
          END
        ELSE 0 
      END), 0) AS netChangeSinceStart

    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LEFT JOIN stock_movements sm ON p.id = sm.productId
    WHERE p.isActive = 1
  `;

  const startStamp = `${startDate} 00:00:00`;
  const endStamp = `${endDate} 23:59:59`;
  const params = [startStamp, endStamp, startStamp, endStamp, startStamp, endStamp, startStamp];

  if (categoryId) {
    query += " AND p.categoryId = ?";
    params.push(categoryId);
  }

  query += " GROUP BY p.id ORDER BY p.name ASC";

  const [rows] = await db.query(query, params);

  // Compute opening stock and inventory valuations
  return rows.map((row) => {
    const closing = Number(row.closingStock);
    const netChange = Number(row.netChangeSinceStart);
    const openingStock = Math.max(0, closing - netChange);
    const costPrice = Number(row.costPrice);

    return {
      productId: row.productId,
      sku: row.sku,
      productName: row.productName,
      categoryName: row.categoryName || "Unassigned",
      costPrice,
      sellingPrice: Number(row.sellingPrice),
      openingStock,
      receivedStock: Number(row.receivedStock),
      soldStock: Number(row.soldStock),
      adjustedStock: Number(row.adjustedStock),
      closingStock: closing,
      inventoryValuation: Number((closing * costPrice).toFixed(2)),
    };
  });
};

// 2. GOODS RECEIVED NOTE (GRN) REPORT
const getGoodsReceivedNotes = async ({ poNumber, supplierId, startDate, endDate }) => {
  let query = `
    SELECT 
      po.id AS purchaseOrderId,
      po.poNumber,
      po.receivedAt,
      po.notes,
      s.name AS supplierName,
      s.phone AS supplierPhone,
      u.name AS receivedByStaff,
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'productId', poi.productId,
          'productSku', p.sku,
          'productName', p.name,
          'quantityOrdered', poi.quantityOrdered,
          'quantityReceived', poi.quantityReceived,
          'unitCost', poi.unitCost,
          'lineTotal', ROUND(poi.quantityReceived * poi.unitCost, 2)
        )
      ) AS receivedItems,
      SUM(poi.quantityReceived) AS totalUnitsReceived,
      ROUND(SUM(poi.quantityReceived * poi.unitCost), 2) AS totalReceivedCost
    FROM purchase_orders po
    INNER JOIN suppliers s ON po.supplierId = s.id
    INNER JOIN users u ON po.createdById = u.id
    INNER JOIN purchase_order_items poi ON po.id = poi.purchaseOrderId
    INNER JOIN products p ON poi.productId = p.id
    WHERE po.status = 'RECEIVED'
  `;

  const params = [];

  if (poNumber) {
    query += " AND po.poNumber = ?";
    params.push(poNumber);
  }

  if (supplierId) {
    query += " AND po.supplierId = ?";
    params.push(supplierId);
  }

  if (startDate) {
    query += " AND po.receivedAt >= ?";
    params.push(`${startDate} 00:00:00`);
  }

  if (endDate) {
    query += " AND po.receivedAt <= ?";
    params.push(`${endDate} 23:59:59`);
  }

  query += " GROUP BY po.id ORDER BY po.receivedAt DESC";

  const [rows] = await db.query(query, params);
  return rows.map((row) => ({
    ...row,
    receivedItems: typeof row.receivedItems === "string" ? JSON.parse(row.receivedItems) : row.receivedItems,
  }));
};

// 3. PRODUCT PROFITABILITY & MARGIN REPORT
const getProfitabilityReport = async ({ startDate, endDate }) => {
  const [rows] = await db.query(
    `SELECT 
       p.id AS productId,
       p.sku,
       p.name AS productName,
       p.costPrice,
       p.sellingPrice,
       COALESCE(SUM(si.quantity), 0) AS unitsSold,
       COALESCE(SUM(si.lineTotal), 0) AS totalRevenue,
       COALESCE(SUM(si.quantity * p.costPrice), 0) AS totalCostOfGoodsSold,
       COALESCE(SUM(si.lineTotal - (si.quantity * p.costPrice)), 0) AS grossProfit
     FROM products p
     LEFT JOIN sale_items si ON p.id = si.productId
     LEFT JOIN sales s ON si.saleId = s.id AND s.status = 'COMPLETED'
       AND s.createdAt BETWEEN ? AND ?
     GROUP BY p.id
     HAVING unitsSold > 0
     ORDER BY grossProfit DESC`,
    [`${startDate} 00:00:00`, `${endDate} 23:59:59`]
  );

  return rows.map((r) => {
    const rev = Number(r.totalRevenue);
    const profit = Number(r.grossProfit);
    const margin = rev > 0 ? Number(((profit / rev) * 100).toFixed(2)) : 0;

    return {
      productId: r.productId,
      sku: r.sku,
      productName: r.productName,
      costPrice: Number(r.costPrice),
      sellingPrice: Number(r.sellingPrice),
      unitsSold: Number(r.unitsSold),
      totalRevenue: rev,
      totalCostOfGoodsSold: Number(r.totalCostOfGoodsSold),
      grossProfit: profit,
      grossProfitMarginPercent: margin,
    };
  });
};

// 4. LOW STOCK & STOCKOUT RISK REPORT
const getLowStockAlertReport = async () => {
  const [rows] = await db.query(
    `SELECT 
       p.id AS productId,
       p.sku,
       p.name AS productName,
       c.name AS categoryName,
       s.name AS supplierName,
       s.phone AS supplierPhone,
       s.leadTimeDays,
       p.currentStock,
       p.safetyStock,
       CASE 
         WHEN p.currentStock = 0 THEN 'OUT_OF_STOCK'
         WHEN p.currentStock <= p.safetyStock THEN 'CRITICAL_SAFETY_BREACH'
         ELSE 'WARNING'
       END AS stockStatus
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     LEFT JOIN suppliers s ON p.supplierId = s.id
     WHERE p.isActive = 1 AND p.currentStock <= p.safetyStock
     ORDER BY p.currentStock ASC`
  );
  return rows;
};

// 5. CASHIER SALES & PAYMENT SETTLEMENT REPORT
const getCashierSalesReport = async ({ date }) => {
  const dayStart = `${date} 00:00:00`;
  const dayEnd = `${date} 23:59:59`;

  const [rows] = await db.query(
    `SELECT 
       u.id AS cashierId,
       u.name AS cashierName,
       COUNT(DISTINCT s.id) AS totalTransactions,
       COALESCE(SUM(s.subtotal), 0) AS grossSales,
       COALESCE(SUM(s.discount), 0) AS totalDiscounts,
       COALESCE(SUM(s.totalAmount), 0) AS netSales,
       COALESCE(SUM(CASE WHEN pay.method = 'CASH' THEN pay.amount ELSE 0 END), 0) AS cashCollected,
       COALESCE(SUM(CASE WHEN pay.method = 'BAKONG_QR' THEN pay.amount ELSE 0 END), 0) AS bakongCollected
     FROM users u
     INNER JOIN sales s ON u.id = s.createdById AND s.status = 'COMPLETED' AND s.createdAt BETWEEN ? AND ?
     LEFT JOIN payments pay ON s.id = pay.saleId AND pay.status = 'PAID'
     GROUP BY u.id
     ORDER BY netSales DESC`,
    [dayStart, dayEnd]
  );

  return rows;
};

module.exports = {
  getStockSummaryReport,
  getGoodsReceivedNotes,
  getProfitabilityReport,
  getLowStockAlertReport,
  getCashierSalesReport,
};