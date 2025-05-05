import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SupplierLoginForm() {
    const [company_name, setCompanyName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/suppliers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ company_name, password })
            });

            if (res.status === 401) {
                setError('Invalid company name or password');
                return;
            }

            const data = await res.json();
            localStorage.setItem('supplierId', data.supplier.id);
            localStorage.setItem('supplierName', data.supplier.company_name);
            navigate('/supplier/home');
        } catch (err) {
            setError('Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input
                type="text"
                placeholder="Company Name"
                value={company_name}
                onChange={e => setCompanyName(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}

export default SupplierLoginForm;