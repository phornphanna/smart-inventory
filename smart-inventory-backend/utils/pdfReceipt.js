const PDFDocument = require("pdfkit");

/**
 * Streams a formatted 80mm thermal/standard receipt PDF directly to the Express response stream
 * @param {Object} receipt - Structured receipt data from receiptModel.js
 * @param {Object} res - Express response object
 */
const generatePdfReceiptStream = (receipt, res) => {
  // Setup small thermal receipt dimensions (approx 80mm width: 226 points)
  const doc = new PDFDocument({
    size: [226, 600],
    margins: { top: 15, bottom: 15, left: 15, right: 15 },
  });

  // Pipe the PDF directly to the client response stream
  doc.pipe(res);

  // --- Header ---
  doc.fontSize(12).font("Helvetica-Bold").text("SMART INVENTORY", { align: "center" });
  doc.fontSize(8).font("Helvetica").text("Phnom Penh, Cambodia", { align: "center" });
  doc.text("Tel: +855 12 345 678", { align: "center" });
  doc.moveDown(0.5);

  doc.text("------------------------------------------------", { align: "center" });
  doc.fontSize(7);
  doc.text(`Receipt: ${receipt.receiptNumber}`);
  doc.text(`Date: ${new Date(receipt.date).toLocaleString()}`);
  doc.text(`Cashier: ${receipt.cashier || "Staff"}`);
  doc.text(`Customer: ${receipt.customer.name}`);
  doc.text("------------------------------------------------", { align: "center" });

  // --- Items Header ---
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold");
  doc.text("Item", 15, doc.y, { width: 95, continued: true });
  doc.text("Qty", 110, doc.y, { width: 30, align: "center", continued: true });
  doc.text("Price", 140, doc.y, { width: 35, align: "right", continued: true });
  doc.text("Total", 175, doc.y, { width: 35, align: "right" });
  doc.font("Helvetica");

  // --- Items Rows ---
  receipt.items.forEach((item) => {
    doc.text(item.name, 15, doc.y, { width: 95, continued: true });
    doc.text(item.quantity.toString(), 110, doc.y, { width: 30, align: "center", continued: true });
    doc.text(`$${item.unitPrice.toFixed(2)}`, 140, doc.y, { width: 35, align: "right", continued: true });
    doc.text(`$${item.lineTotal.toFixed(2)}`, 175, doc.y, { width: 35, align: "right" });
  });

  // --- Summary ---
  doc.moveDown(0.5);
  doc.text("------------------------------------------------", { align: "center" });
  
  const rightColumnX = 110;
  const valColumnX = 150;
  const valWidth = 60;

  doc.text("Subtotal:", rightColumnX, doc.y, { continued: true });
  doc.text(`$${receipt.summary.subtotal.toFixed(2)}`, valColumnX, doc.y, { width: valWidth, align: "right" });

  if (receipt.summary.discount > 0) {
    doc.text("Discount:", rightColumnX, doc.y, { continued: true });
    doc.text(`-$${receipt.summary.discount.toFixed(2)}`, valColumnX, doc.y, { width: valWidth, align: "right" });
  }

  doc.font("Helvetica-Bold").fontSize(9);
  doc.text("TOTAL:", rightColumnX, doc.y, { continued: true });
  doc.text(`$${receipt.summary.total.toFixed(2)}`, valColumnX, doc.y, { width: valWidth, align: "right" });
  doc.font("Helvetica").fontSize(7);

  // --- Payment Breakdown ---
  if (receipt.payment) {
    doc.moveDown(0.5);
    doc.text(`Payment: ${receipt.payment.method}`);
    doc.text(`Status: ${receipt.payment.status}`);
    doc.text(`Paid: $${receipt.payment.amountPaid.toFixed(2)}`);
    
    if (receipt.payment.method === "CASH") {
      doc.text(`Change Due: $${receipt.payment.change.toFixed(2)}`);
    } else if (receipt.payment.transactionId) {
      doc.text(`Ref: ${receipt.payment.transactionId}`);
    }
  }

  // --- Footer ---
  doc.moveDown(1);
  doc.text("Thank you for your purchase!", { align: "center" });
  doc.text("Powered by Smart Inventory POS", { align: "center" });

  // Finalize PDF
  doc.end();
};

module.exports = {
  generatePdfReceiptStream,
};