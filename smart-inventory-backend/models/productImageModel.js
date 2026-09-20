const db = require("../config/db");

const getImagesByProductId = async (productId) => {
  const [rows] = await db.query(
    "SELECT * FROM product_images WHERE productId = ? ORDER BY id DESC",
    [productId]
  );
  return rows;
};

const getImageById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM product_images WHERE id = ?",
    [id]
  );
  return rows[0] || null;
};

const addProductImage = async (productId, imageUrl) => {
  const [result] = await db.query(
    "INSERT INTO product_images (productId, imageUrl) VALUES (?, ?)",
    [productId, imageUrl]
  );
  return result.insertId;
};

const deleteProductImage = async (id) => {
  await db.query("DELETE FROM product_images WHERE id = ?", [id]);
};

module.exports = {
  getImagesByProductId,
  getImageById,
  addProductImage,
  deleteProductImage,
};