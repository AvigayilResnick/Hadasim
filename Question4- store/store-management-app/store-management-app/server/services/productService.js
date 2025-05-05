import pool from './DB.js';

export const getProductsBySupplier = async (supplierId) => {
  const query = `
    SELECT id, product_name, price, min_quantity
    FROM Products
    WHERE supplier_id = ?
  `;
  const [rows] = await pool.query(query, [supplierId]);
  return rows;
};