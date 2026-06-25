import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-footerbg text-white px-5 sm:px-10 pt-12 md:pt-[60px] pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-10 md:mb-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] bg-gradient-to-br from-mid to-accent rounded-[9px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M19 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c.55 0 1 .45 1 1v3h3c.55 0 1 .45 1 1s-.45 1-1 1h-3v3c0 .55-.45 1-1 1s-1-.45-1-1v-3H8c-.55 0-1-.45-1-1s.45-1 1-1h3V7c0-.55.45-1 1-1z" />
              </svg>
            </div>
            <span className="font-display text-xl font-extrabold text-white">
              Medi<span className="text-accent">Vision</span>
            </span>
          </Link>
          <p className="text-[13px] text-[#7BA0B8] leading-relaxed my-3.5 max-w-[280px]">
            A leading manufacturer and importer of advanced radiology equipment. Serving hospitals, clinics and diagnostic centres across India and globally since 1996.
          </p>
          <div className="flex gap-2.5">
            {[
              { href: 'https://linkedin.com', label: 'in' },
              { href: 'https://facebook.com', label: 'f' },
              { href: 'https://instagram.com', label: 'ig' },
              { href: 'https://twitter.com', label: '𝕏' },
              { href: 'https://youtube.com', label: '▶' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] flex items-center justify-center text-[#90CAE0] text-sm font-bold hover:bg-mid hover:text-white transition"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Products */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[1.5px] text-[#90CAE0] mb-4">Products</h4>
          <ul className="flex flex-col gap-2.5">
            {['Handheld X-Ray', 'Mobile X-Ray', 'DR Systems', 'CR Systems', 'Surgical C-Arms', 'X-Ray Films', 'X-Ray Printers', 'Accessories'].map((item) => (
              <li key={item}>
                <Link to="/products" className="text-[13px] text-[#7BA0B8] hover:text-white transition">
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
                <Link to="/services" className="text-[13px] text-[#7BA0B8] hover:text-white transition">
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
            <li><Link to="/about" className="text-[13px] text-[#7BA0B8] hover:text-white transition">About Us</Link></li>
            <li><Link to="/career" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Career</Link></li>
            <li><Link to="/contact" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/contact" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Become a Partner</Link></li>
            <li><Link to="/privacy" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="text-[13px] text-[#7BA0B8] hover:text-white transition">Terms & Conditions</Link></li>
          </ul>
          <div className="mt-5 flex flex-col gap-1.5">
            <p className="text-xs text-[#4A6580] leading-snug">📍 B-83, Mangolpuri Industrial Area, Phase-II, New Delhi - 110034</p>
            <p className="text-xs text-[#4A6580]">📞 <a href="tel:18001202880" className="text-[#7BA0B8] hover:text-white">1800-120-280-280</a></p>
            <p className="text-xs text-[#4A6580]">✉️ <a href="mailto:info@medivisionhealth.com" className="text-[#7BA0B8] hover:text-white">info@medivisionhealth.com</a></p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/[0.08] pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-center sm:text-left">
        <p className="text-[13px] text-[#4A6580]">© {new Date().getFullYear()} MediVision Healthcare Limited. All rights reserved.</p>
        <div className="flex gap-5">
          <Link to="/privacy" className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition">Privacy Policy</Link>
          <Link to="/terms" className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition">Terms of Use</Link>
          <Link to="/sitemap" className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
