const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/", requireAuth, paymentController.processPayment);
router.get("/:id", requireAuth, paymentController.getPayment);
router.post("/:id/confirm", requireAuth, paymentController.confirmPayment);
router.get("/receipt/:saleId" , paymentController.getReceipt);
router.get(
  "/receipt/:saleId/pdf",
  requireAuth,
  paymentController.downloadReceiptPdf
);
module.exports = router;