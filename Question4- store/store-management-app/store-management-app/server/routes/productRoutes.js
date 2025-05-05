import express from 'express';
import { getProductsBySupplier } from '../controllers/productController.js';

const router = express.Router();

// Get all products by supplier ID
router.get('/supplier/:supplierId', getProductsBySupplier);

export default router;