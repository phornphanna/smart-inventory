const paymentModel = require("../models/paymentModel");
const saleModel = require("../models/saleModel");
const receiptModel = require("../models/receiptModel");
const { sendTelegramMessage } = require("../utils/telegram");
const productModel = require("../models/productModel");
const { generatePdfReceiptStream } = require("../utils/pdfReceipt");


// Helper to inspect remaining inventory and alert if low
const triggerPostPaymentStockAlerts = async (saleId) => {
  try {
    const sale = await saleModel.getSaleById(saleId);
    if (!sale || !sale.items) return;

    for (const item of sale.items) {
      const product = await productModel.getProductById(item.productId);
      if (product && product.currentStock <= product.safetyStock) {
        const alertMsg =
          `🚨 *REAL-TIME LOW STOCK ALERT*\n\n` +
          `Product: *${product.name}* (${product.sku})\n` +
          `Current Stock: *${product.currentStock}*\n` +
          `Safety Stock Threshold: ${product.safetyStock}\n` +
          `Order Ref: ${sale.saleNumber}\n\n` +
          `⚠️ _Immediate reordering recommended._`;

        await sendTelegramMessage(alertMsg);
      }
    }
  } catch (err) {
    console.error("Failed to check real-time stock alert:", err.message);
  }
};

// POST /api/payments
const processPayment = async (req, res, next) => {
  try {
    const { saleId, method, amountReceived } = req.body;
    const userId = req.user.userId;

    if (!saleId || !method) {
      return res.status(400).json({
        success: false,
        message: "saleId and payment method (CASH or BAKONG_QR) are required",
      });
    }

    const sale = await saleModel.getSaleById(saleId);
    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    if (sale.status === "COMPLETED") {
      return res.status(400).json({
        success: false,
        message: "Sale is already completed and paid",
      });
    }

    const existingPayment = await paymentModel.getPaymentBySaleId(saleId);
    if (existingPayment && existingPayment.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "This sale already has a confirmed payment",
      });
    }

    // 1. CASH Payment Flow
    if (method === "CASH") {
      const received = Number(amountReceived);
      if (isNaN(received) || received < Number(sale.totalAmount)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient cash received. Total is $${sale.totalAmount}, received $${received || 0}`,
        });
      }

      // Create record
      const paymentId = await paymentModel.createPaymentRecord({
        saleId,
        method: "CASH",
        amount: received,
        status: "PENDING",
      });

      // Confirm immediately and deduct inventory
      await paymentModel.finalizePaymentTransaction({
        paymentId,
        userId,
        amountReceived: received,
      });

      triggerPostPaymentStockAlerts(saleId);

      const receipt = await receiptModel.getReceiptData(saleId);

      return res.status(200).json({
        success: true,
        message: "Cash payment completed successfully",
        data: receipt,
      });
    }

    // 2. BAKONG QR Payment Flow
    if (method === "BAKONG_QR") {
      // Generate a mock Bakong transaction reference
      const transactionId = `BAKONG-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      let paymentId;
      if (existingPayment) {
        paymentId = existingPayment.id;
      } else {
        paymentId = await paymentModel.createPaymentRecord({
          saleId,
          method: "BAKONG_QR",
          amount: sale.totalAmount,
          status: "PENDING",
          transactionId,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Bakong QR payment initiated. Awaiting customer confirmation.",
        data: {
          paymentId,
          saleId: sale.id,
          amount: Number(sale.totalAmount),
          transactionId,
          qrPayload: `khqr://transfer?amount=${sale.totalAmount}&txn=${transactionId}`,
          status: "PENDING",
        },
      });
    }

    return res.status(400).json({
      success: false,
      message: "Unsupported payment method. Choose CASH or BAKONG_QR",
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/payments/:id/confirm (Confirm Bakong QR)
const confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const payment = await paymentModel.getPaymentById(id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    if (payment.status === "PAID") {
      return res.status(400).json({
        success: false,
        message: "Payment has already been confirmed",
      });
    }

    await paymentModel.finalizePaymentTransaction({
      paymentId: id,
      userId,
    });

    await paymentModel.finalizePaymentTransaction({
      paymentId: id,
      userId,
    });

    const receipt = await receiptModel.getReceiptData(payment.saleId);

    res.status(200).json({
      success: true,
      message: "Payment confirmed successfully and inventory deducted",
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/:id
const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await paymentModel.getPaymentById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment retrieved successfully",
      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/payments/receipt/:saleId
const getReceipt = async (req, res, next) => {
  try {
    const { saleId } = req.params;
    const receipt = await receiptModel.getReceiptData(saleId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found for this sale",
      });
    }

    res.status(200).json({
      success: true,
      message: "Receipt retrieved successfully",
      data: receipt,
    });
  } catch (error) {
    next(error);
  }
};


const downloadReceiptPdf = async (req, res, next) => {
  try {
    const { saleId } = req.params;
    const receipt = await receiptModel.getReceiptData(saleId);

    if (!receipt) {
      return res.status(404).json({
        success: false,
        message: "Receipt not found for this sale",
      });
    }

    // Set headers for inline preview or download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="Receipt-${receipt.receiptNumber}.pdf"`
    );

    generatePdfReceiptStream(receipt, res);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processPayment,
  confirmPayment,
  getPayment,
  getReceipt,
  downloadReceiptPdf
};