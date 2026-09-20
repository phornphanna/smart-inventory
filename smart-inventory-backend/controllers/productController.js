const productModel = require("../models/productModel");
const categoryModel = require("../models/categoryModel");
const supplierModel = require("../models/supplierModel");

const getProducts = async (req, res, next) => {
  try {
    const { categoryId, isActive } = req.query;
    const products = await productModel.getAllProducts({ categoryId, isActive });

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query parameter 'q' is required for search",
      });
    }

    const products = await productModel.searchProducts(q.trim());

    res.status(200).json({
      success: true,
      message: "Products matching query retrieved",
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await productModel.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};



const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      sku,
      barcode,
      description,
      costPrice,
      sellingPrice,
      currentStock,
      safetyStock,
      categoryId,
      supplierId,
    } = req.body;

    // 1. Validate required product name
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Product name is required",
      });
    }

    // 2. Validate Category if provided
    let categoryRecord = null;
    if (categoryId) {
      categoryRecord = await categoryModel.getCategoryById(categoryId);
      if (!categoryRecord) {
        return res.status(400).json({
          success: false,
          message: "Provided categoryId does not exist",
        });
      }
    }

    // 3. Auto-generate SKU if not manually provided
    let finalSku = sku ? sku.trim() : null;

    if (!finalSku) {
      // Pick prefix from Category (first 3 letters) or fallback to 'PRD'
      let prefix = "PRD";
      if (categoryRecord && categoryRecord.name) {
        prefix = categoryRecord.name
          .replace(/[^a-zA-Z]/g, "")
          .substring(0, 3)
          .toUpperCase();
        if (!prefix) prefix = "PRD";
      }

      const seqNumber = await productModel.getNextSkuSequence(prefix);
      // Formats number into 3-digit padded string: 1 -> "001", 23 -> "023"
      finalSku = `${prefix}-${String(seqNumber).padStart(3, "0")}`;
    }

    // 4. Verify SKU uniqueness
    const existingSku = await productModel.getProductBySku(finalSku);
    if (existingSku) {
      return res.status(409).json({
        success: false,
        message: `Product SKU '${finalSku}' already exists`,
      });
    }

    // 5. Numerical validations
    if (costPrice !== undefined && Number(costPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Cost price cannot be negative",
      });
    }

    if (sellingPrice !== undefined && Number(sellingPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Selling price cannot be negative",
      });
    }

    if (currentStock !== undefined && Number(currentStock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    if (supplierId) {
      const supplier = await supplierModel.getSupplierById(supplierId);
      if (!supplier) {
        return res.status(400).json({
          success: false,
          message: "Provided supplierId does not exist",
        });
      }
    }

    // 6. Save product
    const newProductId = await productModel.createProduct({
      name: name.trim(),
      sku: finalSku,
      barcode: barcode ? barcode.trim() : null,
      description: description ? description.trim() : null,
      costPrice: Number(costPrice) || 0,
      sellingPrice: Number(sellingPrice) || 0,
      currentStock: Number(currentStock) || 0,
      safetyStock: Number(safetyStock) || 0,
      categoryId: categoryId || null,
      supplierId: supplierId || null,
    });

    const newProduct = await productModel.getProductById(newProductId);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await productModel.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      name,
      sku,
      barcode,
      description,
      costPrice,
      sellingPrice,
      currentStock,
      safetyStock,
      categoryId,
      supplierId,
      isActive,
    } = req.body;

    const targetSku = sku ? sku.trim() : existing.sku;
    const duplicateSku = await productModel.getProductBySku(targetSku);
    if (duplicateSku && Number(duplicateSku.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Product SKU already in use by another product",
      });
    }

    if (categoryId) {
      const category = await categoryModel.getCategoryById(categoryId);
      if (!category) {
        return res.status(400).json({
          success: false,
          message: "Provided categoryId does not exist",
        });
      }
    }

    if (supplierId) {
      const supplier = await supplierModel.getSupplierById(supplierId);
      if (!supplier) {
        return res.status(400).json({
          success: false,
          message: "Provided supplierId does not exist",
        });
      }
    }

    await productModel.updateProduct(id, {
      name: name ? name.trim() : existing.name,
      sku: targetSku,
      barcode: barcode !== undefined ? barcode : existing.barcode,
      description: description !== undefined ? description : existing.description,
      costPrice: costPrice !== undefined ? Number(costPrice) : existing.costPrice,
      sellingPrice: sellingPrice !== undefined ? Number(sellingPrice) : existing.sellingPrice,
      currentStock: currentStock !== undefined ? Number(currentStock) : existing.currentStock,
      safetyStock: safetyStock !== undefined ? Number(safetyStock) : existing.safetyStock,
      categoryId: categoryId !== undefined ? categoryId : existing.categoryId,
      supplierId: supplierId !== undefined ? supplierId : existing.supplierId,
      isActive: isActive !== undefined ? isActive : existing.isActive,
    });

    const updated = await productModel.getProductById(id);

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await productModel.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await productModel.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  searchProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};