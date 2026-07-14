import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Hero from "../components/Hero";
import QuickInfo from "../components/QuickInfo";
import StatsBand from "../components/StatsBand";
import ProductCard from "../components/ProductCard";
import aboutImage from "../Assets/About.webp"; // <-- apni image ka naam yaha likho

const staticProducts = [
  {
    slug: "handheld",
    name: "Handheld Portable X-Ray",
    category: "Portable X-Ray",
    desc: "Compact, lightweight X-ray solutions for field and remote diagnostic use.",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="18" r="1" />
      </svg>
    ),
  },
  {
    slug: "mobile",
    name: "Mobile X-Ray Solutions",
    category: "Mobile X-Ray",
    desc: "50kW mobile digital systems built for versatile hospital-floor use.",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    slug: "dr",
    name: "Digital Radiography (DR)",
    category: "Digital Radiography",
    desc: "High-resolution flat-panel DR systems for fast, precise imaging.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    slug: "cr",
    name: "Computed Radiography (CR)",
    category: "Computed Radiography",
    desc: "Carestream & Trimax CR systems — trusted by hospitals nationwide.",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    slug: "carm",
    name: "Surgical C-Arms",
    category: "C-Arm Systems",
    desc: "Real-time fluoroscopic imaging for orthopaedic and surgical suites.",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
      </svg>
    ),
  },
  {
    slug: "software",
    name: "TB AI / Radiology Software",
    category: "Software / AI",
    desc: "AI-powered TB detection and radiology reporting software solutions.",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
];

const partners = [
  "Carestream Health",
  "Trimax Medical",
  "iRay Technology",
  "Poskom",
  "Lanmage",
];

export default function Home() {
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        // Try fetching featured products first
        const res = await axios.get(`${API_BASE_URL}/products?featured=true&limit=10`);
        if (res.data.success && res.data.products && res.data.products.length > 0) {
          setDisplayProducts(res.data.products);
        } else {
          // Fallback to latest 10 products if no featured products are marked
          const backupRes = await axios.get(`${API_BASE_URL}/products?limit=10`);
          if (backupRes.data.success && backupRes.data.products && backupRes.data.products.length > 0) {
            setDisplayProducts(backupRes.data.products);
          } else {
            setDisplayProducts([]); // Do not fallback to static mock products
          }
        }
      } catch (err) {
        console.error("Error fetching homepage products:", err);
        setDisplayProducts([]); // Empty on error
      }
    };
    fetchHomeProducts();
  }, []);

  return (
    <main>
      <Hero />
      <QuickInfo />

      {/* About */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-cyan-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
          {/* Left Image */}
          <div className="order-2 lg:order-1 reveal">
            <div className="rounded-[20px] overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <img
                src={aboutImage}
                alt="About Poiya Healthcare"
                className="w-full h-[240px] md:h-[340px] lg:h-[420px]
object-cover rounded-[20px]
transition-transform duration-500 ease-in-out
hover:scale-110 cursor-pointer"/>
            </div>
          </div>

          {/* Right Content */}
          <div className="order-1 lg:order-2 reveal">
            <div className="text-3xl font-extrabold tracking-[2px] uppercase text-accent mb-2.5">
              About Poiya Healthcare
            </div>

            <h2 className="font-display text-xl sm:text-3xl font-semibold text-primary mb-3.5 leading-snug">
              A Trusted Leader in Healthcare Industry
            </h2>

            <p className="text-[15px] text-textmuted leading-relaxed mb-6">
What began in 2008 as Digital Photo Chemistry under Mr. Ramkumarr
        Dubey has grown into Poiya Healthcare(India) Pvt. Ltd. — a trusted
        supplier of diagnostic imaging, Nephrology, Pathology, Oncology and otherr medical 
        equipments to hospitals and diagnostic centres nationwide. Headquartered
        in Jaipur, Rajasthan, we continue to serve customers across India with
        quality products and dependable services.
            </p>

            <ul className="flex flex-col gap-3 mb-7">
              {[
                          "Digital Radiography (DR) & Computed Radiography (CR) Systems",
          "X-Ray Machines, C-Arm & Cath Lab Systems",
          "CT Scan & MRI Systems",
          "Dialysis Machines & Consumables",
          "Pathology & Oncology Equipment",
          "Nationwide AMC, Installation & Technical Support",

              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-primary text-[15px]"
                >
                  <span className="w-6 h-6 rounded-full bg-lightbg text-mid flex items-center justify-center font-bold flex-shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              to="/about"
              className="inline-block bg-cta hover:bg-ctadark text-white px-7 py-3 rounded-[10px] font-semibold transition"
            >
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      <StatsBand />

      {/* Products */}
      {displayProducts.length > 0 && (
        <section className="px-5 sm:px-10 py-16 bg-cyan-50">
          <div className="max-w-7xl mx-auto">

            {/* Section Heading */}
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-sm mb-4">
                Our Products
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-primary mb-4">
                Complete Equipment Range
              </h2>

              <p className="max-w-2xl mx-auto text-gray-600 leading-7 text-justify">
                From portable handheld devices to advanced Digital Radiography systems, we provide reliable medical imaging solutions for hospitals, diagnostic centres, and healthcare professionals. Complementing our imaging expertise, we also offer advanced nephrology and oncology equipment and consumables, delivering complete healthcare solutions with innovation, precision, and trust.
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {displayProducts.map((p, idx) => (
                <ProductCard
                  key={p.slug || p._id}
                  _id={p._id}
                  name={p.name}
                  desc={p.description || p.desc}
                  slug={p.slug}
                  image={p.image}
                  category={p.category?.name || p.category}
                  icon={p.icon}
                  index={idx}
                />
              ))}
            </div>

            {/* Button */}
            <div className="text-center mt-14">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                View All Products

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

          </div>
        </section>
      )}

      {/* CTA Band */}
      {/* <div className="bg-gradient-to-br from-accent to-mid px-5 sm:px-10 py-12 md:py-16 text-center reveal">
        <h2 className="font-display text-2xl sm:text-[32px] font-extrabold text-white mb-3">
          Expand Your Business with Poiya Healthcare
        </h2>
        <p className="text-[#CAF0F8] text-[15px] mb-7 max-w-xl mx-auto">
          Become a distributor or partner for advanced radiology equipment —
          portable X-ray, DR systems, C-Arms and more.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link
            to="/contact"
            className="bg-white text-mid px-7 py-3 rounded-[9px] font-bold text-sm hover:bg-lightbg transition inline-block"
          >
            Become a Partner
          </Link>
          <Link
            to="/products"
            className="bg-transparent text-white px-7 py-3 rounded-[9px] font-semibold text-sm border-2 border-white/35 hover:bg-white/10 transition inline-block"
          >
            GeM Approved Vendor →
          </Link>
        </div>
      </div> */}

      {/* Partners */}
      {/* <div className="px-5 sm:px-10 py-10 md:py-12 text-center bg-white reveal">
        <div className="text-xs sm:text-[13px] font-semibold tracking-[2px] uppercase text-textmuted mb-7">
          Our Technology Partners
        </div>
        <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap max-w-5xl mx-auto">
          {partners.map((p) => (
            <div
              key={p}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border border-bordercol rounded-full text-[13px] font-semibold text-textmuted hover:border-accent hover:text-mid transition cursor-pointer"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-accent2" />
              {p}
            </div>
          ))}
        </div>
      </div> */}

      {/* Enquiry + Newsletter */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-7xl mx-auto">
          {/* Form */}
          <div className="reveal">
            <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">
              Quick Enquiry
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-3.5">
              Get in Touch
            </h2>
            <p className="text-[15px] text-textmuted leading-relaxed mb-7">
              Fill out the form and our team will get back to you within 24
              hours.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1.5">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Ravi"
                  className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-primary mb-1.5">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Sharma"
                  className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
                />
              </div>
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="ravi@hospital.in"
                className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition"
              />
            </div>
            <div className="mb-3.5">
              <label className="block text-[13px] font-medium text-primary mb-1.5">
                Product Interest
              </label>
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
              <label className="block text-[13px] font-medium text-primary mb-1.5">
                Message
              </label>
              <textarea
                placeholder="Tell us about your requirements..."
                rows={4}
                className="w-full px-3.5 py-2.5 border border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-y"
              />
            </div>
            <button className="w-full bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition">
              Submit Enquiry
            </button>
          </div>

          {/* Side */}
          <div>
            <div className="bg-primary rounded-2xl p-7 sm:p-8 text-white mb-5">
              <h3 className="font-display text-xl sm:text-[22px] font-extrabold mb-2.5">
                Subscribe to Our Newsletter
              </h3>
              <p className="text-sm text-[#90CAE0] leading-relaxed mb-5">
                Stay ahead with the latest updates in radiology technology,
                industry news and exclusive offers.
              </p>
              <div className="flex flex-col sm:flex-row mb-3 gap-2 sm:gap-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-3.5 py-2.5 rounded-lg sm:rounded-r-none text-sm outline-none text-textDark"
                />
                <button className="bg-cta text-white px-4.5 py-2.5 rounded-lg sm:rounded-l-none font-semibold text-sm hover:bg-ctadark transition whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-[#4A7A95]">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-7 border border-bordercol">
              <h3 className="text-lg font-bold text-primary mb-2.5">
                Join Our Team
              </h3>
              <p className="text-sm text-textmuted leading-relaxed mb-4.5">
                At Poiya Healthcare, we empower passionate people to make a
                real difference in patient care through cutting-edge imaging
                technology.
              </p>
              <Link
                to="/career"
                className="bg-cta text-white px-6 py-2.5 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition inline-block"
              >
                View Open Positions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
