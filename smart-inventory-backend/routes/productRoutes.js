const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const productImageController = require("../controllers/productImageController");
const upload = require("../middleware/uploadMiddleware");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

// Product search and base routes
router.get("/search", requireAuth, productController.searchProducts);
router.get("/", requireAuth, productController.getProducts);

// Specific product image routes (placed before generic /:id routes)
router.put(
  "/images/:imageId",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  upload.single("image"),
  productImageController.updateImage
);

router.delete(
  "/images/:imageId",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  productImageController.deleteImage
);

// Individual product routes
router.get("/:id", requireAuth, productController.getProduct);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  productController.createProduct
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  productController.updateProduct
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  productController.deleteProduct
);

// Product images per product
router.post(
  "/:id/images",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  upload.single("image"),
  productImageController.uploadImage
);
router.get("/:id/images", requireAuth, productImageController.getProductImages);

module.exports = router;