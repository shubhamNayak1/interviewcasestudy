import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TenantProvider } from './context/TenantContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

export default function App() {
  return (
    <TenantProvider>
      <CartProvider>
        <BrowserRouter>
          <div style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh', background: '#f5f5f5' }}>
            <Navbar />
            <Routes>
              <Route path="/"            element={<HomePage />} />
              <Route path="/products"    element={<ProductListingPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart"        element={<CartPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </TenantProvider>
  );
}
