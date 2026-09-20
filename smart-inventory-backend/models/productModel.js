const db = require("../config/db");

// Helper to guarantee `images` is parsed as an array
const formatProductImages = (product) => {
  if (!product) return null;
  if (typeof product.images === "string") {
    try {
      product.images = JSON.parse(product.images);
    } catch (e) {
      product.images = [];
    }
  } else if (!product.images) {
    product.images = [];
  }
  return product;
};

// 1. Get all products with image array attached
const getAllProducts = async ({ categoryId, isActive }) => {
  let query = `
    SELECT 
      p.*,
      c.name AS categoryName,
      s.name AS supplierName,
      s.leadTimeDays AS supplierLeadTimeDays,
      COALESCE(
        (
          SELECT JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', pi.id,
              'imageUrl', pi.imageUrl,
              'publicId', pi.publicId
            )
          )
          FROM product_images pi
          WHERE pi.productId = p.id
        ),
        JSON_ARRAY()
      ) AS images
    FROM products p
    LEFT JOIN categories c ON p.categoryId = c.id
    LEFT JOIN suppliers s ON p.supplierId = s.id
    WHERE 1=1
  `;
  const params = [];

  if (categoryId) {
    query += " AND p.categoryId = ?";
    params.push(categoryId);
  }

  if (isActive !== undefined) {
    query += " AND p.isActive = ?";
    params.push(isActive === "true" || isActive === 1 ? 1 : 0);
  }

  query += " ORDER BY p.id DESC";

  const [rows] = await db.query(query, params);
  return rows;
};

// 2. Get single product by ID with image array attached
const getProductById = async (id) => {
  const [rows] = await db.query(
    `SELECT 
       p.*,
       c.name AS categoryName,
       s.name AS supplierName,
       s.leadTimeDays AS supplierLeadTimeDays,
       COALESCE(
         (
           SELECT JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', pi.id,
               'imageUrl', pi.imageUrl,
               'publicId', pi.publicId
             )
           )
           FROM product_images pi
           WHERE pi.productId = p.id
         ),
         JSON_ARRAY()
       ) AS images
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     LEFT JOIN suppliers s ON p.supplierId = s.id
     WHERE p.id = ?`,
    [id]
  );

  return rows[0] ? formatProductImages(rows[0]) : null;
};

// 3. Search products with image array attached
const searchProducts = async (term) => {
  const pattern = `%${term}%`;
  const [rows] = await db.query(
    `SELECT 
       p.*,
       c.name AS categoryName,
       s.name AS supplierName,
       COALESCE(
         (
           SELECT JSON_ARRAYAGG(
             JSON_OBJECT(
               'id', pi.id,
               'imageUrl', pi.imageUrl,
               'publicId', pi.publicId
             )
           )
           FROM product_images pi
           WHERE pi.productId = p.id
         ),
         JSON_ARRAY()
       ) AS images
     FROM products p
     LEFT JOIN categories c ON p.categoryId = c.id
     LEFT JOIN suppliers s ON p.supplierId = s.id
     WHERE p.name LIKE ? OR p.sku LIKE ? OR p.barcode LIKE ?
     ORDER BY p.id DESC`,
    [pattern, pattern, pattern]
  );
  return rows;
};

const getProductBySku = async (sku) => {
  const [rows] = await db.query(
    "SELECT * FROM products WHERE sku = ?",
    [sku]
  );
  return rows[0] || null;
};

const getNextSkuSequence = async (prefix) => {
  const [rows] = await db.query(
    "SELECT sku FROM products WHERE sku LIKE ? ORDER BY id DESC LIMIT 1",
    [`${prefix}-%`]
  );

  if (rows.length === 0) {
    return 1;
  }

  const lastSku = rows[0].sku;
  const parts = lastSku.split("-");
  const lastNumber = parseInt(parts[parts.length - 1], 10);

  return isNaN(lastNumber) ? 1 : lastNumber + 1;
};

const createProduct = async (data) => {
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
  } = data;

  const [result] = await db.query(
    `INSERT INTO products (
       name, sku, barcode, description, costPrice, sellingPrice, 
       currentStock, safetyStock, categoryId, supplierId
     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      sku,
      barcode || null,
      description || null,
      costPrice || 0,
      sellingPrice || 0,
      currentStock || 0,
      safetyStock || 0,
      categoryId || null,
      supplierId || null,
    ]
  );
  return result.insertId;
};

const updateProduct = async (id, data) => {
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
  } = data;

  await db.query(
    `UPDATE products 
     SET name = ?, sku = ?, barcode = ?, description = ?, costPrice = ?, 
         sellingPrice = ?, currentStock = ?, safetyStock = ?, categoryId = ?, 
         supplierId = ?, isActive = ?
     WHERE id = ?`,
    [
      name,
      sku,
      barcode || null,
      description || null,
      costPrice,
      sellingPrice,
      currentStock,
      safetyStock,
      categoryId || null,
      supplierId || null,
      isActive !== undefined ? isActive : 1,
      id,
    ]
  );
};

const deleteProduct = async (id) => {
  await db.query("DELETE FROM products WHERE id = ?", [id]);
};

module.exports = {
  getAllProducts,
  getProductById,
  getProductBySku,
  getNextSkuSequence,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};