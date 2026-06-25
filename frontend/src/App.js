import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppBtn from './components/WhatsAppBtn';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import Contact from './pages/Contact';
import Career from './pages/Career';
import ProductDetails from './pages/ProductDetails';

// Admin Components & Pages
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminCategories from './pages/admin/Categories';
import AdminOrders from './pages/admin/Orders';
import AdminUsers from './pages/admin/Users';
import AdminMessages from './pages/admin/Messages';
import AdminSettings from './pages/admin/Settings';
import AdminApplications from './pages/admin/Applications';
import AdminMedia from './pages/admin/Media';
import AdminSeo from './pages/admin/Seo';
import AdminCareers from './pages/admin/Careers';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      
      <div className="flex-1">
        <Routes>
          {/* User-facing Pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/career" element={<Career />} />

          {/* Secure Admin Pages */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProducts />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCategories />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/applications"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminApplications />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/media"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminMedia />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/seo"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSeo />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/careers"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminCareers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminOrders />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminUsers />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/messages"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminMessages />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppBtn />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
