import * as productService from '../services/productService.js';

export const getProductsBySupplier = async (req, res) => {
  try {
    const products = await productService.getProductsBySupplier(req.params.supplierId);
    res.json(products);
  } catch (err) {
    console.error('Failed to fetch products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};