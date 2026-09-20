const db = require("../config/db");

const getAllSuppliers = async () => {
  const [rows] = await db.query(
    "SELECT * FROM suppliers ORDER BY id DESC"
  );
  return rows;
};

const getSupplierById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM suppliers WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

const createSupplier = async ({ name, email, phone, address, leadTimeDays }) => {
  const [result] = await db.query(
    `INSERT INTO suppliers (name, email, phone, address, leadTimeDays)
     VALUES (?, ?, ?, ?, ?)`,
    [name, email || null, phone || null, address || null, leadTimeDays || 1]
  );
  return result.insertId;
};

const updateSupplier = async (id, { name, email, phone, address, leadTimeDays }) => {
  await db.query(
    `UPDATE suppliers 
     SET name = ?, email = ?, phone = ?, address = ?, leadTimeDays = ?
     WHERE id = ?`,
    [name, email || null, phone || null, address || null, leadTimeDays || 1, id]
  );
};

const deleteSupplier = async (id) => {
  await db.query("DELETE FROM suppliers WHERE id = ?", [id]);
};

module.exports = {
  getAllSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
};