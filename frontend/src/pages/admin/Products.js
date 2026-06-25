import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';

export default function Products() {
  const { showToast } = useAdminAuth();
  
  // Products states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, pages: 1 });
  
  // Queries
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    shortDescription: '',
    description: '',
    price: '',
    stock: '',
    videoUrl: '',
    metaTitle: '',
    metaDescription: '',
  });

  // Dynamic Specs & Features
  const [specs, setSpecs] = useState([{ name: '', value: '', order: 0 }]);
  const [features, setFeatures] = useState(['']);

  // File Upload states
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  const [brochureFile, setBrochureFile] = useState(null);
  const [brochureName, setBrochureName] = useState('');

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products?page=${currentPage}&limit=8&search=${search}&category=${selectedCategory}`);
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || { page: 1, limit: 8, total: 0, pages: 1 });
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Error loading products list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [currentPage, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // Form Field Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleBrochureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBrochureFile(file);
      setBrochureName(file.name);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(prev => [...prev, ...files]);
    const previews = files.map(file => URL.createObjectURL(file));
    setGalleryPreviews(prev => [...prev, ...previews]);
  };

  // Dynamic spec actions
  const handleAddSpecRow = () => {
    setSpecs(prev => [...prev, { name: '', value: '', order: prev.length }]);
  };

  const handleSpecChange = (index, field, val) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleDeleteSpecRow = (index) => {
    const updated = specs.filter((_, idx) => idx !== index);
    updated.forEach((item, i) => item.order = i);
    setSpecs(updated);
  };

  const moveSpecRow = (index, direction) => {
    const updated = [...specs];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    updated.forEach((item, i) => item.order = i);
    setSpecs(updated);
  };

  // Features Actions
  const handleAddFeature = () => {
    setFeatures(prev => [...prev, '']);
  };

  const handleFeatureChange = (index, val) => {
    const updated = [...features];
    updated[index] = val;
    setFeatures(updated);
  };

  const handleDeleteFeature = (index) => {
    setFeatures(features.filter((_, idx) => idx !== index));
  };

  // Remove existing gallery image (Edit Mode)
  const handleRemoveExistingGallery = (path) => {
    setExistingGallery(prev => prev.filter(img => img !== path));
  };

  // Remove newly selected gallery image
  const handleRemoveNewGallery = (index) => {
    setGalleryFiles(prev => prev.filter((_, idx) => idx !== index));
    setGalleryPreviews(prev => prev.filter((_, idx) => idx !== index));
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0]?._id || '',
      shortDescription: '',
      description: '',
      price: '',
      stock: '',
      videoUrl: '',
      metaTitle: '',
      metaDescription: '',
    });
    setSpecs([{ name: '', value: '', order: 0 }]);
    setFeatures(['']);
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setBrochureFile(null);
    setBrochureName('');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery([]);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      category: product.category?._id || product.category || '',
      shortDescription: product.shortDescription || '',
      description: product.description,
      price: product.price ? product.price.toString() : '',
      stock: product.stock ? product.stock.toString() : '0',
      videoUrl: product.videoUrl || '',
      metaTitle: product.metaTitle || '',
      metaDescription: product.metaDescription || '',
    });
    setSpecs(product.specifications && product.specifications.length > 0 
      ? [...product.specifications].sort((a,b) => a.order - b.order)
      : [{ name: '', value: '', order: 0 }]);
    setFeatures(product.keyFeatures && product.keyFeatures.length > 0 ? [...product.keyFeatures] : ['']);
    setThumbnailFile(null);
    setThumbnailPreview(product.thumbnail ? `http://localhost:5000${product.thumbnail}` : null);
    setBrochureFile(null);
    setBrochureName(product.brochureUrl ? 'Current Brochure PDF' : '');
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setExistingGallery(product.gallery || []);
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description || !formData.category) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('slug', formData.slug);
    payload.append('category', formData.category);
    payload.append('shortDescription', formData.shortDescription);
    payload.append('description', formData.description);
    payload.append('price', formData.price || '0');
    payload.append('stock', formData.stock || '0');
    payload.append('videoUrl', formData.videoUrl);
    payload.append('metaTitle', formData.metaTitle);
    payload.append('metaDescription', formData.metaDescription);
    
    // Arrays parsing
    payload.append('keyFeatures', JSON.stringify(features.filter(f => f.trim() !== '')));
    payload.append('specifications', JSON.stringify(specs.filter(s => s.name.trim() !== '')));
    payload.append('existingGallery', JSON.stringify(existingGallery));

    if (thumbnailFile) {
      payload.append('thumbnail', thumbnailFile);
    }
    if (brochureFile) {
      payload.append('brochure', brochureFile);
    }
    galleryFiles.forEach((file) => {
      payload.append('gallery', file);
    });

    try {
      if (editingProduct) {
        // Edit Product
        const res = await api.put(`/products/${editingProduct._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('Product updated successfully', 'success');
          fetchProducts();
          setModalOpen(false);
        }
      } else {
        // Add Product
        const res = await api.post('/products', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('Product created successfully', 'success');
          setCurrentPage(1);
          fetchProducts();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save product details', 'error');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action is permanent.')) {
      return;
    }

    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data.success) {
        showToast('Product deleted successfully', 'success');
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
            Product Management
          </h2>
          <p className="text-sm text-textmuted">
            Add and manage medical equipment datasheets, brochures, and specifications.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-mid to-accent text-white font-semibold shadow-lg shadow-mid/30 hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>

      {/* Control Bar (Search & Filter) */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 items-center justify-between shadow">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product names..."
            className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent"
          />
          <button type="submit" className="px-4 py-2.5 bg-mid text-white text-sm font-semibold rounded-xl hover:opacity-95 transition cursor-pointer">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:w-56 bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Products list grid */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-5">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
            <h3 className="text-lg font-bold">No Products Registered</h3>
            <p className="text-sm text-textmuted mt-1">Populate the catalog by clicking Add Product above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">Equipment</th>
                  <th className="p-5">Category</th>
                  <th className="p-5 text-center">Specs Count</th>
                  <th className="p-5 text-center">In Stock</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* Details */}
                    <td className="p-5 min-w-[280px]">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.thumbnail ? `http://localhost:5000${product.thumbnail}` : '/logo.png'}
                          alt={product.name}
                          onError={(e) => { e.target.src = '/logo.png'; }}
                          className="w-12 h-12 rounded-xl object-cover border border-[#d0e8f5]/30 dark:border-slate-800 bg-white"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-800 dark:text-white truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-textmuted font-mono truncate mt-0.5" title={product.slug}>
                            slug: {product.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-5 text-slate-650 dark:text-slate-350">
                      {product.category?.name || 'Unassigned'}
                    </td>

                    {/* Specifications Count */}
                    <td className="p-5 text-center font-bold text-slate-600 dark:text-slate-300">
                      {product.specifications ? product.specifications.length : 0} rows
                    </td>

                    {/* Stock */}
                    <td className="p-5 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        product.stock === 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'
                      }`}>
                        {product.stock} units
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-1.5 rounded-lg border border-mid/20 bg-mid/5 hover:bg-mid text-mid hover:text-white transition duration-200 cursor-pointer"
                          title="Edit datasheet"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.062a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition duration-200 cursor-pointer"
                          title="Remove product"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                          </svg>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.pages > 1 && (
          <div className="p-4 border-t border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/20 dark:bg-slate-900/10 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3.5 py-2 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl bg-white dark:bg-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition hover:border-accent cursor-pointer"
              >
                Prev
              </button>
              <button
                disabled={currentPage === pagination.pages}
                onClick={() => setCurrentPage((p) => Math.min(pagination.pages, p + 1))}
                className="px-3.5 py-2 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl bg-white dark:bg-slate-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition hover:border-accent cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Datasheet Modal Form */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl max-h-[92vh] overflow-y-auto">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800/50 pb-3">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                {editingProduct ? 'Edit Medical Product' : 'Add New Medical Product'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-white"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
              
              {/* Basic Meta Block */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
                  Basic Information
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. ERAY SMART 5HS"
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      URL Slug (Optional)
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="eray-smart-5hs"
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                    >
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Price ($ / ₹)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div className="md:col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Stock Count
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="Quantity"
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Descriptions & Video */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
                  Descriptions &amp; Media Links
                </h4>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Short Description
                  </label>
                  <input
                    type="text"
                    name="shortDescription"
                    value={formData.shortDescription}
                    onChange={handleInputChange}
                    placeholder="Short highlight text for catalog lists..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Full Product Description *
                  </label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Detailed description of features, clinical use cases..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Product Video URL
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="YouTube or Vimeo links..."
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Cover & Files Uploader */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
                  File Uploads &amp; Image Gallery
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Thumbnail Cover */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Thumbnail Image
                    </label>
                    <div className="flex gap-4 items-center">
                      {thumbnailPreview && (
                        <img
                          src={thumbnailPreview}
                          alt="Cover Preview"
                          className="w-14 h-14 rounded-xl object-cover border border-slate-200 bg-white"
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="block w-full text-xs text-slate-500
                          file:mr-3 file:py-1.5 file:px-3
                          file:rounded-xl file:border-0
                          file:text-xs file:font-semibold
                          file:bg-mid/10 file:text-mid
                          hover:file:bg-mid/20 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Brochure PDF */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Product Brochure (PDF Only)
                    </label>
                    <div className="flex gap-2 items-center">
                      {brochureName && (
                        <span className="text-xs text-emerald-500 font-bold shrink-0">
                          {brochureName.length > 20 ? 'PDF Selected' : brochureName}
                        </span>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleBrochureChange}
                        className="block w-full text-xs text-slate-500
                          file:mr-3 file:py-1.5 file:px-3
                          file:rounded-xl file:border-0
                          file:text-xs file:font-semibold
                          file:bg-mid/10 file:text-mid
                          hover:file:bg-mid/20 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* Multiple Gallery Images */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product Image Gallery (Select multiple)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleGalleryChange}
                    className="block w-full text-xs text-slate-500
                      file:mr-3 file:py-1.5 file:px-3
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-mid/10 file:text-mid
                      hover:file:bg-mid/20 cursor-pointer"
                  />
                  
                  {/* Gallery previews / Existing images */}
                  {(existingGallery.length > 0 || galleryPreviews.length > 0) && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {/* Existing image items */}
                      {existingGallery.map((img, i) => (
                        <div key={`exist-${i}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                          <img src={`http://localhost:5000${img}`} alt="Exist preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveExistingGallery(img)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}

                      {/* New Image previews */}
                      {galleryPreviews.map((img, i) => (
                        <div key={`new-${i}`} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                          <img src={img} alt="New preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveNewGallery(i)}
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shadow-md hover:bg-rose-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Specifications list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
                    Dynamic Specifications
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-xs text-mid hover:text-accent font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Add Row</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {specs.map((row, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="kV Range, Weight..."
                        value={row.name}
                        onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                        className="flex-1 bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent"
                      />
                      <input
                        type="text"
                        placeholder="50-90 kV, 3.8 Kg..."
                        value={row.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        className="flex-1 bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent"
                      />

                      {/* Sort arrows */}
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSpecRow(index, -1)}
                        className="p-1 border border-slate-200 dark:border-slate-800 rounded text-slate-500 disabled:opacity-20 text-[10px]"
                      >
                        ▲
                      </button>
                      <button
                        type="button"
                        disabled={index === specs.length - 1}
                        onClick={() => moveSpecRow(index, 1)}
                        className="p-1 border border-slate-200 dark:border-slate-800 rounded text-slate-500 disabled:opacity-20 text-[10px]"
                      >
                        ▼
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSpecRow(index)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition text-xs shrink-0 cursor-pointer"
                        title="Delete Row"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Features bullet points list */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800/40 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8]">
                    Key Features List
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="text-xs text-mid hover:text-accent font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>+ Add Bullet</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {features.map((feat, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <span className="text-xs text-slate-450 select-none shrink-0 font-bold">
                        {index + 1}.
                      </span>
                      <input
                        type="text"
                        placeholder="Write product highlight..."
                        value={feat}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-1.5 px-3 text-xs focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteFeature(index)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition text-xs shrink-0 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO Configurations */}
              <div className="border-t border-[#d0e8f5]/30 dark:border-slate-800/40 pt-4 mt-6">
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#00B4D8] mb-3">
                  Search Engine SEO Tags
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      name="metaTitle"
                      value={formData.metaTitle}
                      onChange={handleInputChange}
                      placeholder="Product sheet browser header title..."
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      name="metaDescription"
                      value={formData.metaDescription}
                      onChange={handleInputChange}
                      placeholder="Product description preview snippet..."
                      className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-xs focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Save/Cancel actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-[#d0e8f5]/40 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-900/50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
