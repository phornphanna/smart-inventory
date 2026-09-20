/**
 * Format currency to USD
 */
const formatUSD = (val) => `$${Number(val || 0).toFixed(2)}`;

/**
 * Format date in Phnom Penh local time
 */
const formatDateTimeKH = (date = new Date()) => {
  return new Date(date).toLocaleString("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    dateStyle: "medium",
    timeStyle: "short",
  });
};

// 1. SALE COMPLETED NOTIFICATION
const saleCompletedTemplate = (sale, items, payment, cashierName) => {
  const isBakong = payment?.method === "BAKONG_QR";
  const payMethodText = isBakong ? "🇰🇭 KHQR (Bakong)" : "💵 សាច់ប្រាក់សុទ្ធ (Cash)";

  let msg = `🎉 *ការលក់ជោគជ័យ | NEW SALE COMPLETED*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🧾 *វិក្កយបត្រ (Receipt):* \`${sale.saleNumber}\`\n`;
  msg += `📅 *កាលបរិច្ឆេទ (Date):* ${formatDateTimeKH(sale.createdAt)}\n`;
  msg += `👤 *អតិថិជន (Customer):* ${sale.customerName || "អតិថិជនទូទៅ (Walk-in)"}\n`;
  msg += `👨‍💼 *បេឡាករ (Cashier):* ${cashierName || "Staff"}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *ទំនិញដែលបានលក់ (Items Sold):*\n`;

  items.forEach((item, idx) => {
    msg += `  ${idx + 1}. *${item.name}*\n`;
    msg += `     ▫️ ចំនួន: *${item.quantity}* × ${formatUSD(item.unitPrice)} = *${formatUSD(item.lineTotal)}*\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *សរុបរង (Subtotal):* ${formatUSD(sale.subtotal)}\n`;
  if (Number(sale.discount) > 0) {
    msg += `🏷️ *បញ្ចុះតម្លៃ (Discount):* -${formatUSD(sale.discount)}\n`;
  }
  msg += `💵 *ទឹកប្រាក់សរុប (Total Amount):* *${formatUSD(sale.totalAmount)}*\n`;
  msg += `💳 *វិធីសាស្ត្រទូទាត់ (Payment):* ${payMethodText}\n`;

  if (isBakong && payment.transactionId) {
    msg += `🔖 *លេខយោង (Ref / Txn ID):* \`${payment.transactionId}\`\n`;
  } else if (!isBakong) {
    msg += `📥 *ប្រាក់ទទួលបាន (Received):* ${formatUSD(payment?.amount)}\n`;
    const change = Math.max(0, Number(payment?.amount || 0) - Number(sale.totalAmount));
    msg += `🔄 *ប្រាក់អាប់ (Change):* ${formatUSD(change)}\n`;
  }

  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `✨ _ប្រព័ន្ធគ្រប់គ្រងស្តុកស្វ័យប្រវត្តិ (Smart Inventory POS)_`;

  return msg;
};

// 2. LOW STOCK & REORDER ALERT NOTIFICATION
const lowStockAlertTemplate = (items) => {
  let msg = `🚨 *ការជូនដំណឹង: ទំនិញជិតអស់ពីស្តុក*\n`;
  msg += `⚠️ *LOW STOCK & REORDER WARNING*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 *កាលបរិច្ឆេទ (Date):* ${formatDateTimeKH()}\n`;
  msg += `📊 *ចំនួនទំនិញប្រឈម (Total Alert Items):* *${items.length} មុខ*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  items.forEach((item, idx) => {
    const isOutOfStock = Number(item.currentStock) <= 0;
    const statusTag = isOutOfStock ? "🔴 *អស់ពីស្តុក (OUT OF STOCK)*" : "🟡 *ជិតអស់ (LOW STOCK)*";

    msg += `*${idx + 1}. ${item.name}*\n`;
    msg += `   🔖 *SKU:* \`${item.sku}\`\n`;
    msg += `   📊 *ស្ថានភាព (Status):* ${statusTag}\n`;
    msg += `   📦 *ស្តុកនៅសល់ (Current Stock):* *${item.currentStock}*\n`;
    msg += `   🛡️ *ស្តុកសុវត្ថិភាព (Safety Stock):* ${item.safetyStock}\n`;
    if (item.reorderPoint !== undefined) {
      msg += `   🎯 *ចំណុចត្រូវបញ្ជាទិញ (Reorder Point):* *${item.reorderPoint}*\n`;
    }
    if (item.ads !== undefined) {
      msg += `   📈 *ល្បឿនលក់ប្រចាំថ្ងៃ (ADS):* ${item.ads} ឯកតា/ថ្ងៃ\n`;
    }
    msg += `   ─────────────────────\n`;
  });

  msg += `\n🔔 *សូមមេត្តាពិនិត្យ និងបញ្ជាទិញបន្ថែមពីអ្នកផ្គត់ផ្គង់!*`;

  return msg;
};

// 3. MANUAL STOCK ADJUSTMENT ALERT NOTIFICATION
const stockAdjustmentTemplate = (adjustmentData, adminName) => {
  const { productName, sku, balanceBefore, balanceAfter, adjustedByUnits, reason } = adjustmentData;
  const isIncrease = adjustedByUnits > 0;
  const changeIcon = isIncrease ? "🟢 ឡើង (Increase)" : "🔴 ថយ (Decrease)";
  const changeSymbol = isIncrease ? `+${adjustedByUnits}` : `${adjustedByUnits}`;

  let msg = `🛠️ *ការកែសម្រួលស្តុកដោយផ្ទាល់*\n`;
  msg += `📝 *MANUAL STOCK ADJUSTMENT*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 *កាលបរិច្ឆេទ (Date):* ${formatDateTimeKH()}\n`;
  msg += `👤 *ប្រតិបត្តិកដោយ (Adjusted By):* *${adminName || "Manager/Admin"}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🏷️ *ឈ្មោះទំនិញ (Product):* *${productName}*\n`;
  if (sku) msg += `🔖 *SKU:* \`${sku}\`\n`;
  msg += `📊 *ទិសដៅកែសម្រួល (Direction):* ${changeIcon}\n`;
  msg += `🔢 *ចំនួនកែប្រែ (Difference):* *${changeSymbol}*\n`;
  msg += `📉 *ស្តុកមុនកែ (Before):* ${balanceBefore}\n`;
  msg += `📈 *ស្តុកក្រោយកែ (After):* *${balanceAfter}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📌 *មូលហេតុ (Reason/Notes):*\n`;
  msg += `👉 _${reason || "ពុំមានកំណត់ចំណាំ (No reason provided)"}_\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🔒 _កត់ត្រាចូលក្នុងសៀវភៅបញ្ជីស្តុក (Immutable Movement Ledger)_`;

  return msg;
};

module.exports = {
  saleCompletedTemplate,
  lowStockAlertTemplate,
  stockAdjustmentTemplate,
};