import pool from './DB.js';

// saves supplier and its products to DB
export async function createSupplierWithProducts(data) {
  const { company_name, phone_number, contact_name, password, products } = data;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Inserts supplier
    const [supplierResult] = await connection.query(
      `INSERT INTO Suppliers (company_name, phone_number, contact_name, password)
       VALUES (?, ?, ?, ?)`,
      [company_name, phone_number, contact_name, password]
    );
    const supplierId = supplierResult.insertId;

    // Inserts all products
    for (const product of products) {
      const { product_name, price, min_quantity } = product;
      await connection.query(
        `INSERT INTO Products (supplier_id, product_name, price, min_quantity)
         VALUES (?, ?, ?, ?)`,
        [supplierId, product_name, price, min_quantity]
      );
    }

    await connection.commit();
    return supplierId;
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
}

// Find supplier based on login credentials
export async function findSupplierByGivenInfo({ company_name, password }) {
  const [rows] = await pool.query(
    `SELECT * FROM Suppliers WHERE company_name = ? AND password = ?`,
    [company_name, password]
  );
  return rows[0];
}

export const getAllSuppliers = async () => {
  const [rows] = await pool.query('SELECT id, company_name FROM Suppliers');
  return rows;
};