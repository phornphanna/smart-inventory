const express = require("express");
const router = express.Router();
const purchaseOrderController = require("../controllers/purchaseOrderController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  purchaseOrderController.getPurchaseOrders
);

router.get(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  purchaseOrderController.getPurchaseOrder
);

router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  purchaseOrderController.createPurchaseOrder
);



router.post(
  "/:id/receive",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  purchaseOrderController.receiveStock
);

router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  purchaseOrderController.cancelPurchaseOrder
);

module.exports = router;