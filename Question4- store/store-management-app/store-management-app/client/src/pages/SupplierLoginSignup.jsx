import { useState } from 'react';
import SupplierLoginForm from '../components/SupplierLoginForm';
import SupplierSignupForm from '../components/SupplierSignupForm';
import '../css/AuthForms.css'

function SupplierLoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Supplier Login' : 'Supplier Signup'}</h2>

      {isLogin ? <SupplierLoginForm /> : <SupplierSignupForm />}

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '1rem' }}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default SupplierLoginSignup;