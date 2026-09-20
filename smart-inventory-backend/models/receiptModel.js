const db = require("../config/db");

const getReceiptData = async (saleId) => {
  const [sales] = await db.query(
    `SELECT s.*, u.name AS cashierName
     FROM sales s
     LEFT JOIN users u ON s.createdById = u.id
     WHERE s.id = ?`,
    [saleId]
  );

  if (sales.length === 0) return null;
  const sale = sales[0];

  const [items] = await db.query(
    `SELECT si.quantity, si.unitPrice, si.lineTotal, p.name AS productName, p.sku
     FROM sale_items si
     LEFT JOIN products p ON si.productId = p.id
     WHERE si.saleId = ?`,
    [saleId]
  );

  const [payments] = await db.query(
    "SELECT * FROM payments WHERE saleId = ? ORDER BY id DESC LIMIT 1",
    [saleId]
  );

  const payment = payments[0] || null;

  let changeDue = 0;
  if (payment && payment.method === "CASH" && Number(payment.amount) >= Number(sale.totalAmount)) {
    changeDue = Number((Number(payment.amount) - Number(sale.totalAmount)).toFixed(2));
  }

  return {
    receiptNumber: sale.saleNumber,
    date: sale.createdAt,
    cashier: sale.cashierName,
    customer: {
      name: sale.customerName || "Walk-in Customer",
      phone: sale.customerPhone || "N/A",
    },
    items: items.map((i) => ({
      name: i.productName,
      sku: i.sku,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      lineTotal: Number(i.lineTotal),
    })),
    summary: {
      subtotal: Number(sale.subtotal),
      discount: Number(sale.discount),
      total: Number(sale.totalAmount),
    },
    payment: payment
      ? {
          method: payment.method,
          status: payment.status,
          amountPaid: Number(payment.amount),
          change: changeDue,
          transactionId: payment.transactionId,
          paidAt: payment.paidAt,
        }
      : null,
  };
};

module.exports = {
  getReceiptData,
};