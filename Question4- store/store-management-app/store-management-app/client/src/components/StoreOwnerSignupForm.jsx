import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StoreOwnerSignupForm() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/storeowners/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phoneNumber, code })
      });

      if (!res.ok) {
        throw new Error('Registration failed');
      }

      const data = await res.json();
      console.log('Registered:', data);

      localStorage.setItem('storeOwnerId', data.id);
      localStorage.setItem('storeOwnerName', data.name);
      
      navigate('/storeowner/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
      <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} required />
      <input type="password" placeholder="Code" value={code} onChange={e => setCode(e.target.value)} required />
      <button type="submit">Sign Up</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default StoreOwnerSignupForm;