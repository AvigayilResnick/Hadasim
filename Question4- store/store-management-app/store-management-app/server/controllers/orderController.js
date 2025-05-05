import * as orderService from '../services/orderService.js';
import pool from '../services/DB.js'

// Get all orders for a supplier
export const getOrdersBySupplier = async (req, res) => {
  try {
    const orders = await orderService.getOrdersBySupplier(req.params.supplierId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders for supplier' });
  }
};

// Get all orders for a store owner
export const getOrdersByStoreOwner = async (req, res) => {
  try {
    const orders = await orderService.getOrdersByStoreOwner(req.params.storeOwnerId);
    console.log('orders:', orders);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders for store owner' });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const supplierId = req.body.supplierId;
    const storeOwnerId = req.params.storeOwnerId;
    const items = req.body.items;
    const orderId = await orderService.createOrder(supplierId, storeOwnerId, items);
    res.status(201).json({ orderId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// get all Items in order
export const getOrderItems = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const items = await orderService.getOrderItems(orderId);
    res.json(items);
  } catch (err) {
    console.error('❌ Failed to fetch order items:', err);
    res.status(500).json({ error: 'Failed to fetch order items' });
  }
};

// Approve order by supplier
export const approveOrder = async (req, res) => {
  try {
    await orderService.updateOrderStatus(req.params.orderId, 'in_process');
    res.json({ message: 'Order approved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve order' });
  }
};

// Complete order by store owner
export const completeOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Check the current status of the order
    const [orders] = await pool.query(
      'SELECT status FROM Orders WHERE id = ?',
      [orderId]
    );

    if (!orders.length) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentStatus = orders[0].status;

    if (currentStatus !== 'in_process') {
      return res.status(400).json({
        error: `Cannot complete order unless it is in status 'in_process'. Current status: '${currentStatus}'`
      });
    }
    await orderService.updateOrderStatus(req.params.orderId, 'completed');
    res.json({ message: 'Order completed' });
  } catch (err) {
    console.error('❌ COMPLETE ORDER ERROR:', err);
    res.status(500).json({ error: 'Failed to complete order' });
  }
};