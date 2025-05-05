import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SupplierSignupForm() {
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([{ name: '', price: '', minQuantity: '' }]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleProductChange = (index, field, value) => {
    const updated = [...products];
    updated[index][field] = value;
    setProducts(updated);
  };

  const addProduct = () => {
    setProducts([...products, { name: '', price: '', minQuantity: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/suppliers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            company_name: companyName,
            phone_number: phoneNumber,
            contact_name: contactName,
            password,
            products: products.map(p => ({
              product_name: p.name,
              price: parseFloat(p.price),
              min_quantity: parseInt(p.minQuantity)
            }))
          })
      });

      if (!res.ok) throw new Error('Signup failed');
      const data = await res.json();
localStorage.setItem('supplierId', data.id);
localStorage.setItem('supplierName', data.company_name);
      navigate('/supplier/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Company Name" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
      <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
      <input type="text" placeholder="Contact Name" value={contactName} onChange={e => setContactName(e.target.value)} required />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />

      <h4>Products Offered:</h4>
      {products.map((p, i) => (
        <div key={i}>
          <input placeholder="Product Name" value={p.name} onChange={e => handleProductChange(i, 'name', e.target.value)} required />
          <input placeholder="Price" type="number" value={p.price} onChange={e => handleProductChange(i, 'price', e.target.value)} required />
          <input placeholder="Min Quantity" type="number" value={p.minQuantity} onChange={e => handleProductChange(i, 'minQuantity', e.target.value)} required />
        </div>
      ))}
      <button type="button" onClick={addProduct}>Add Another Product</button>
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default SupplierSignupForm;