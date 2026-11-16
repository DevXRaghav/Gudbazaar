import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { ScrollToTop } from './components/common/ScrollToTop';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PoliciesPage } from './pages/PoliciesPage';

export default function App() {
  return (
    <BrowserRouter>
      {/* Route-aware ScrollToTop handles only real route navigation without affecting in-page actions */}
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-[#FFF9EF] text-[#4A2415] selection:bg-[#E99A19]/25 selection:text-[#4A2415]">
              {/* Main Top Header */}
              <Header />

              {/* Core Route Viewports */}
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/policies" element={<PoliciesPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              {/* Persistent Slide-out Cart Drawer */}
              <CartDrawer />

              {/* Interactive Signup & Customer Profile Modal */}
              <AuthModal />

              {/* Full Brand Footer */}
              <Footer />
            </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
