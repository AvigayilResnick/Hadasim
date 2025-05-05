import express from 'express';
import cors from 'cors';
import pool from './services/DB.js';
import supplierRoutes from './routes/supplierRoutes.js'; 
import storeOwnerRoutes from './routes/storeOwnerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js'




const app = express();
app.use(express.json());
app.use(cors());

// Route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ success: true, result: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.use('/storeowners', storeOwnerRoutes);
app.use('/suppliers', supplierRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);

// Start the server on a specified port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});