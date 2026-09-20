const cron = require("node-cron");
const analysisModel = require("../models/analysisModel");
const { computeMetrics } = require("../controllers/analysisController");
const { sendTelegramMessage } = require("../utils/telegram");

// Routine that checks inventory health and generates report
const executeDailySweep = async () => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] Starting daily inventory sweep...`);

  try {
    const rawData = await analysisModel.getInventoryVelocityData(30);
    const analyzed = rawData.map((item) => computeMetrics(item, 30));

    // Filter items that breached Reorder Point (currentStock <= ROP)
    const reorderList = analyzed.filter((item) => item.needsReorder);

    console.log(
      `[Sweep Complete] Analyzed: ${analyzed.length} items. Needing reorder: ${reorderList.length} items.`
    );

    if (reorderList.length > 0) {
      let message = `⚠️ *DAILY INVENTORY REORDER SWEEP*\n`;
      message += `📅 Date: ${new Date().toLocaleDateString()}\n`;
      message += `🚨 *${reorderList.length}* product(s) require replenishment:\n\n`;

      reorderList.forEach((p, idx) => {
        message += `*${idx + 1}. ${p.productName}* (${p.sku})\n`;
        message += `   • Current Stock: *${p.currentStock}*\n`;
        message += `   • Reorder Point (ROP): ${p.reorderPoint}\n`;
        message += `   • Stock Runway: ${p.srd} days\n`;
        message += `   • Suggested Order (ROQ): *${p.recommendedRoq} units*\n\n`;
      });

      message += `_Please review and issue Purchase Orders accordingly._`;

      await sendTelegramMessage(message);
    } else {
      console.log("All stock levels healthy. No Telegram alert necessary.");
    }
  } catch (error) {
    console.error("Daily inventory sweep execution failed:", error);
  }
};

// Schedule job to run at 08:00 AM every day
// Cron format: Minute (0) Hour (8) Day (*) Month (*) DayOfWeek (*)
cron.schedule("0 8 * * *", () => {
  executeDailySweep();
});

module.exports = {
  executeDailySweep,
};