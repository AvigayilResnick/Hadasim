import {
  createSupplierWithProducts,
  findSupplierByGivenInfo,
  getAllSuppliers as allSuppliers
} from '../services/supplierService.js';

// Handle supplier registration
export async function registerSupplier(req, res) {
  console.log("📦 Register Supplier called with body:", req.body);
  try {
    const result = await createSupplierWithProducts(req.body);
    res.status(201).json({ success: true, supplierId: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Handle supplier login
export async function loginSupplier(req, res) {
  console.log('🟡 Login body:', req.body);
  try {
    const supplier = await findSupplierByGivenInfo(req.body);
    console.log('supplier:', supplier)
    if (supplier) {
      res.json({ success: true, supplier });
    } else {
      res.status(401).json({ success: false, message: 'Invalid login' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await allSuppliers();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};