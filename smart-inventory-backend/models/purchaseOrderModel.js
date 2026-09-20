const db = require("../config/db");
const stockMovementModel = require("./stockMovementModel");

// Get the latest sequence number for PO-001 formatting
const getNextPoSequence = async () => {
  const [rows] = await db.query(
    "SELECT poNumber FROM purchase_orders WHERE poNumber LIKE 'PO-%' ORDER BY id DESC LIMIT 1"
  );

  if (rows.length === 0) return 1;

  const lastNumber = parseInt(rows[0].poNumber.split("-")[1], 10);
  return isNaN(lastNumber) ? 1 : lastNumber + 1;
};

// Create a PO and its items using a transaction
const createPurchaseOrderWithItems = async ({ poNumber, supplierId, createdById, notes, items }) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [poResult] = await connection.query(
      `INSERT INTO purchase_orders (poNumber, supplierId, createdById, notes, status)
       VALUES (?, ?, ?, ?, 'PENDING')`,
      [poNumber, supplierId, createdById, notes || null]
    );

    const purchaseOrderId = poResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO purchase_order_items (purchaseOrderId, productId, quantityOrdered, unitCost)
         VALUES (?, ?, ?, ?)`,
        [purchaseOrderId, item.productId, item.quantityOrdered, item.unitCost]
      );
    }

    await connection.commit();
    return purchaseOrderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Fetch PO list with supplier and creator details
const getAllPurchaseOrders = async () => {
  const [rows] = await db.query(
    `SELECT 
       po.*,
       s.name AS supplierName,
       u.name AS createdByName
     FROM purchase_orders po
     LEFT JOIN suppliers s ON po.supplierId = s.id
     LEFT JOIN users u ON po.createdById = u.id
     ORDER BY po.id DESC`
  );
  return rows;
};

// Fetch single PO with all nested line items
const getPurchaseOrderById = async (id) => {
  const [poRows] = await db.query(
    `SELECT 
       po.*,
       s.name AS supplierName,
       u.name AS createdByName
     FROM purchase_orders po
     LEFT JOIN suppliers s ON po.supplierId = s.id
     LEFT JOIN users u ON po.createdById = u.id
     WHERE po.id = ?`,
    [id]
  );

  if (poRows.length === 0) return null;

  const po = poRows[0];

  const [items] = await db.query(
    `SELECT 
       poi.*,
       p.name AS productName,
       p.sku AS productSku
     FROM purchase_order_items poi
     LEFT JOIN products p ON poi.productId = p.id
     WHERE poi.purchaseOrderId = ?`,
    [id]
  );

  po.items = items;
  return po;
};

// Execute complete stock-in transaction
const receiveStockTransaction = async (poId, receivedItems, userId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Lock the PO record
    const [poRows] = await connection.query(
      "SELECT * FROM purchase_orders WHERE id = ? FOR UPDATE",
      [poId]
    );

    if (poRows.length === 0) {
      throw { statusCode: 404, message: "Purchase Order not found" };
    }

    const po = poRows[0];
    if (po.status !== "PENDING") {
      throw { statusCode: 400, message: `Cannot receive stock. PO status is already ${po.status}` };
    }

    // 2. Fetch all PO items
    const [poItems] = await connection.query(
      "SELECT * FROM purchase_order_items WHERE purchaseOrderId = ?",
      [poId]
    );

    // 3. Process each item received
    for (const incoming of receivedItems) {
      const matchedItem = poItems.find((i) => i.productId === Number(incoming.productId));
      if (!matchedItem) {
        throw {
          statusCode: 400,
          message: `Product ID ${incoming.productId} is not part of this Purchase Order`,
        };
      }

      const qtyReceived = Number(incoming.quantityReceived);
      if (isNaN(qtyReceived) || qtyReceived <= 0) {
        throw {
          statusCode: 400,
          message: `Invalid quantity received for product ID ${incoming.productId}`,
        };
      }

      // Lock the product row to safely read currentStock
      const [productRows] = await connection.query(
        "SELECT id, currentStock FROM products WHERE id = ? FOR UPDATE",
        [incoming.productId]
      );

      if (productRows.length === 0) {
        throw { statusCode: 404, message: `Product ID ${incoming.productId} not found` };
      }

      const product = productRows[0];
      const balanceBefore = product.currentStock;
      const balanceAfter = balanceBefore + qtyReceived;

      // Update product current stock
      await connection.query(
        "UPDATE products SET currentStock = ? WHERE id = ?",
        [balanceAfter, incoming.productId]
      );

      // Update quantityReceived in PO line item
      await connection.query(
        "UPDATE purchase_order_items SET quantityReceived = ? WHERE id = ?",
        [qtyReceived, matchedItem.id]
      );

      // Write an immutable movement record
      await stockMovementModel.createMovement(
        {
          productId: incoming.productId,
          type: "IN",
          quantity: qtyReceived,
          balanceBefore,
          balanceAfter,
          purchaseOrderId: poId,
          createdById: userId,
          notes: `Stock-in from Purchase Order ${po.poNumber}`,
        },
        connection
      );
    }

    // 4. Update PO status and stamp receivedAt
    await connection.query(
      `UPDATE purchase_orders 
       SET status = 'RECEIVED', receivedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [poId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Cancel a pending PO
const cancelPurchaseOrder = async (id) => {
  const [result] = await db.query(
    "UPDATE purchase_orders SET status = 'CANCELLED' WHERE id = ? AND status = 'PENDING'",
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  getNextPoSequence,
  createPurchaseOrderWithItems,
  getAllPurchaseOrders,
  getPurchaseOrderById,
  receiveStockTransaction,
  cancelPurchaseOrder,
};