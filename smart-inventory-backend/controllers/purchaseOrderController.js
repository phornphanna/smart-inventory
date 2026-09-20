const purchaseOrderModel = require("../models/purchaseOrderModel");
const supplierModel = require("../models/supplierModel");
const productModel = require("../models/productModel");

// POST /api/purchase-orders
const createPurchaseOrder = async (req, res, next) => {
  try {
    const { supplierId, notes, items } = req.body;
    const userId = req.user.userId;

    if (!supplierId) {
      return res.status(400).json({
        success: false,
        message: "supplierId is required",
      });
    }

    const supplier = await supplierModel.getSupplierById(supplierId);
    if (!supplier) {
      return res.status(400).json({
        success: false,
        message: "Supplier does not exist",
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Purchase order must contain at least one item",
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !item.quantityOrdered || Number(item.quantityOrdered) <= 0) {
        return res.status(400).json({
          success: false,
          message: "Each item must have a valid productId and a quantityOrdered greater than 0",
        });
      }

      const product = await productModel.getProductById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product with ID ${item.productId} does not exist`,
        });
      }

      if (item.unitCost === undefined || Number(item.unitCost) < 0) {
        item.unitCost = product.costPrice; // Fallback to current product costPrice
      }
    }

    const sequence = await purchaseOrderModel.getNextPoSequence();
    const poNumber = `PO-${String(sequence).padStart(3, "0")}`;

    const poId = await purchaseOrderModel.createPurchaseOrderWithItems({
      poNumber,
      supplierId,
      createdById: userId,
      notes,
      items,
    });

    const newPO = await purchaseOrderModel.getPurchaseOrderById(poId);

    res.status(201).json({
      success: true,
      message: "Purchase Order created successfully",
      data: newPO,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/purchase-orders
const getPurchaseOrders = async (req, res, next) => {
  try {
    const pos = await purchaseOrderModel.getAllPurchaseOrders();
    res.status(200).json({
      success: true,
      message: "Purchase Orders retrieved successfully",
      data: pos,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/purchase-orders/:id
const getPurchaseOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const po = await purchaseOrderModel.getPurchaseOrderById(id);

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Purchase Order retrieved successfully",
      data: po,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/purchase-orders/:id/receive
const receiveStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { items } = req.body;
    const userId = req.user.userId;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Array of received items is required",
      });
    }

    await purchaseOrderModel.receiveStockTransaction(id, items, userId);

    const updatedPO = await purchaseOrderModel.getPurchaseOrderById(id);

    res.status(200).json({
      success: true,
      message: "Stock received successfully and inventory balances updated",
      data: updatedPO,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/purchase-orders/:id (Cancel)
const cancelPurchaseOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const po = await purchaseOrderModel.getPurchaseOrderById(id);
    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found",
      });
    }

    if (po.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel Purchase Order with status: ${po.status}`,
      });
    }

    await purchaseOrderModel.cancelPurchaseOrder(id);

    res.status(200).json({
      success: true,
      message: "Purchase Order cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPurchaseOrder,
  getPurchaseOrders,
  getPurchaseOrder,
  receiveStock,
  cancelPurchaseOrder,
};