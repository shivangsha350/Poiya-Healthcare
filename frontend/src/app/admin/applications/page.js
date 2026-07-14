"use client";
import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../../context/AdminAuthContext';
import { BACKEND_URL } from '../../../config';

export default function Applications() {
  const { showToast } = useAdminAuth();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Modals
  const [selectedApp, setSelectedApp] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/applications?search=${search}&status=${statusFilter}`);
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      showToast('Error loading applications list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    // eslint-disable-next-line
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await api.patch(`/admin/applications/${appId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Application status updated to ${newStatus}`, 'success');
        
        // Update local list
        setApplications(prev => 
          prev.map(app => app._id === appId ? { ...app, status: newStatus } : app)
        );

        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const handleDeleteApp = async (appId, applicantName) => {
    if (!window.confirm(`Are you sure you want to delete ${applicantName}'s application? This action is permanent.`)) {
      return;
    }

    try {
      const res = await api.delete(`/admin/applications/${appId}`);
      if (res.data.success) {
        showToast('Application deleted successfully', 'success');
        setApplications(prev => prev.filter(app => app._id !== appId));
        if (selectedApp && selectedApp._id === appId) {
          setSelectedApp(null);
          setDetailModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete application', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/10 text-amber-500 border border-amber-500/20';
      case 'Reviewed':
        return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
      case 'Shortlisted':
        return 'bg-purple-500/10 text-purple-500 border border-purple-500/20';
      case 'Interview Scheduled':
        return 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20';
      case 'Selected':
        return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-500 border border-rose-500/20';
      default:
        return 'bg-slate-500/10 text-slate-500 border border-slate-500/20';
    }
  };

  const openDetailModal = (app) => {
    setSelectedApp(app);
    setDetailModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white text-left">
          Job Applications Manager
        </h2>
        <p className="text-sm text-textmuted text-left">
          View candidate details, check resumes, schedule interviews, and manage application pipelines.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 items-center justify-between shadow">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, position..."
            className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:border-accent dark:text-white"
          />
          <button type="submit" className="px-4 py-2.5 bg-mid text-white text-sm font-semibold rounded-xl hover:opacity-95 transition cursor-pointer shrink-0">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Status Filter:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-48 bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 px-3.5 text-sm focus:outline-none focus:border-accent dark:text-white"
          >
            <option value="all">All Applications</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Interview Scheduled">Interview Scheduled</option>
            <option value="Selected">Selected</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications list table */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-5">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <div className="text-4xl mb-3">🧑‍💼</div>
            <h3 className="text-lg font-bold">No Applications Registered</h3>
            <p className="text-sm text-textmuted mt-1">No candidate forms fit the current filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">Applicant Details</th>
                  <th className="p-5">Applied Position</th>
                  <th className="p-5">Experience</th>
                  <th className="p-5">Applied Date</th>
                  <th className="p-5">Status Pipeline</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* Applicant details */}
                    <td className="p-5">
                      <div className="text-left">
                        <p className="font-semibold text-slate-800 dark:text-white">{app.name}</p>
                        <p className="text-xs text-textmuted mt-0.5">{app.email}</p>
                        <p className="text-xs text-textmuted mt-0.5">{app.phone}</p>
                        {app.location && <p className="text-[10px] text-accent mt-0.5">📍 {app.location}</p>}
                      </div>
                    </td>

                    {/* Applied Position */}
                    <td className="p-5 text-slate-800 dark:text-white font-medium text-left">
                      {app.appliedPosition}
                    </td>

                    {/* Experience */}
                    <td className="p-5 text-slate-650 dark:text-slate-350 font-medium text-left">
                      {app.experience || 'Not Specified'}
                    </td>

                    {/* Applied Date */}
                    <td className="p-5 text-slate-600 dark:text-slate-300 text-left">
                      {new Date(app.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-5 text-left">
                      <div className="flex flex-col gap-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-center max-w-[140px] ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app._id, e.target.value)}
                          className="bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-lg py-1 px-1.5 text-xs focus:outline-none focus:border-accent text-slate-700 dark:text-slate-300 w-full max-w-[150px]"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Reviewed">Reviewed</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-5">
                      <div className="flex items-center justify-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => openDetailModal(app)}
                          className="p-1.5 rounded-lg border border-mid/20 bg-mid/5 hover:bg-mid text-mid hover:text-white transition duration-200 cursor-pointer"
                          title="View Application Details"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.43 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </button>
                        {/* Resume Download */}
                        <a
                          href={`${BACKEND_URL}${app.resumeUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500 text-emerald-500 hover:text-white transition duration-200 flex items-center justify-center"
                          title="Download Resume PDF"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </a>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteApp(app._id, app.name)}
                          className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition duration-200 cursor-pointer"
                          title="Remove Application"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
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
      </div>

      {/* Details Modal */}
      {detailModalOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl text-left">
            
            {/* Modal Title */}
            <div className="flex justify-between items-center mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <h3 className="text-lg font-bold font-display text-slate-850 dark:text-white">
                Application Sheet
              </h3>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-650 dark:hover:text-white"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5">
              
              {/* Applicant Name Header details */}
              <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/40 p-4 rounded-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-mid to-accent flex items-center justify-center text-white font-extrabold text-lg uppercase shadow-md shadow-mid/20 shrink-0">
                  {selectedApp.name?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-850 dark:text-white text-md leading-tight">{selectedApp.name}</h4>
                  <p className="text-xs text-textmuted truncate mt-0.5">{selectedApp.email}</p>
                  <p className="text-xs text-textmuted mt-0.5">{selectedApp.phone}</p>
                </div>
              </div>

              {/* Grid Metadata */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Applied For</span>
                  <span className="font-semibold text-slate-850 dark:text-white bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-150/40 dark:border-slate-800/30 inline-block w-full">
                    💼 {selectedApp.appliedPosition}
                  </span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Experience</span>
                  <span className="font-semibold text-slate-850 dark:text-white bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-150/40 dark:border-slate-800/30 inline-block w-full">
                    🧑‍💼 {selectedApp.experience || 'Not Specified'}
                  </span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Location</span>
                  <span className="font-semibold text-slate-850 dark:text-white bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-150/40 dark:border-slate-800/30 inline-block w-full">
                    📍 {selectedApp.location || 'Not Specified'}
                  </span>
                </div>
                <div>
                  <span className="block font-bold uppercase tracking-wider text-slate-400 mb-1">Applied Date</span>
                  <span className="font-semibold text-slate-850 dark:text-white bg-slate-100/50 dark:bg-slate-900/40 px-3 py-1.5 rounded-xl border border-slate-150/40 dark:border-slate-800/30 inline-block w-full">
                    📅 {new Date(selectedApp.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Status Update block in details */}
              <div className="flex justify-between items-center gap-4 border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Current status</span>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusBadgeClass(selectedApp.status)}`}>
                    {selectedApp.status}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Change Status</span>
                  <select
                    value={selectedApp.status}
                    onChange={(e) => handleStatusChange(selectedApp._id, e.target.value)}
                    className="bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent text-slate-700 dark:text-slate-350"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Interview Scheduled">Interview Scheduled</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Cover Letter / Motivation */}
              <div className="space-y-1.5">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">Cover Letter / Motivation</span>
                <div className="p-4 rounded-2xl bg-slate-100/30 dark:bg-slate-900/10 border border-[#d0e8f5]/20 dark:border-slate-800/30 text-xs sm:text-sm leading-relaxed text-slate-750 dark:text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedApp.coverLetter || 'No cover letter was submitted.'}
                </div>
              </div>

              {/* Action buttons footer */}
              <div className="flex gap-3 justify-end border-t border-slate-100 dark:border-slate-800/50 pt-4">
                <button
                  onClick={() => handleDeleteApp(selectedApp._id, selectedApp.name)}
                  className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Delete Application
                </button>
                <a
                  href={`${BACKEND_URL}${selectedApp.resumeUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition inline-flex items-center gap-1.5"
                >
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  <span>Download Resume PDF</span>
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

