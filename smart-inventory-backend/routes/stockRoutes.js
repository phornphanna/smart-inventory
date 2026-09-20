const express = require("express");
const router = express.Router();
const stockMovementController = require("../controllers/stockMovementController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Auditing endpoints
router.get("/movements", requireAuth, stockMovementController.getMovements);
router.get("/movements/:productId", requireAuth, stockMovementController.getMovementsByProduct);
router.post(
  "/adjust",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  stockMovementController.adjustStock
);




module.exports = router;