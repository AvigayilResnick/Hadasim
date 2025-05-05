import { useEffect, useState } from 'react';

function OrderForm({ onOrderCreated }) {
  const storeOwnerId = localStorage.getItem('storeOwnerId');
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await fetch('http://localhost:5000/suppliers');
      const data = await res.json();
      setSuppliers(data);
    } catch (err) {
      console.error('Failed to fetch suppliers:', err);
    }
  };

  const fetchProducts = async (supplierId) => {
    try {
      const res = await fetch(`http://localhost:5000/products/supplier/${supplierId}`);
      const data = await res.json();
      setProducts(data);
      setQuantities({}); // reset quantities
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const handleSupplierChange = (e) => {
    const supplierId = e.target.value;
    setSelectedSupplier(supplierId);
    fetchProducts(supplierId);
  };

  const handleQuantityChange = (productId, value) => {
    setQuantities(prev => ({ ...prev, [productId]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const items = Object.entries(quantities)
      .filter(([_, qty]) => qty > 0)
      .map(([productId, quantity]) => ({
        productId: parseInt(productId),
        quantity
      }));

    if (!selectedSupplier || items.length === 0) {
      alert("Please select supplier and at least one product with quantity.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/storeowners/${storeOwnerId}/createOrder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId: selectedSupplier, items })
      });

      if (!res.ok) throw new Error('Failed to create order');

      alert('Order created successfully!');
      onOrderCreated(); // notify parent to refresh
    } catch (err) {
      console.error(err);
      alert('Failed to create order');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create New Order</h3>

      <label>Select Supplier:</label>
      <select onChange={handleSupplierChange} value={selectedSupplier}>
        <option value="">-- Select Supplier --</option>
        {suppliers.map(s => (
          <option key={s.id} value={s.id}>{s.company_name}</option>
        ))}
      </select>

      {products.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Products:</h4>
          {products.map(p => (
            <div key={p.id} style={{ marginBottom: '0.5rem' }}>
              <span>{p.product_name} (min: {p.min_quantity})</span>
              <input
                type="number"
                min={p.min_quantity}
                value={quantities[p.id] || ''}
                onChange={e => handleQuantityChange(p.id, e.target.value)}
                placeholder="Quantity"
                style={{ marginLeft: '1rem', width: '60px' }}
              />
            </div>
          ))}
        </div>
      )}

      <button type="submit" style={{ marginTop: '1rem' }}>Submit Order</button>
    </form>
  );
}

export default OrderForm;