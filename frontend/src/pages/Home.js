import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import QuickInfo from '../components/QuickInfo';
import StatsBand from '../components/StatsBand';
import ProductCard from '../components/ProductCard';

const products = [
  { slug: 'handheld', name: 'Handheld Portable X-Ray', desc: 'Compact, lightweight X-ray solutions for field and remote diagnostic use.', icon: <svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg> },
  { slug: 'mobile', name: 'Mobile X-Ray Solutions', desc: '50kW mobile digital systems built for versatile hospital-floor use.', icon: <svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg> },
  { slug: 'dr', name: 'Digital Radiography (DR)', desc: 'High-resolution flat-panel DR systems for fast, precise imaging.', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg> },
  { slug: 'cr', name: 'Computed Radiography (CR)', desc: 'Carestream & Trimax CR systems — trusted by hospitals nationwide.', icon: <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg> },
  { slug: 'carm', name: 'Surgical C-Arms', desc: 'Real-time fluoroscopic imaging for orthopaedic and surgical suites.', icon: <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg> },
  { slug: 'software', name: 'TB AI / Radiology Software', desc: 'AI-powered TB detection and radiology reporting software solutions.', icon: <svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
];



const partners = ['Carestream Health', 'Trimax Medical', 'iRay Technology', 'Poskom', 'Lanmage'];

export default function Home() {
  return (
    <main>
      <Hero />
      <QuickInfo />

      {/* About */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
          <div className="rounded-[20px] overflow-hidden order-2 lg:order-1">
            <div className="w-full h-[240px] md:h-[340px] bg-gradient-to-br from-lightbg to-[#B0D8ED] rounded-[20px] flex items-center justify-center relative">
              <svg viewBox="0 0 120 120" fill="none" className="w-[100px] md:w-[130px] h-[100px] md:h-[130px]">
                <rect x="10" y="10" width="100" height="100" rx="16" stroke="#0077B6" strokeWidth="2" strokeOpacity="0.3" />
                <path d="M60 30v60M30 60h60" stroke="#00B4D8" strokeWidth="4" strokeLinecap="round" />
                <circle cx="60" cy="60" r="28" stroke="#0077B6" strokeWidth="6" strokeOpacity="0.15" />
              </svg>
              <div className="absolute bottom-5 left-5 bg-white rounded-xl px-4.5 py-3.5 shadow-lg">
                <div className="font-display text-2xl font-extrabold text-mid">100+</div>
                <div className="text-xs text-textmuted">Team Members</div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">About MediVision</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-3.5 leading-snug">
              A Trusted Leader in Radiology &amp; Imaging
            </h2>
            <p className="text-[15px] text-textmuted leading-relaxed mb-6">
              We are a trusted leader in radiology and imaging, delivering cutting-edge, affordable solutions under the "Make in India" initiative. Partnered with Carestream Health USA, we bring CR, DR, films and high-end X-ray machines to hospitals, clinics and diagnostic centres worldwide.
            </p>
            <ul className="flex flex-col gap-2.5 mb-7">
              {[
                '50kW Mobile Digital X-Ray Systems',
                '80kW Ceiling Suspended X-Ray Machines',
                'Digital C-Arms & Portable X-Ray solutions',
                'Presence in India, Nepal, Bangladesh, Philippines, Dubai & Singapore',
              ].map((text) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-primary">
                  <span className="w-[22px] h-[22px] rounded-full bg-lightbg text-mid font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">✓</span>
                  {text}
                </li>
              ))}
            </ul>
            <Link to="/about" className="bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition inline-block">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      <StatsBand />

      {/* Products */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="text-center mb-10 max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Our Products</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-3.5">Complete Radiology Equipment Range</h2>
          <p className="text-[15px] text-textmuted leading-relaxed max-w-[560px] mx-auto">
            From portable handheld devices to full digital radiography systems — we have solutions for every need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {products.map((p) => <ProductCard key={p.slug} {...p} />)}
        </div>
        <div className="text-center mt-8">
          <Link to="/products" className="bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition inline-block">
            View All Products
          </Link>
        </div>
      </section>


      {/* CTA Band */}
      <div className="bg-gradient-to-br from-accent to-mid px-5 sm:px-10 py-12 md:py-16 text-center">
        <h2 className="font-display text-2xl sm:text-[32px] font-extrabold text-white mb-3">Expand Your Business with MediVision</h2>
        <p className="text-[#CAF0F8] text-[15px] mb-7 max-w-xl mx-auto">
          Become a distributor or partner for advanced radiology equipment — portable X-ray, DR systems, C-Arms and more.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link to="/contact" className="bg-white text-mid px-7 py-3 rounded-[9px] font-bold text-sm hover:bg-lightbg transition inline-block">
            Become a Partner
          </Link>
          <Link to="/products" className="bg-transparent text-white px-7 py-3 rounded-[9px] font-semibold text-sm border-2 border-white/35 hover:bg-white/10 transition inline-block">
            GeM Approved Vendor →
          </Link>
        </div>
      </div>

      {/* Partners */}
      <div className="px-5 sm:px-10 py-10 md:py-12 text-center bg-white">
        <div className="text-xs sm:text-[13px] font-semibold tracking-[2px] uppercase text-textmuted mb-7">Our Technology Partners</div>
        <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap max-w-5xl mx-auto">
          {partners.map((p) => (
            <div key={p} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-bordercol rounded-full text-[13px] font-semibold text-textmuted hover:border-accent hover:text-mid transition cursor-pointer">
              <div className="w-2.5 h-2.5 rounded-full bg-accent2" />
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* Enquiry + Newsletter */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-7xl mx-auto">
          {/* Form */}
          <div>
            <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Quick Enquiry</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-3.5">Get in Touch</h2>
            <p className="text-[15px] text-textmuted leading-relaxed mb-7">Fill out the form and our team will get back to you within 24 hours.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1.5">First Name</label>
                <input type="text" placeholder="Ravi" className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1.5">Last Name</label>
                <input type="text" placeholder="Sharma" className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
              </div>
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">Email Address</label>
              <input type="email" placeholder="ravi@hospital.in" className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">Phone Number</label>
              <input type="tel" placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">Product Interest</label>
              <select className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition">
                <option>Select a product...</option>
                <option>Handheld Portable X-Ray</option>
                <option>Mobile X-Ray System</option>
                <option>Digital Radiography (DR)</option>
                <option>Computed Radiography (CR)</option>
                <option>Surgical C-Arm</option>
              </select>
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">Message</label>
              <textarea placeholder="Tell us about your requirements..." rows={4} className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-y" />
            </div>
            <button className="w-full bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition">
              Submit Enquiry
            </button>
          </div>

          {/* Side */}
          <div>
            <div className="bg-primary rounded-2xl p-7 sm:p-8 text-white mb-5">
              <h3 className="font-display text-xl sm:text-[22px] font-extrabold mb-2.5">Subscribe to Our Newsletter</h3>
              <p className="text-sm text-[#90CAE0] leading-relaxed mb-5">
                Stay ahead with the latest updates in radiology technology, industry news and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row mb-3 gap-2 sm:gap-0">
                <input type="email" placeholder="Your email address" className="flex-1 px-3.5 py-2.5 rounded-lg sm:rounded-r-none text-sm outline-none text-textDark" />
                <button className="bg-cta text-white px-4.5 py-2.5 rounded-lg sm:rounded-l-none font-semibold text-sm hover:bg-ctadark transition whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-[#4A7A95]">We respect your privacy. Unsubscribe anytime.</p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-bordercol">
              <h3 className="text-lg font-bold text-primary mb-2.5">Join Our Team</h3>
              <p className="text-sm text-textmuted leading-relaxed mb-4.5">
                At MediVision Healthcare, we empower passionate people to make a real difference in patient care through cutting-edge imaging technology.
              </p>
              <Link to="/career" className="bg-cta text-white px-6 py-2.5 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition inline-block">
                View Open Positions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
