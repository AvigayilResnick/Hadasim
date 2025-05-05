import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function StoreOwnerLoginForm() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/storeowners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, code })
      });

      if (res.status === 401) {
        setError('Invalid name or code');
        return;
      }

      if (!res.ok) {
        throw new Error('Login failed');
      }

      const data = await res.json();
      console.log('Logged in:', data);

      localStorage.setItem('storeOwnerId', data.id);
      localStorage.setItem('storeOwnerName', data.name);

      navigate('/storeowner/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Code"
        value={code}
        onChange={e => setCode(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default StoreOwnerLoginForm;