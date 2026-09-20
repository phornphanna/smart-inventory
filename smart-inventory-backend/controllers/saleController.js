const saleModel = require("../models/saleModel");

// POST /api/sales
const createSale = async (req, res, next) => {
  try {
    const { customerName, customerPhone, discount, items } = req.body;
    const userId = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sale checkout must contain at least one item",
      });
    }

    const sequence = await saleModel.getNextSaleSequence();
    const saleNumber = `SALE-${String(sequence).padStart(3, "0")}`;

    const saleId = await saleModel.createSaleTransaction({
      saleNumber,
      customerName,
      customerPhone,
      discount: discount || 0,
      items,
      createdById: userId,
    });

    const completedSale = await saleModel.getSaleById(saleId);

    res.status(201).json({
      success: true,
      message: "Sale completed successfully and stock deducted",
      data: completedSale,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/sales
const getSales = async (req, res, next) => {
  try {
    const sales = await saleModel.getAllSales();
    res.status(200).json({
      success: true,
      message: "Sales retrieved successfully",
      data: sales,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/sales/:id
const getSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sale = await saleModel.getSaleById(id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sale retrieved successfully",
      data: sale,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/sales/:id/cancel
const cancelSale = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    await saleModel.cancelSaleTransaction(id, userId);

    const cancelledSale = await saleModel.getSaleById(id);

    res.status(200).json({
      success: true,
      message: "Sale cancelled successfully and stock restored",
      data: cancelledSale,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSale,
  getSales,
  getSale,
  cancelSale,
};