const express = require("express");
const router = express.Router();
const analysisController = require("../controllers/analysisController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get(
  "/inventory",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  analysisController.getInventoryAnalysis
);

router.get(
  "/products/:id/velocity",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  analysisController.getProductVelocity
);

module.exports = router;