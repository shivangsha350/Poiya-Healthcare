import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import ProductCard from '../components/ProductCard';
import ProductHeroImg from '../Assets/ProductHero.png';

const advantages = [
  { icon: '🏆', title: 'Carestream Authorised', desc: 'Official distributor and service partner of Carestream Health USA in India.' },
  { icon: '🔧', title: 'Pan-India Service', desc: 'We provide our products to all over the India .' },
  { icon: '💰', title: 'Flexible Financing', desc: 'EMI options, rental plans and government tender support available.' },
  { icon: '🤖', title: 'AI-Ready Systems', desc: 'All new systems are AI integration-ready with API support.' },
  { icon: '🇮🇳', title: 'Make in India', desc: 'Proudly manufacturing portable systems domestically since 2015.' },
  { icon: '📋', title: 'GeM Registered', desc: 'Registered on the Government e-Marketplace for institutional procurement.' },
];

// Signature motif: viewfinder / scanner corner brackets, reused across hero, cards, and feature tiles
function CornerBrackets({ size = 'w-5 h-5', color = 'border-accent', visibility = 'opacity-100' }) {
  const base = `absolute ${size} ${color} ${visibility} pointer-events-none transition-all duration-300`;
  return (
    <>
      <span className={`${base} -top-2 -left-2 border-t-2 border-l-2`} />
      <span className={`${base} -top-2 -right-2 border-t-2 border-r-2`} />
      <span className={`${base} -bottom-2 -left-2 border-b-2 border-l-2`} />
      <span className={`${base} -bottom-2 -right-2 border-b-2 border-r-2`} />
    </>
  );
}

// Faint measurement-grid backdrop, evokes a diagnostic monitor overlay
function GridBackdrop({ id, className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Products() {
  const [active, setActive] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/products?limit=100`),
          axios.get(`${API_BASE_URL}/categories`),
        ]);

        if (prodRes.data.success) {
          setProducts(prodRes.data.products || []);
        }
        if (catRes.data.success) {
          const names = (catRes.data.categories || []).map((c) => c.name);
          setCategories(['All', ...names]);
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  const filtered = active === 'All'
    ? products
    : products.filter((p) => {
        const catName = p.category?.name || p.category;
        return catName === active;
      });

  return (
    <main className="bg-[#EAF6FB] min-h-screen antialiased">

      {/* Hero Header */}
      <div className="relative w-full overflow-hidden">
        <img
          src={ProductHeroImg}
          alt="Our Product Range"
          className="w-full h-auto object-cover"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-10 sm:h-14"
          style={{ background: '#EAF6FB', clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 100%)' }}
        />
      </div>

      {/* Main Catalog Section */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">

          {/* Filter Tabs */}
          <div className="flex gap-3 flex-wrap mb-3">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActive(cat)}
                whileTap={{ scale: 0.95 }}
                className={`relative px-6 py-2.5 rounded-full border-2 text-[13px] font-extrabold tracking-wider uppercase transition-colors duration-200 whitespace-nowrap overflow-hidden ${
                  active === cat
                    ? 'text-white border-transparent'
                    : 'bg-white text-primary border-bordercol hover:border-mid'
                }`}
              >
                {active === cat && (
                  <motion.span
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-mid to-primary"
                    transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
              </motion.button>
            ))}
          </div>
          <div className="h-1 w-16 bg-accent rounded-full mb-10" />

          {/* Catalog Content Area */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-60 border border-bordercol rounded-2xl p-6 bg-white animate-pulse flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 mb-4"></div>
                    <div className="h-4 w-1/2 bg-slate-100 rounded mb-2"></div>
                    <div className="h-3 w-3/4 bg-slate-100 rounded mb-2"></div>
                    <div className="h-3 w-1/3 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-8 w-1/4 bg-slate-100 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-bordercol"
            >
              <p className="text-sm text-textmuted">No products available in this category.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((p, idx) => (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                  >
                    <ProductCard
                      _id={p._id}
                      image={p.image}
                      name={p.name}
                      category={p.category?.name || p.category}
                      slug={p.slug}
                      index={idx}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Why Choose Section — bold dark variant */}
      <section className="px-5 sm:px-10 py-20 md:py-28 bg-primary relative overflow-hidden">
        <GridBackdrop id="gridWhy" className="opacity-[0.05] text-white" />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-7xl mx-auto relative z-10"
        >
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-4 bg-white/5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Why Poiya
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">The Poiya Healthcure Advantages</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto relative z-10">
          {advantages.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white/[0.04] border-2 border-white/10 rounded-2xl p-7 sm:p-8 backdrop-blur-sm hover:border-accent/60 hover:bg-white/[0.07] transition-all duration-300"
            >
              <CornerBrackets size="w-4 h-4" color="border-accent" visibility="opacity-0 group-hover:opacity-100" />
              <div className="text-2xl sm:text-3xl mb-4 bg-accent/10 w-14 h-14 rounded-xl flex items-center justify-center border border-accent/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                {item.icon}
              </div>
              <h4 className="font-bold text-base text-white mb-2">{item.title}</h4>
              <p className="text-[13px] text-[#B0D8ED]/80 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <div className="bg-gradient-to-br from-accent to-mid px-5 sm:px-10 py-20 md:py-24 text-center relative overflow-hidden">
        <GridBackdrop id="gridCta" className="opacity-[0.07] text-white" />

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="text-5xl mb-5"
          >
            🩺
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl sm:text-[40px] font-extrabold text-white mb-4 tracking-tight"
          >
            Need a Custom Configuration?
          </motion.h2>
          <p className="text-[#CAF0F8] text-sm sm:text-base mb-10 leading-relaxed">
            Our team can help design the right radiology setup for your facility size, budget and workflow.
          </p>

          <div className="relative inline-block">
            {!shouldReduceMotion && (
              <motion.span
                className="absolute inset-0 rounded-xl bg-white/40"
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}
            <Link
              to="/contact"
              className="relative bg-white text-mid px-10 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wide hover:shadow-[0_10px_30px_rgba(255,255,255,0.35)] shadow-md shadow-black/10 transition-all duration-200 hover:scale-[1.03] inline-block"
            >
              Talk to an Expert
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
