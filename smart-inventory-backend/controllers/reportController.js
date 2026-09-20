const reportModel = require("../models/reportModel");

// GET /api/reports/stock-summary?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&categoryId=1
const getStockSummary = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startDate = req.query.startDate || today;
    const endDate = req.query.endDate || today;
    const categoryId = req.query.categoryId || null;

    const data = await reportModel.getStockSummaryReport({ startDate, endDate, categoryId });

    const totalInventoryValue = data.reduce((sum, item) => sum + item.inventoryValuation, 0);

    res.status(200).json({
      success: true,
      message: "Stock summary report generated successfully",
      period: { startDate, endDate },
      totalValuation: Number(totalInventoryValue.toFixed(2)),
      count: data.length,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/goods-received-notes?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getGoodsReceivedNotes = async (req, res, next) => {
  try {
    const { poNumber, supplierId, startDate, endDate } = req.query;

    const notes = await reportModel.getGoodsReceivedNotes({
      poNumber,
      supplierId,
      startDate,
      endDate,
    });

    res.status(200).json({
      success: true,
      message: "Goods Received Notes (GRN) report generated",
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/profitability?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getProfitability = async (req, res, next) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startDate = req.query.startDate || today;
    const endDate = req.query.endDate || today;

    const items = await reportModel.getProfitabilityReport({ startDate, endDate });

    const totalRevenue = items.reduce((sum, i) => sum + i.totalRevenue, 0);
    const totalProfit = items.reduce((sum, i) => sum + i.grossProfit, 0);

    res.status(200).json({
      success: true,
      message: "Profitability & margin report generated",
      period: { startDate, endDate },
      financialSummary: {
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalGrossProfit: Number(totalProfit.toFixed(2)),
        overallMarginPercent: totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(2)) : 0,
      },
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/low-stock
const getLowStock = async (req, res, next) => {
  try {
    const items = await reportModel.getLowStockAlertReport();

    res.status(200).json({
      success: true,
      message: "Low stock & risk alert report retrieved",
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/reports/cashier-sales?date=YYYY-MM-DD
const getCashierSales = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    const data = await reportModel.getCashierSalesReport({ date });

    res.status(200).json({
      success: true,
      message: `Cashier settlement report for ${date}`,
      date,
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStockSummary,
  getGoodsReceivedNotes,
  getProfitability,
  getLowStock,
  getCashierSales,
};