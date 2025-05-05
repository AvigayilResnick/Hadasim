import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import SupplierLoginSignup from './pages/SupplierLoginSignup';
import StoreOwnerLoginSignup from './pages/StoreOwnerLoginSignup';
import StoreOwnerHomePage from './pages/StoreOwnerHomePage';
import SupplierHomePage from './pages/SupplierHomePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/supplier/*" element={<SupplierLoginSignup />} />
        <Route path="/storeowner/*" element={<StoreOwnerLoginSignup />} />
        <Route path="/storeowner/home" element={<StoreOwnerHomePage />} />
        <Route path="/supplier/home" element={<SupplierHomePage />} />
      </Routes>
    </Router>
  );
}
export default App;
