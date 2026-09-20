const cron = require("node-cron");
const db = require("../config/db");
const { sendTelegramMessage } = require("../utils/telegram");
const { lowStockAlertTemplate } = require("../utils/telegramTemplates");

const runLowStockSweep = async () => {
  console.log("--> Starting inventory sweep for low stock...");

  try {
    const [products] = await db.query(`
      SELECT 
        p.id, 
        p.name, 
        p.sku, 
        p.currentStock, 
        p.safetyStock,
        COALESCE(s.leadTimeDays, 3) AS leadTimeDays
      FROM products p
      LEFT JOIN suppliers s ON p.supplierId = s.id
      WHERE p.isActive = 1
    `);

    const lowStockItems = [];

    for (const product of products) {
      const [salesData] = await db.query(
        `SELECT COALESCE(SUM(si.quantity), 0) AS totalSold
         FROM sale_items si
         JOIN sales s ON si.saleId = s.id
         WHERE si.productId = ?
           AND s.status = 'COMPLETED'
           AND s.createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
        [product.id]
      );

      const totalSold = Number(salesData[0]?.totalSold || 0);
      const ads = parseFloat((totalSold / 30).toFixed(2));
      const reorderPoint = Math.ceil(ads * product.leadTimeDays + product.safetyStock);

      if (product.currentStock <= product.safetyStock || product.currentStock <= reorderPoint) {
        lowStockItems.push({
          name: product.name,
          sku: product.sku,
          currentStock: product.currentStock,
          safetyStock: product.safetyStock,
          reorderPoint,
          ads,
        });
      }
    }

    if (lowStockItems.length === 0) {
      console.log("All products have sufficient stock. No notification needed.");
      return { triggered: false, count: 0 };
    }

    // Generate bilingual template
    const formattedMsg = lowStockAlertTemplate(lowStockItems);

    // Send Telegram alert
    await sendTelegramMessage(formattedMsg);
    console.log("Bilingual low stock Telegram alert delivered.");

    return { triggered: true, count: lowStockItems.length, items: lowStockItems };
  } catch (error) {
    console.error("Error executing daily inventory sweep:", error);
    throw error;
  }
};

// Daily cron schedule at 08:00 AM Phnom Penh time
cron.schedule(
  "0 8 * * *",
  async () => {
    console.log("Executing scheduled 08:00 AM Daily Sweep...");
    await runLowStockSweep();
  },
  { timezone: "Asia/Phnom_Penh" }
);

module.exports = { runLowStockSweep };