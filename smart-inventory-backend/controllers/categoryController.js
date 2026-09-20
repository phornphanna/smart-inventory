const categoryModel = require("../models/categoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const existing = await categoryModel.getCategoryByName(name.trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category name already exists",
      });
    }

    const categoryId = await categoryModel.createCategory({
      name: name.trim(),
      description: description ? description.trim() : null,
    });

    const newCategory = await categoryModel.getCategoryById(categoryId);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await categoryModel.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const duplicateCheck = await categoryModel.getCategoryByName(name.trim());
    if (duplicateCheck && Number(duplicateCheck.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Category name already in use by another category",
      });
    }

    await categoryModel.updateCategory(id, {
      name: name.trim(),
      description: description !== undefined ? description : existing.description,
    });

    const updatedCategory = await categoryModel.getCategoryById(id);

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await categoryModel.getCategoryById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const dependentProducts = await categoryModel.countProductsInCategory(id);
    if (dependentProducts > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${dependentProducts} product(s) still linked to it`,
      });
    }

    await categoryModel.deleteCategory(id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};