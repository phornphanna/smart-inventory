const supplierModel = require("../models/supplierModel");

const getSuppliers = async (req, res, next) => {
  try {
    const suppliers = await supplierModel.getAllSuppliers();
    res.status(200).json({
      success: true,
      message: "Suppliers retrieved successfully",
      data: suppliers,
    });
  } catch (error) {
    next(error);
  }
};

const getSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const supplier = await supplierModel.getSupplierById(id);

    if (!supplier) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Supplier retrieved successfully",
      data: supplier,
    });
  } catch (error) {
    next(error);
  }
};

const createSupplier = async (req, res, next) => {
  try {
    const { name, email, phone, address, leadTimeDays } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name is required",
      });
    }

    const leadDays = Number(leadTimeDays) || 1;
    if (leadDays < 0) {
      return res.status(400).json({
        success: false,
        message: "Lead time days cannot be negative",
      });
    }

    const supplierId = await supplierModel.createSupplier({
      name: name.trim(),
      email: email ? email.trim() : null,
      phone: phone ? phone.trim() : null,
      address: address ? address.trim() : null,
      leadTimeDays: leadDays,
    });

    const newSupplier = await supplierModel.getSupplierById(supplierId);

    res.status(201).json({
      success: true,
      message: "Supplier created successfully",
      data: newSupplier,
    });
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, leadTimeDays } = req.body;

    const existing = await supplierModel.getSupplierById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Supplier name is required",
      });
    }

    const leadDays = leadTimeDays !== undefined ? Number(leadTimeDays) : existing.leadTimeDays;
    if (leadDays < 0) {
      return res.status(400).json({
        success: false,
        message: "Lead time days cannot be negative",
      });
    }

    await supplierModel.updateSupplier(id, {
      name: name.trim(),
      email: email !== undefined ? email : existing.email,
      phone: phone !== undefined ? phone : existing.phone,
      address: address !== undefined ? address : existing.address,
      leadTimeDays: leadDays,
    });

    const updated = await supplierModel.getSupplierById(id);

    res.status(200).json({
      success: true,
      message: "Supplier updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existing = await supplierModel.getSupplierById(id);
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Supplier not found",
      });
    }

    await supplierModel.deleteSupplier(id);

    res.status(200).json({
      success: true,
      message: "Supplier deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};