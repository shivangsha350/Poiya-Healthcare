import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { API_BASE_URL, BACKEND_URL } from '../config';
import ProductCard from '../components/ProductCard';
import ProductHeroImg from '../Assets/ProductHero.png';

const advantages = [
  { icon: '🏆', title: 'Bain Medical Authorised', desc: 'Official distributor and service partner of Bain Medical in India.' },
   { icon: '🇮🇳', title: 'Dealership', desc: 'We deal in Pre owned Siemenes Products like  CT Scan,MRI,CATHLAB ,Dialysis Machines and diagnostics equipments.' },
  { icon: '🔧', title: 'Pan-India Service', desc: 'We provide our products to all over the India .' },
  { icon: '💰', title: 'Flexible Financing', desc: 'EMI options, rental plans and government tender support available.' },
  { icon: '🤖', title: 'AI-Ready Systems', desc: 'All new systems are AI integration-ready with API support.' },
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

function SubcategoryCard({ image, name, description, onClick, index = 0 }) {
  const displayImage = image ? `${BACKEND_URL}${image}` : null;
  const tint = index % 2 === 0 ? 'bg-sky-50' : 'bg-emerald-50';

  return (
    <div
      onClick={onClick}
      className="group relative rounded-2xl border border-bordercol bg-white overflow-hidden transition-all duration-500 ease-out hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,100,160,0.15)] hover:border-accent2 cursor-pointer flex flex-col justify-between"
    >
      <div className={`relative w-full h-40 ${tint} overflow-hidden flex items-center justify-center`}>
        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            loading="lazy"
            className="max-w-full max-h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="text-3xl transition-transform duration-500 ease-out group-hover:scale-110">
            📁
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      <div className="px-4 py-4 text-center flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[15px] text-primary leading-snug mb-1 line-clamp-1">
            {name}
          </h3>
          <p className="text-xs text-textmuted leading-relaxed line-clamp-2 mb-3">
            {description || 'Explore products in this category.'}
          </p>
        </div>
        <div className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-bordercol py-2 text-[12px] font-semibold text-mid transition-all duration-300 ease-out group-hover:bg-accent2 group-hover:border-accent2 group-hover:text-white mt-2">
          Explore Products
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
            fill="none"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      
      {/* Glowing ring highlight on hover */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-accent2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

export default function Products() {
  const [active, setActive] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [rawCategories, setRawCategories] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
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
          const rawCats = catRes.data.categories || [];
          setRawCategories(rawCats);
          const mainCatNames = rawCats
            .filter((c) => !c.parent)
            .map((c) => c.name);
          setCategories(['All', ...mainCatNames]);
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicData();
  }, []);

  // Reset subcategory when tab changes
  useEffect(() => {
    setActiveSubcategory(null);
  }, [active]);

  const activeCategoryObj = rawCategories.find(c => c.name === active);
  const activeSubcategories = activeCategoryObj
    ? rawCategories.filter(c => c.parent && (c.parent._id === activeCategoryObj._id || c.parent === activeCategoryObj._id))
    : [];

  const filtered = active === 'All'
    ? products
    : activeSubcategory
      ? products.filter((p) => {
          const subCatId = p.subcategory?._id || p.subcategory;
          return subCatId === activeSubcategory._id;
        })
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
          ) : activeSubcategories.length > 0 && !activeSubcategory ? (
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Select a subcategory to browse products:
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {activeSubcategories.map((sub, idx) => (
                  <SubcategoryCard
                    key={sub._id}
                    image={sub.image}
                    name={sub.name}
                    description={sub.description}
                    onClick={() => setActiveSubcategory(sub)}
                    index={idx}
                  />
                ))}
              </div>
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
            <div>
              {activeSubcategory && (
                <div className="mb-6 flex items-center gap-2">
                  <button
                    onClick={() => setActiveSubcategory(null)}
                    className="text-xs font-black uppercase tracking-wider text-mid hover:text-[#005f92] flex items-center gap-1 cursor-pointer bg-white border border-bordercol px-3.5 py-1.5 rounded-xl shadow-sm hover:shadow transition"
                  >
                    ← Back to Subcategories
                  </button>
                  <span className="text-xs text-textmuted">/</span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-200/60 px-3 py-1 rounded-lg">
                    {activeSubcategory.name}
                  </span>
                </div>
              )}
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
            </div>
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
