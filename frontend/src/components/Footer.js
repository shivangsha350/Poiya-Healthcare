import React from 'react';
import { Link } from 'react-router-dom';
import productIcon from "../Assets/Logo.png";

export default function Footer() {
  return (
    <footer className="bg-footerbg text-white px-5 sm:px-10 pt-12 md:pt-[60px] pb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 mb-10 md:mb-12">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-1">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-[38px] h-[38px] rounded-[9px] overflow-hidden flex items-center justify-center">
              <img
                src={productIcon}
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
              { href: 'https://www.linkedin.com/in/poiya-healthcare-354312420/?isSelfProfile=true', label: 'in' },
              { href: 'https://www.facebook.com/profile.php?id=61591702112597', label: 'f' },
              { href: 'https://www.instagram.com/poiya_healthcare/', label: 'ig' },
              { href: 'https://www.indiamart.com/poiyahealthcure', label: 'im' },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] flex items-center justify-center text-[#90CAE0] text-xs font-black hover:bg-mid hover:text-white transition uppercase"
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
            {['CT Scanner (Pre owned)', 'MRI  (Pre owned)', 'CATH LAB (Pre owned)', 'Handheld , Mobile , Fixed  X-RAY', 'Computed Radiography & Printer', 'Digital Radiography & Printers', 'C-ARM', 'AI Radiology Software', 'Dialysis Machine & its Consumables', 'Oncology Screener Devices', 'IVD Products'].map((item) => (
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
          <Link to="/sitemap" className="text-xs text-[#4A6580] hover:text-[#90CAE0] transition">Sitemap</Link>
        </div>
      </div>
    </footer >
  );
}
