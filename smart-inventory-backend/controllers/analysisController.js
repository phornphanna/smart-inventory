const analysisModel = require("../models/analysisModel");
const productModel = require("../models/productModel");

// Helper function to calculate ADS, SRD, ROP, and ROQ
const computeMetrics = (item, daysWindow = 30, reviewCycleDays = 7) => {
  const currentStock = Number(item.currentStock);
  const safetyStock = Number(item.safetyStock);
  const leadTimeDays = Number(item.leadTimeDays) || 1;
  const totalSold = Number(item.totalSold);

  // 1. Average Daily Sales (ADS) rounded to 2 decimal places
  const ads = Number((totalSold / daysWindow).toFixed(2));

  // 2. Stock Runway Days (SRD)
  let srd = null;
  if (ads > 0) {
    srd = Number((currentStock / ads).toFixed(1));
  } else {
    srd = "Infinity (No sales)";
  }

  // 3. Reorder Point (ROP) = (ADS * LeadTime) + SafetyStock
  const leadTimeDemand = ads * leadTimeDays;
  const reorderPoint = Math.ceil(leadTimeDemand + safetyStock);

  // 4. Threshold check: Does current inventory breach ROP?
  const needsReorder = currentStock <= reorderPoint;

  // 5. Reorder Quantity (ROQ)
  // Target: Cover lead time deficit + safety buffer + next review cycle
  let recommendedRoq = 0;
  if (needsReorder) {
    const cycleDemand = ads * reviewCycleDays;
    const requiredStock = Math.ceil(reorderPoint + cycleDemand);
    recommendedRoq = Math.max(0, requiredStock - currentStock);
  }

  return {
    productId: item.productId || item.id,
    productName: item.productName || item.name,
    sku: item.sku,
    currentStock,
    safetyStock,
    leadTimeDays,
    analysisPeriodDays: daysWindow,
    totalSold,
    ads,
    srd,
    reorderPoint,
    needsReorder,
    recommendedRoq,
  };
};

// GET /api/analysis/products/:id/velocity
const getProductVelocity = async (req, res, next) => {
  try {
    const { id } = req.params;
    const days = parseInt(req.query.days, 10) || 30;

    const product = await productModel.getProductById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const totalSold = await analysisModel.getProductSalesVolume(id, days);
    const metrics = computeMetrics(
      {
        ...product,
        leadTimeDays: product.supplierLeadTimeDays || 1,
        totalSold,
      },
      days
    );

    res.status(200).json({
      success: true,
      message: "Product velocity and reorder analysis computed",
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/analysis/inventory
const getInventoryAnalysis = async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 30;
    const rawData = await analysisModel.getInventoryVelocityData(days);

    const analysis = rawData.map((item) => computeMetrics(item, days));

    const totalItems = analysis.length;
    const itemsNeedingReorder = analysis.filter((a) => a.needsReorder).length;

    res.status(200).json({
      success: true,
      message: "Comprehensive inventory analysis generated",
      summary: {
        totalProductsTracked: totalItems,
        productsNeedingReorder: itemsNeedingReorder,
        analysisWindowDays: days,
      },
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductVelocity,
  getInventoryAnalysis,
  computeMetrics,
};