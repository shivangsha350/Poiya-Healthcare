"use client";
import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhatsAppBtn from '../../components/WhatsAppBtn';

export default function PublicLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
