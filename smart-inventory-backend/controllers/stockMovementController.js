const stockMovementModel = require("../models/stockMovementModel");
const productModel = require("../models/productModel");
const { sendTelegramMessage } = require("../utils/telegram");
const { stockAdjustmentTemplate } = require("../utils/telegramTemplates");
const userModel = require("../models/userModel");
// GET /api/stock/movements
const getMovements = async (req, res, next) => {
  try {
    const result = await stockMovementModel.getStockMovementsPaginated(req.query);

    res.status(200).json({
      success: true,
      message: "Stock movements retrieved successfully",
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};
// GET /api/stock/movements/:productId
const getMovementsByProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await productModel.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const movements = await stockMovementModel.getMovementsByProductId(productId);

    res.status(200).json({
      success: true,
      message: `Stock history for product '${product.name}' retrieved`,
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.currentStock,
      },
      count: movements.length,
      data: movements,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/stock/adjust
const adjustStock = async (req, res, next) => {
  try {
    const { productId, newStock, reason } = req.body;
    const userId = req.user.userId;

    if (!productId || newStock === undefined) {
      return res.status(400).json({
        success: false,
        message: "productId and newStock are required",
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "An adjustment reason is mandatory",
      });
    }

    const result = await stockMovementModel.adjustStockTransaction({
      productId: Number(productId),
      newStock: Number(newStock),
      reason: reason.trim(),
      userId,
    });

    const actor = await userModel.findById(userId);

    // result now contains { ... reason: "Your reason text", sku: "..." }
    const telegramMessage = stockAdjustmentTemplate(
      result,
      actor ? actor.name : "Admin/Manager"
    );

    sendTelegramMessage(telegramMessage).catch((err) =>
      console.error("Telegram adjustment notification failed:", err.message)
    );

    res.status(200).json({
      success: true,
      message: "Stock adjusted successfully and recorded in audit ledger",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMovements,
  getMovementsByProduct,
  adjustStock
};