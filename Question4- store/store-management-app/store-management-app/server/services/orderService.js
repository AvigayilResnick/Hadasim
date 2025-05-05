import pool from './DB.js';

// Get all orders for a supplier
export const getOrdersBySupplier = async (supplierId) => {
  const query = `
    SELECT o.id, o.order_date, o.status, so.name AS store_owner_name
    FROM Orders o
    JOIN StoreOwners so ON o.store_owner_id = so.id
    WHERE o.supplier_id = ?
  `;
  const [rows] = await pool.query(query, [supplierId]);
  return rows;
};

// Get all orders for a store owner
export const getOrdersByStoreOwner = async (storeOwnerId) => {
  const query = `
    SELECT o.id, o.order_date, o.status, s.company_name AS supplier_name
    FROM Orders o
    JOIN Suppliers s ON o.supplier_id = s.id
    WHERE o.store_owner_id = ?
  `;
  const [rows] = await pool.query(query, [storeOwnerId]);
  return rows;
};

// Create a new order (with its products)
export const createOrder = async (supplierId, storeOwnerId, items) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [orderResult] = await conn.query(
      `INSERT INTO Orders (supplier_id, store_owner_id) VALUES (?, ?)`,
      [supplierId, storeOwnerId]
    );

    const orderId = orderResult.insertId;

    for (const item of items) {
      await conn.query(
        `INSERT INTO OrderItems (order_id, product_id, quantity) VALUES (?, ?, ?)`,
        [orderId, item.productId, item.quantity]
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export const getOrderItems = async (orderId) => {
  const query = `
    SELECT p.product_name, oi.quantity
    FROM OrderItems oi
    JOIN Products p ON oi.product_id = p.id
    WHERE oi.order_id = ?
  `;
  const [rows] = await pool.query(query, [orderId]);
  return rows;
};

// Update the status of an order
export const updateOrderStatus = async (orderId, newStatus) => {
  const query = `UPDATE Orders SET status = ? WHERE id = ?`;
  await pool.query(query, [newStatus, orderId]);
};