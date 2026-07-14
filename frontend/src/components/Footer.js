import React from 'react';
import Link from 'next/link';
import productIcon from "../Assets/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-footerbg text-white px-5 sm:px-10 pt-12 md:pt-[60px] pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-10 md:mb-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-[9px] overflow-hidden flex items-center justify-center">
              <img
                src={productIcon.src || productIcon}
                alt="Product Icon"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-display text-xl font-extrabold text-white">
              Poiya <span className="text-accent">Healthcare(India) Pvt Ltd.</span>
            </span>
          </Link>
          <p className="text-[13px] text-[#7BA0B8] leading-relaxed my-3.5 max-w-[280px]">
We are a trusted supplier of advanced medical equipment, serving hospitals, and diagnostic centers across India and global markets. In addition, we are a leading manufacturer and exporter of sanitary pads, sanitary napkins, diaper pants, and disposable underpads, delivering high-quality healthcare and hygiene solutions.
          </p>
          <div className="flex gap-2.5">
            {[
              {
                href: 'https://www.linkedin.com/in/poiya-healthcare-354312420/?isSelfProfile=true',
                label: 'LinkedIn',
                icon: (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9h3.56v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                  </svg>
                )
              },
              {
                href: 'https://www.facebook.com/profile.php?id=61591702112597',
                label: 'Facebook',
                icon: (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )
              },
              {
                href: 'https://www.instagram.com/poiya_healthcare/',
                label: 'Instagram',
                icon: (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                )
              },
              {
                href: 'https://www.indiamart.com/poiyahealthcure',
                label: 'IndiaMart',
                icon: (
                  <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="2.5" fill="currentColor" />
                    <rect x="3.5" y="10.5" width="5" height="10.5" rx="1.5" fill="currentColor" />
                    <path d="M12.5 10.5h3v2.2c.6-.8 1.6-1.4 2.8-1.4 2.2 0 3.2 1.3 3.2 3.2v6h-3.2v-4.8c0-1-.3-1.6-1.1-1.6-.8 0-1.3.5-1.3 1.4v5h-3.4v-10z" fill="currentColor" />
                  </svg>
                )
              },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] flex items-center justify-center text-[#90CAE0] hover:bg-mid hover:text-white transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[1.5px] text-[#90CAE0] mb-4">Products</h4>
          <ul className="flex flex-col gap-2.5">
            {['CT Scanner (Pre owned)', 'MRI  (Pre owned)', 'CATH LAB (Pre owned)', 'Handheld , Mobile , Fixed  X-RAY', 'Computed Radiography & Printer', 'Digital Radiography & Printers', 'C-ARM', 'AI Radiology Software', 'Dialysis Machine & its Consumables', 'Oncology Screener Devices', 'IVD Products'].map((item) => (
              <li key={item}>
                <Link href="/products" className="text-[13px] text-[#7BA0B8] hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[1.5px] text-[#90CAE0] mb-4">Services</h4>
          <ul className="flex flex-col gap-2.5">
            {['Medical Imaging', 'Warranty & AMC', 'Digital Solutions', 'Financing Options', 'Remote Support', 'Installation'].map((item) => (
              <li key={item}>
                <Link href="/services" className="text-[13px] text-[#7BA0B8] hover:text-white transition">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[1.5px] text-[#90CAE0] mb-4">Company</h4>
          <ul className="flex flex-col gap-2.5">
            <li><Link href="/about" className="text-[13px] text-[#7BA0B8] hover:text-white transition">About Us</Link></li>
            <li><Link href="/career" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Career</Link></li>
            <li><Link href="/contact" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Contact Us</Link></li>
            <li><Link href="/contact" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Become a Partner</Link></li>
            <li>
              <a
                href="/TERM.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-[#7BA0B8] hover:text-white transition"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="/TERM(1).pdf"
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-[#7BA0B8] hover:text-white transition"
              >
                Terms & Conditions
              </a>
            </li>          </ul>
          <div className="mt-5 flex flex-col gap-1.5">
            <p className="text-xs text-[#4A6580] leading-snug text-white">📍 Office No. 301, Third Floor, Trimurti Prime Tower, Niwaru Rd, Jhotwara Industrial Area, Jhotwara, Jaipur, Rajasthan 302012</p>
            <p className="text-xs text-[#4A6580]">✉️ <a href="mailto:poiyahealthcure99@gmail.com" className="text-[#7BA0B8] hover:text-white">poiyahealthcure99@gmail.com</a></p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <p className="text-[13px] text-[#4A6580]">© {new Date().getFullYear()} Poiya Healthcare Pvt. Ltd. All rights reserved. Developed & Managed by bitebursttechnologies@gmail.com</p>
        <div className="flex gap-5">
          <a
            href="/TERM.pdf"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition"
          >
            Privacy Policy
          </a>
          <a
            href="/TERM(1).pdf"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition"
          >
            Terms & Conditions
          </a>
          <Link href="/sitemap" className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition">Sitemap</Link>
        </div>
      </div>
    </footer >
  );
}
