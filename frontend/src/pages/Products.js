import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const advantages = [
  { icon: '🏆', title: 'Carestream Authorised', desc: 'Official distributor and service partner of Carestream Health USA in India.' },
  { icon: '🔧', title: 'Pan-India Service', desc: '50+ service centres with trained engineers for rapid on-site support.' },
  { icon: '💰', title: 'Flexible Financing', desc: 'EMI options, rental plans and government tender support available.' },
  { icon: '🤖', title: 'AI-Ready Systems', desc: 'All new systems are AI integration-ready with API support.' },
  { icon: '🇮🇳', title: 'Make in India', desc: 'Proudly manufacturing portable systems domestically since 2015.' },
  { icon: '📋', title: 'GeM Registered', desc: 'Registered on the Government e-Marketplace for institutional procurement.' },
];

export default function Products() {
  const [active, setActive] = useState('All');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products?limit=100'),
          axios.get('http://localhost:5000/api/categories'),
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
    <main>
      <div className="bg-gradient-to-br from-primary via-primary to-mid px-5 sm:px-10 py-12 md:py-[70px] text-center text-white">
        <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-3">What We Offer</div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-[42px] font-extrabold text-white mb-3">Our Product Range</h1>
        <p className="text-sm sm:text-base text-[#B0D8ED]">Complete radiology and imaging solutions for every healthcare setting</p>
      </div>

      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex gap-2.5 flex-wrap mb-8 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full border-[1.5px] text-[13px] font-semibold whitespace-nowrap transition ${
                  active === cat
                    ? 'bg-mid text-white border-mid'
                    : 'bg-white text-textmuted border-bordercol hover:border-accent hover:text-mid'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-56 border border-bordercol rounded-2xl p-6 bg-white animate-pulse">
                  <div className="w-13 h-13 w-[52px] h-[52px] rounded-[13px] bg-slate-200 mb-4"></div>
                  <div className="h-4 w-1/2 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-3/4 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 w-1/3 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-textmuted">No products available in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((p) => (
                <ProductCard
                  key={p._id}
                  _id={p._id}
                  image={p.image}
                  name={p.name}
                  desc={p.description}
                  category={p.category?.name || p.category}
                  slug={p.slug}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="text-center mb-10 max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Why MediVision</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">The MediVision Advantage</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {advantages.map((item, i) => (
            <div key={i} className="bg-white border-[1.5px] border-bordercol rounded-2xl p-6 sm:p-7 transition hover:border-accent2 hover:shadow-[0_6px_20px_rgba(0,100,160,0.08)]">
              <div className="text-2xl sm:text-3xl mb-3.5">{item.icon}</div>
              <h4 className="font-bold text-[15px] text-primary mb-2">{item.title}</h4>
              <p className="text-[13px] text-textmuted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-gradient-to-br from-accent to-mid px-5 sm:px-10 py-12 md:py-16 text-center">
        <h2 className="font-display text-2xl sm:text-[30px] font-extrabold text-white mb-3">Need a Custom Configuration?</h2>
        <p className="text-[#CAF0F8] text-sm sm:text-[15px] mb-7 max-w-xl mx-auto">
          Our team can help design the right radiology setup for your facility size, budget and workflow.
        </p>
        <Link to="/contact" className="bg-white text-mid px-8 py-3 rounded-[9px] font-bold text-sm hover:bg-lightbg transition inline-block">
          Talk to an Expert
        </Link>
      </div>
    </main>
  );
}
