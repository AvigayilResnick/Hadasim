// orderRoutes.js – currently unused, logic handled in supplierRoutes and storeOwnerRoutes

import express from 'express';
import { getOrderItems } from '../controllers/orderController.js';
const router = express.Router();

router.get('/:orderId/items', getOrderItems);

export default router;