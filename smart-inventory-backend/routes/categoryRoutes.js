const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", requireAuth, categoryController.getCategories);
router.get("/:id", requireAuth, categoryController.getCategory);
router.post(
  "/",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  categoryController.createCategory
);
router.put(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  categoryController.updateCategory
);
router.delete(
  "/:id",
  requireAuth,
  requireRole("ADMIN", "MANAGER"),
  categoryController.deleteCategory
);

module.exports = router;