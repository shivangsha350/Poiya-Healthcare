import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';

export default function Media() {
  const { showToast } = useAdminAuth();
  
  // Media states
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter queries
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState('all');

  // Multi file uploads helper
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/media?search=${search}&fileType=${fileType}`);
      setMediaItems(res.data.media || []);
    } catch (err) {
      console.error('Error fetching media list:', err);
      showToast('Error loading media assets catalog', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
    // eslint-disable-next-line
  }, [fileType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchMedia();
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      showToast('Please select at least one file to upload', 'error');
      return;
    }

    setUploading(true);
    const payload = new FormData();
    selectedFiles.forEach((file) => {
      payload.append('files', file);
    });

    try {
      const res = await api.post('/media', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        showToast(`Successfully uploaded ${selectedFiles.length} file(s)`, 'success');
        setSelectedFiles([]);
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to upload files', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media file? It will be permanently removed from disk.')) {
      return;
    }

    try {
      const res = await api.delete(`/media/${id}`);
      if (res.data.success) {
        showToast('Media file removed successfully', 'success');
        fetchMedia();
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete media asset', 'error');
    }
  };

  const copyToClipboard = (url) => {
    const fullUrl = `${url}`;
    navigator.clipboard.writeText(fullUrl);
    showToast(`Copied path: "${fullUrl}" to clipboard!`, 'info');
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Info */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          Media Manager
        </h2>
        <p className="text-sm text-textmuted">
          Upload and store product brochures, manuals, technical catalog sheets, and website photos.
        </p>
      </div>

      {/* Central upload drop card & filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column - Multi-File Uploader Box */}
        <div className="lg:col-span-1 rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 shadow-xl space-y-4">
          <h3 className="text-md font-bold font-display text-slate-800 dark:text-white">
            Upload Assets
          </h3>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-[#d0e8f5] dark:border-slate-700 rounded-2xl p-6 text-center hover:border-accent transition duration-200 bg-slate-50/50 dark:bg-slate-900/10 cursor-pointer relative group">
              <input
                type="file"
                multiple
                accept="image/*,application/pdf"
                onChange={handleFileSelection}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="space-y-2">
                <span className="text-3xl block">📁</span>
                <span className="text-xs font-bold text-slate-500 group-hover:text-mid transition">
                  Click to select files
                </span>
                <span className="block text-[10px] text-textmuted">
                  Images (PNG, JPG, WEBP) &amp; PDFs. Max 10MB limit.
                </span>
              </div>
            </div>

            {/* Selected files preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Selected Files ({selectedFiles.length}):
                </span>
                <div className="max-h-28 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/45 text-xs text-slate-700 dark:text-slate-300">
                  {selectedFiles.map((file, i) => (
                    <div key={i} className="py-1.5 flex justify-between items-center">
                      <span className="truncate max-w-[200px] font-medium">{file.name}</span>
                      <span className="text-[10px] text-textmuted shrink-0">{formatBytes(file.size)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || selectedFiles.length === 0}
              className="w-full bg-cta text-white py-2.5 rounded-xl font-bold text-sm hover:bg-ctadark disabled:opacity-50 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5h10.5a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0017.25 4.5H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span>Upload to Library</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Columns - Grid view of Library */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Controls - Search and filter */}
          <div className="p-4 rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 flex flex-col sm:flex-row gap-4 items-center justify-between shadow">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs flex gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search file names..."
                className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent"
              />
              <button type="submit" className="px-3.5 py-2 bg-mid text-white text-xs font-bold rounded-xl hover:opacity-95 transition cursor-pointer">
                Find
              </button>
            </form>

            <div className="flex gap-2">
              <button
                onClick={() => setFileType('all')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  fileType === 'all'
                    ? 'bg-mid text-white border-mid'
                    : 'bg-white border-[#d0e8f5]/40 text-slate-500 hover:border-slate-350 dark:bg-[#0c1a30]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFileType('image')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  fileType === 'image'
                    ? 'bg-mid text-white border-mid'
                    : 'bg-white border-[#d0e8f5]/40 text-slate-500 hover:border-slate-350 dark:bg-[#0c1a30]'
                }`}
              >
                Images
              </button>
              <button
                onClick={() => setFileType('pdf')}
                className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition cursor-pointer ${
                  fileType === 'pdf'
                    ? 'bg-mid text-white border-mid'
                    : 'bg-white border-[#d0e8f5]/40 text-slate-500 hover:border-slate-350 dark:bg-[#0c1a30]'
                }`}
              >
                PDFs
              </button>
            </div>
          </div>

          {/* Grid display */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-44 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-2xl"></div>
              ))}
            </div>
          ) : mediaItems.length === 0 ? (
            <div className="p-12 text-center rounded-3xl border border-[#d0e8f5]/40 bg-white/40 dark:bg-[#0e2238]/40">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <h3 className="text-lg font-bold">No Media Files</h3>
              <p className="text-sm text-textmuted mt-1">Upload files on the left to add them to your local database catalog.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mediaItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative bg-white dark:bg-[#0e2238]/60 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-md flex flex-col justify-between hover:shadow-xl hover:border-mid/30 transition duration-300"
                >
                  {/* File preview */}
                  <div className="w-full aspect-[4/3] bg-slate-50 dark:bg-slate-900/10 flex items-center justify-center overflow-hidden border-b border-[#d0e8f5]/30 dark:border-slate-850">
                    {item.fileType === 'image' ? (
                      <img
                        src={`http://localhost:5000${item.url}`}
                        alt={item.filename}
                        className="max-h-full max-w-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center space-y-1 p-2">
                        <span className="text-4xl block">🔴</span>
                        <span className="text-[10px] bg-rose-500/10 text-rose-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                          PDF Doc
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Metadata & actions */}
                  <div className="p-3 text-left space-y-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-white truncate" title={item.filename}>
                      {item.filename}
                    </p>
                    <p className="text-[10px] text-textmuted">
                      Size: {formatBytes(item.size)}
                    </p>
                    
                    <div className="flex gap-1.5 pt-1.5 border-t border-slate-100 dark:border-slate-800/30">
                      <button
                        onClick={() => copyToClipboard(item.url)}
                        className="flex-1 py-1 px-2 border border-mid/20 bg-mid/5 hover:bg-mid text-mid hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition cursor-pointer text-center"
                      >
                        Copy URL
                      </button>
                      <button
                        onClick={() => handleDeleteMedia(item._id)}
                        className="py-1 px-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-lg text-[10px] font-bold transition cursor-pointer"
                        title="Delete Asset"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
