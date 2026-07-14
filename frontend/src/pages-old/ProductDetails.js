import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, BACKEND_URL } from '../config';
import DefaultImg from '../Assets/Default.png';

export default function ProductDetails() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Inquiry Form State
  const [inquiryData, setInquiryData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_BASE_URL}/products/${slug}`);
        if (res.data.success) {
          const prod = res.data.product;
          setProduct(prod);
          setRelated(res.data.relatedProducts || []);
          
          // Set initial active image
          const defaultImg = prod.thumbnail && prod.thumbnail !== '/uploads/default-product.png'
            ? `${BACKEND_URL}${prod.thumbnail}`
            : '/logo.png';
          setActiveImage(defaultImg);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [slug]);

  // Scroll to top when slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryData.name || !inquiryData.email || !inquiryData.message) {
      alert('Please fill out all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...inquiryData,
        product: product.name,
      };
      const res = await axios.post(`${API_BASE_URL}/messages`, payload);
      if (res.data.success) {
        setSubmitSuccess(true);
        setInquiryData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EAF6FB]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-mid border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-500">Loading product datasheet...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-[#EAF6FB] px-5">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-extrabold text-primary mb-2">Product Not Found</h2>
        <p className="text-sm text-textmuted text-center max-w-md mb-6">{error || 'The product you are looking for does not exist or has been removed.'}</p>
        <Link to="/products" className="bg-mid text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow hover:bg-[#005f92] transition">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // Gallery image helper
  const allImages = [
    product.thumbnail && product.thumbnail !== '/uploads/default-product.png'
      ? `${BACKEND_URL}${product.thumbnail}`
      : '/logo.png',
    ...(product.gallery || []).map(img => `${BACKEND_URL}${img}`)
  ].filter(Boolean);

  return (
    <main className="bg-[#EAF6FB] min-h-screen pb-16">
      
      {/* 1. Dynamic Product Banner */}
      <div 
        className="px-5 sm:px-10 py-12 md:py-16 text-white relative overflow-hidden bg-[#395C6E] bg-no-repeat bg-right bg-contain"
        style={{ backgroundImage: `url(${DefaultImg})` }}
      >
        <div className="max-w-7xl mx-auto flex flex-col items-start gap-2.5 relative z-10">
          <Link to="/products" className="text-xs text-accent hover:underline font-bold uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <span>← Catalog</span>
          </Link>
          <span className="bg-[#00B4D8]/20 text-[#90E0EF] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.category?.name || 'Radiography'}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black mb-3">{product.name}</h1>
          <p className="text-sm sm:text-base text-[#B0D8ED] max-w-2xl leading-relaxed">
            {product.shortDescription || 'Professional medical grade imaging system designed for maximum diagnostic precision.'}
          </p>
        </div>
      </div>

      {/* Main product sheet body */}
      <section className="px-5 sm:px-10 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Columns - Photos, Descriptions, Specs */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* 2. Interactive Product Images Gallery */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-100 relative group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Thumbnails grid */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-20 h-20 rounded-xl overflow-hidden bg-white border-2 flex items-center justify-center p-1.5 shrink-0 transition ${
                        activeImage === img ? 'border-mid shadow-md' : 'border-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt={`Thumb ${i}`} className="max-h-full max-w-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Product Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-xl font-bold font-display text-primary">Product Overview</h3>
              <div className="prose prose-slate max-w-none text-slate-650 text-sm sm:text-[15px] leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* 4. Key Features Section */}
            {product.keyFeatures && product.keyFeatures.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-display text-primary">Key Highlights</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.keyFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 text-xs mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 6. Technical Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
                <h3 className="text-xl font-bold font-display text-primary">Technical Datasheet</h3>
                <div className="overflow-hidden border border-slate-100 rounded-2xl">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-4 pl-6">Parameters</th>
                        <th className="p-4 pr-6">Specifications</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {product.specifications
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((spec, i) => (
                          <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                            <td className="p-4 pl-6 font-semibold text-primary">{spec.name}</td>
                            <td className="p-4 pr-6 text-slate-600 font-medium">{spec.value}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Side Card containing PDF Download and Form */}
          <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-6">
            
            {/* 5. Download Brochure Card */}
            {product.brochureUrl && (
              <div className="bg-gradient-to-br from-mid to-[#005f92] rounded-3xl p-6 text-white shadow-lg space-y-4">
                <div className="text-2xl">📄</div>
                <div>
                  <h4 className="font-bold text-md">Official Brochure</h4>
                  <p className="text-xs text-[#CAF0F8] mt-1">Download complete technical parameters and safety compliance PDF sheet.</p>
                </div>
                <a
                  href={`${BACKEND_URL}${product.brochureUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-white text-mid py-3 rounded-xl font-bold text-sm block text-center shadow-md hover:bg-slate-50 transition cursor-pointer"
                >
                  Download PDF Datasheet
                </a>
              </div>
            )}

            {/* 7. Product Inquiry Form Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-primary font-display text-md">Request a Quote</h4>
                <p className="text-xs text-textmuted mt-0.5">Submit your query for custom packaging or order pricing.</p>
              </div>

              {submitSuccess ? (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-5 rounded-2xl text-center space-y-3">
                  <div className="text-3xl">🎉</div>
                  <h5 className="font-bold text-sm">Thank you!</h5>
                  <p className="text-xs">Your quotation request has been received. Our clinical specialists will reach out shortly.</p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="text-xs font-semibold text-mid hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryData.name}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g. Dr. John Doe"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={inquiryData.email}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="doctor@hospital.com"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                      Phone / Mobile
                    </label>
                    <input
                      type="tel"
                      value={inquiryData.phone}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">
                      Message *
                    </label>
                    <textarea
                      required
                      rows="3"
                      value={inquiryData.message}
                      onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Specify your clinic size, expected count of systems, or installation address..."
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent text-xs"
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-cta text-white py-3 rounded-xl font-bold text-sm hover:bg-ctadark transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? 'Sending Request...' : 'Submit Quotation Request'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Related Products Section */}
      {related.length > 0 && (
        <section className="px-5 sm:px-10 py-12 max-w-7xl mx-auto border-t border-slate-200/60 mt-8">
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Related Solutions</span>
            <h3 className="font-display text-2xl font-black text-primary mt-1">Other Products in this Category</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((prod) => {
              const displayImage = prod.thumbnail && prod.thumbnail !== '/uploads/default-product.png'
                ? `${BACKEND_URL}${prod.thumbnail}`
                : null;
              return (
                <div key={prod._id} className="border border-slate-200/80 rounded-2xl p-5 bg-white flex flex-col justify-between hover:shadow-lg transition">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-3.5 overflow-hidden border border-slate-100">
                      {displayImage ? (
                        <img src={displayImage} alt={prod.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xl">🏥</span>
                      )}
                    </div>
                    <div className="font-bold text-[14px] text-primary mb-1.5">{prod.name}</div>
                    <p className="text-[12px] text-textmuted line-clamp-2 leading-relaxed">{prod.shortDescription || prod.description}</p>
                  </div>
                  <Link to={`/products/${prod.slug}`} className="text-xs text-mid font-bold mt-4 inline-block hover:underline">
                    View Data Sheet →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

    </main>
  );
}
