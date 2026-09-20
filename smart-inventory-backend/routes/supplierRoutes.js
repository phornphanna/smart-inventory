const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", requireAuth, supplierController.getSuppliers);
router.get("/:id", requireAuth, supplierController.getSupplier);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  supplierController.createSupplier
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  supplierController.updateSupplier
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  supplierController.deleteSupplier
);

module.exports = router;