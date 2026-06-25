import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071329] text-white">
        <div className="relative flex flex-col items-center">
          {/* Glowing gradient background orbit */}
          <div className="absolute w-32 h-32 rounded-full bg-gradient-to-tr from-mid to-accent opacity-20 blur-xl animate-pulse"></div>
          
          {/* Glassmorphic spinner */}
          <div className="w-16 h-16 border-4 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          
          <h2 className="mt-6 text-lg font-semibold tracking-wider text-accent/80 font-display">
            Medi<span className="text-white">Vision</span>
          </h2>
          <p className="text-xs text-textmuted mt-2">Securing admin environment...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
