import pool from './DB.js';

// Register a new store owner
export const registerStoreOwner = async (name, phoneNumber, code) => {
  const [result] = await pool.execute(
    'INSERT INTO StoreOwners (name, phone_number, code) VALUES (?, ?, ?)',
    [name, phoneNumber, code]
  );
  return { id: result.insertId, name, phoneNumber };
};

// Login by name and code
export const loginStoreOwner = async (name, code) => {
  const [rows] = await pool.execute(
    'SELECT * FROM StoreOwners WHERE name = ? AND code = ?',
    [name, code]
  );
  return rows[0];
};