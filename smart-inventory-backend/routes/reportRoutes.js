const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// All reports are restricted to ADMIN and MANAGER
router.use(requireAuth, requireRole("ADMIN", "MANAGER"));

router.get("/stock-summary", reportController.getStockSummary);
router.get("/goods-received-notes", reportController.getGoodsReceivedNotes);
router.get("/profitability", reportController.getProfitability);
router.get("/low-stock", reportController.getLowStock);
router.get("/cashier-sales", reportController.getCashierSales);

module.exports = router;