const db = require("../config/db");

const getAllCategories = async () => {
  const [rows] = await db.query(
    "SELECT * FROM categories ORDER BY id DESC"
  );
  return rows;
};

const getCategoryById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

const getCategoryByName = async (name) => {
  const [rows] = await db.query(
    "SELECT * FROM categories WHERE name = ?",
    [name]
  );
  return rows[0] || null;
};

const createCategory = async ({ name, description }) => {
  const [result] = await db.query(
    "INSERT INTO categories (name, description) VALUES (?, ?)",
    [name, description || null]
  );
  return result.insertId;
};

const updateCategory = async (id, { name, description }) => {
  await db.query(
    "UPDATE categories SET name = ?, description = ? WHERE id = ?",
    [name, description || null, id]
  );
};

const countProductsInCategory = async (categoryId) => {
  const [rows] = await db.query(
    "SELECT COUNT(*) AS total FROM products WHERE categoryId = ?",
    [categoryId]
  );
  return rows[0].total;
};

const deleteCategory = async (id) => {
  await db.query("DELETE FROM categories WHERE id = ?", [id]);
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategory,
  countProductsInCategory,
  deleteCategory,
};