const stockMovementModel = require("../models/stockMovementModel");
const productModel = require("../models/productModel");

// GET /api/stock/movements
const getMovements = async (req, res, next) => {
  try {
    const { productId, type, startDate, endDate } = req.query;

    const movements = await stockMovementModel.getAllMovements({
      productId,
      type,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      message: "Stock movement ledger retrieved successfully",
      count: movements.length,
      data: movements,
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
        message: "An adjustment reason is mandatory (e.g. 'Damaged goods', 'Monthly physical count')",
      });
    }

    const result = await stockMovementModel.adjustStockTransaction({
      productId: Number(productId),
      newStock: Number(newStock),
      reason: reason.trim(),
      userId,
    });

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