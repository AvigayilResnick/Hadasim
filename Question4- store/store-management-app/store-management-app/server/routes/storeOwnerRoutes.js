import express from 'express';
import {
  registerStoreOwner,
  loginStoreOwner
} from '../controllers/storeOwnerController.js';

import {
  getOrdersByStoreOwner,
  createOrder,
  completeOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Register a new store owner
router.post('/register', registerStoreOwner);

// Login with name and code
router.post('/login', loginStoreOwner);

// Create a new order
router.post('/:storeOwnerId/createOrder', createOrder);

// Get orders for this store owner
router.get('/:storeOwnerId/orders', getOrdersByStoreOwner);

// Confirm order received (complete)
router.patch('/:storeOwnerId/orders/:orderId/complete', completeOrder);

export default router;