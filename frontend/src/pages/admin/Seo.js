import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';
import { BACKEND_URL } from '../../config';

export default function Seo() {
  const { showToast } = useAdminAuth();
  
  // SEO Pages static configurations list
  const staticPages = [
    { name: 'Home', slug: '/' },
    { name: 'About', slug: '/about' },
    { name: 'Products', slug: '/products' },
    { name: 'Blogs', slug: '/blogs' },
    { name: 'Contact', slug: '/contact' },
    { name: 'Career', slug: '/career' },
  ];

  const [seoConfigs, setSeoConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit controls
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    pageName: '',
    slug: '',
    metaTitle: '',
    metaDescription: '',
  });
  const [ogImageFile, setOgImageFile] = useState(null);
  const [ogImagePreview, setOgImagePreview] = useState(null);

  const fetchSeoConfigs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/seo');
      setSeoConfigs(res.data.seoConfigs || []);
    } catch (err) {
      console.error('Error fetching SEO configurations:', err);
      showToast('Error loading SEO configs catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoConfigs();
    // eslint-disable-next-line
  }, []);

  const openEditModal = (page) => {
    setSelectedPage(page);
    
    // Find if database configuration already exists
    const match = seoConfigs.find(config => config.pageName === page.name);
    
    setFormData({
      pageName: page.name,
      slug: page.slug,
      metaTitle: match ? match.metaTitle : '',
      metaDescription: match ? match.metaDescription : '',
    });
    
    setOgImageFile(null);
    setOgImagePreview(match && match.ogImage ? `${BACKEND_URL}${match.ogImage}` : null);
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOgImageFile(file);
      setOgImagePreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.metaTitle || !formData.metaDescription) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const payload = new FormData();
    payload.append('pageName', formData.pageName);
    payload.append('slug', formData.slug);
    payload.append('metaTitle', formData.metaTitle);
    payload.append('metaDescription', formData.metaDescription);
    if (ogImageFile) {
      payload.append('ogImage', ogImageFile);
    }

    try {
      const res = await api.post('/seo', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        showToast(`SEO tags for "${formData.pageName}" saved successfully`, 'success');
        fetchSeoConfigs();
        setModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save SEO meta', 'error');
    }
  };

  const getPageConfigStatus = (pageName) => {
    const match = seoConfigs.find(config => config.pageName === pageName);
    return match ? (
      <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        Configured
      </span>
    ) : (
      <span className="text-[10px] bg-amber-500/10 text-amber-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
        Default
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          SEO Management
        </h2>
        <p className="text-sm text-textmuted">
          Configure search engine metadata, URL paths, and social sharing Open Graph cards for static frontend pages.
        </p>
      </div>

      {/* Pages list */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-10 text-center flex flex-col justify-center items-center">
            <div className="w-8 h-8 border-2 border-mid border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">Page Name</th>
                  <th className="p-5">Target Slug Path</th>
                  <th className="p-5">Configure Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                {staticPages.map((page) => {
                  const dbMatch = seoConfigs.find(c => c.pageName === page.name);
                  return (
                    <tr key={page.name} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                      <td className="p-5 font-bold text-slate-800 dark:text-white">
                        {page.name} Page
                      </td>
                      <td className="p-5 font-mono text-xs text-slate-500 dark:text-slate-400">
                        {page.slug}
                      </td>
                      <td className="p-5">
                        {getPageConfigStatus(page.name)}
                      </td>
                      <td className="p-5 text-center">
                        <button
                          onClick={() => openEditModal(page)}
                          className="flex items-center gap-1.5 px-3 py-1.5 border border-mid/20 bg-mid/5 hover:bg-mid text-mid hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer mx-auto"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.062a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                          <span>{dbMatch ? 'Configure' : 'Setup'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SEO Configuration Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                SEO Settings: {formData.pageName} Page
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

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
              
              {/* Slug (Read only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Page Route Slug
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.slug}
                  className="w-full bg-slate-100/70 dark:bg-slate-900/60 border border-[#d0e8f5]/20 dark:border-slate-850 rounded-xl py-2 px-3 text-sm focus:outline-none text-slate-400 font-mono"
                />
              </div>

              {/* Meta Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Meta Title *
                </label>
                <input
                  type="text"
                  required
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleInputChange}
                  placeholder="e.g. Poiya Healthcare | Premium Diagnostic Solutions"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
                />
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Meta Description *
                </label>
                <textarea
                  required
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Summarize page content for search snippet lists..."
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent text-xs"
                />
              </div>

              {/* Open Graph Image */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Social Sharing Image (Open Graph Image)
                </label>
                <div className="flex gap-4 items-center">
                  {ogImagePreview && (
                    <img
                      src={ogImagePreview}
                      alt="OG Preview"
                      className="w-16 h-12 rounded-lg object-cover border border-slate-200 bg-white"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
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
                  Save SEO Meta
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
