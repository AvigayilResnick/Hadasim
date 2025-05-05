import express from 'express';
import {
  registerSupplier,
  loginSupplier,
  getAllSuppliers
} from '../controllers/supplierController.js';
import {
  getOrdersBySupplier,
  approveOrder
} from '../controllers/orderController.js';

const router = express.Router();

// Register a new supplier with products
router.post('/register', registerSupplier);

// Log in a supplier using company name and password
router.post('/login', loginSupplier);

// Get all orders for a specific supplier
router.get('/:supplierId/orders', getOrdersBySupplier);

// Approve a specific order
router.patch('/:supplierId/orders/:orderId/approve', approveOrder);

//Gets all suppliers
router.get('/', getAllSuppliers);

export default router;