"use client";
import React from 'react';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import AdminLayout from '../../components/admin/AdminLayout';

export default function AdminRootLayout({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  );
}
