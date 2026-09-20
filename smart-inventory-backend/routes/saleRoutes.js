const express = require("express");
const router = express.Router();
const saleController = require("../controllers/saleController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// View sales and perform checkout (STAFF, MANAGER, ADMIN)
router.get("/", requireAuth, saleController.getSales);
router.get("/:id", requireAuth, saleController.getSale);
router.post("/", requireAuth, saleController.createSale);

// Cancel sale (ADMIN and MANAGER only)
router.post(
  "/:id/cancel",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  saleController.cancelSale
);

module.exports = router;