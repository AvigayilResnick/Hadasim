import { useState } from 'react';
import StoreOwnerLoginForm from '../components/StoreOwnerLoginForm';
import StoreOwnerSignupForm from '../components/StoreOwnerSignupForm';
import '../css/MainStyles.css'


function StoreOwnerLoginSignup() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth-form-container">
      <h2>{isLogin ? 'Store Owner Login' : 'Store Owner Sign Up'}</h2>

      {isLogin ? <StoreOwnerLoginForm /> : <StoreOwnerSignupForm />}

      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '1rem' }}>
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </button>
    </div>
  );
}

export default StoreOwnerLoginSignup;