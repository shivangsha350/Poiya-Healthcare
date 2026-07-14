"use client";
import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../../context/AdminAuthContext';
import { BACKEND_URL } from '../../../config';

export default function Categories() {
  const { showToast } = useAdminAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Active');
  const [parent, setParent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      showToast('Error loading categories list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setStatus('Active');
    setParent('');
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug || '');
    setDescription(cat.description || '');
    setStatus(cat.status || 'Active');
    setParent(cat.parent?._id || cat.parent || '');
    setImageFile(null);
    setImagePreview(cat.image ? `${BACKEND_URL}${cat.image}` : null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    const payload = new FormData();
    payload.append('name', name);
    payload.append('slug', slug);
    payload.append('description', description);
    payload.append('status', status);
    payload.append('parent', parent);
    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      if (editingCategory) {
        // Edit Category
        const res = await api.put(`/categories/${editingCategory._id}`, payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('Category updated successfully', 'success');
          fetchCategories();
          setModalOpen(false);
        }
      } else {
        // Add Category
        const res = await api.post('/categories', payload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        if (res.data.success) {
          showToast('Category created successfully', 'success');
          fetchCategories();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save category details', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products using this category must be reassigned first.')) {
      return;
    }

    try {
      const res = await api.delete(`/categories/${id}`);
      if (res.data.success) {
        showToast('Category removed successfully', 'success');
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete category', 'error');
    }
  };

  const moveCategory = async (index, direction) => {
    const nextCategories = [...categories];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= nextCategories.length) return;

    // Swap items locally
    const temp = nextCategories[index];
    nextCategories[index] = nextCategories[targetIndex];
    nextCategories[targetIndex] = temp;

    setCategories(nextCategories);

    try {
      const ids = nextCategories.map((c) => c._id);
      await api.put('/categories/reorder', { categoryIds: ids });
      showToast('Category sort order updated', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save categories sorting order', 'error');
      // Roll back
      fetchCategories();
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header and CTA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
            Category Management
          </h2>
          <p className="text-sm text-textmuted">
            Manage your medical products catalog categories and order hierarchy.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-mid to-accent text-white font-semibold shadow-lg shadow-mid/30 hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Category</span>
        </button>
      </div>

      {/* Grid view of Categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-44 rounded-3xl bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6">
              <div className="h-5 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-4"></div>
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
              <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[#d0e8f5]/40 dark:border-slate-800 bg-white/40 dark:bg-[#0e2238]/40 backdrop-blur">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581a1.125 1.125 0 001.591 0l7.1-7.1a1.125 1.125 0 000-1.591L12.35 3.659A1.875 1.875 0 0011.018 3H9.568z" />
          </svg>
          <h3 className="text-lg font-bold">No Categories Found</h3>
          <p className="text-sm text-textmuted mt-1">Get started by creating your first product category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => {
            const statusColor = cat.status === 'Active'
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-rose-500/10 text-rose-500';
            return (
              <div
                key={cat._id}
                className="group relative rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-[#0077B6]/5 hover:border-[#0077B6]/20 transition duration-300"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="min-w-0">
                      <h4 className="text-lg font-extrabold font-display text-slate-800 dark:text-white group-hover:text-mid dark:group-hover:text-accent transition duration-200 truncate">
                        {cat.name}
                      </h4>
                      {cat.parent && (
                        <p className="text-[11px] text-[#00B4D8] font-bold mt-0.5">
                          Subcategory of: {cat.parent.name || cat.parent}
                        </p>
                      )}
                      <p className="text-[10px] text-textmuted font-mono truncate mt-0.5">
                        slug: {cat.slug || cat.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                      </p>
                    </div>
                    
                    {/* Cover thumbnail */}
                    <img
                      src={cat.image ? `${BACKEND_URL}${cat.image}` : '/logo.png'}
                      alt={cat.name}
                      onError={(e) => { e.target.src = '/logo.png'; }}
                      className="w-10 h-10 rounded-xl object-cover border border-[#d0e8f5]/40 dark:border-slate-800 bg-white"
                    />
                  </div>

                  <div className="flex gap-2 items-center mb-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${statusColor}`}>
                      {cat.status || 'Active'}
                    </span>
                    <span className="text-[10px] text-textmuted font-semibold uppercase tracking-wider">
                      Order: {cat.order || 0}
                    </span>
                  </div>

                  <p className="text-sm text-textmuted leading-relaxed line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                  {/* Sorting Swap Triggers */}
                  <div className="flex gap-1.5">
                    <button
                      disabled={index === 0}
                      onClick={() => moveCategory(index, -1)}
                      className="p-1.5 rounded-lg border border-[#d0e8f5]/40 dark:border-slate-850 bg-white dark:bg-[#0c1a30]/50 hover:bg-slate-50 dark:hover:bg-[#0e2238] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      disabled={index === categories.length - 1}
                      onClick={() => moveCategory(index, 1)}
                      className="p-1.5 rounded-lg border border-[#d0e8f5]/40 dark:border-slate-850 bg-white dark:bg-[#0c1a30]/50 hover:bg-slate-50 dark:hover:bg-[#0e2238] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-mid/20 bg-mid/5 hover:bg-mid text-mid hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.062a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              
              {/* Category Name & Slug */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Surgical C-Arms"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="surgical-c-arms"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Parent Category Select */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Parent Category (Optional - select to make this a Subcategory)
                </label>
                <select
                  value={parent}
                  onChange={(e) => setParent(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="">None (Main Category)</option>
                  {categories
                    .filter((c) => !c.parent && (!editingCategory || c._id !== editingCategory._id))
                    .map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Publish Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-accent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  placeholder="Summarize product listings included in this category folder..."
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Category Image
                </label>
                <div className="flex gap-4 items-center">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Category Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-white"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-xs text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-xl file:border-0
                      file:text-xs file:font-semibold
                      file:bg-mid/10 file:text-mid
                      hover:file:bg-mid/20 cursor-pointer"
                  />
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
                  className="px-5 py-2 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer"
                >
                  Save Category
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

