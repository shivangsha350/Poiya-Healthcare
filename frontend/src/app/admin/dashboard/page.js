"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '../../../context/AdminAuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalProducts: 0,
    totalInquiries: 0,
    totalApplications: 0,
    newApplications: 0,
    shortlistedCandidates: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await api.get('/dashboard/stats');
        if (res.data.success) {
          setStats(res.data.stats || {
            totalCategories: 0,
            totalProducts: 0,
            totalInquiries: 0,
            totalApplications: 0,
            newApplications: 0,
            shortlistedCandidates: 0,
          });
          setActivities(res.data.recentActivities || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-3xl bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-3xl p-6"></div>
          <div className="h-80 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-3xl p-6"></div>
        </div>
      </div>
    );
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'product': return '📦';
      case 'category': return '📁';
      case 'application': return '🧑‍💼';
      case 'inquiry': return '✉️';
      default: return '⚙️';
    }
  };

  const getActivityBadgeColor = (type) => {
    switch (type) {
      case 'product': return 'bg-blue-500/10 text-blue-500';
      case 'category': return 'bg-emerald-500/10 text-emerald-500';
      case 'application': return 'bg-purple-500/10 text-purple-500';
      case 'inquiry': return 'bg-amber-500/10 text-amber-500';
      default: return 'bg-slate-500/10 text-slate-500';
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn text-left">

      {/* Welcome Banner */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          Poiya Healthcare Operations Dashboard
        </h2>
        <p className="text-sm text-textmuted">
          Dynamic content management and inquiry database logs.
        </p>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total Categories Card */}
        <div className="group relative rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 hover:shadow-xl hover:border-[#0077B6]/20 transition duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Categories
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20 dark:text-emerald-300 flex items-center justify-center font-bold">
              📁
            </div>
          </div>
          <h3 className="text-3xl font-black font-display text-emerald-500 dark:text-emerald-400">
            {stats.totalCategories}
          </h3>
          <p className="text-xs text-textmuted mt-2">Active product categories</p>
        </div>

        {/* Total Products Card */}
        <div className="group relative rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 hover:shadow-xl hover:border-[#0077B6]/20 transition duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Products
            </span>
            <div className="w-10 h-10 rounded-xl bg-mid/10 text-mid dark:bg-mid/20 dark:text-[#90E0EF] flex items-center justify-center">
              📦
            </div>
          </div>
          <h3 className="text-3xl font-black font-display text-mid dark:text-white">
            {stats.totalProducts}
          </h3>
          <p className="text-xs text-textmuted mt-2">Registered equipment systems</p>
        </div>

        {/* Total Inquiries Card */}
        <div className="group relative rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 hover:shadow-xl hover:border-[#0077B6]/20 transition duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Inquiries
            </span>
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent dark:bg-accent/20 dark:text-[#48CAE4] flex items-center justify-center">
              ✉️
            </div>
          </div>
          <h3 className="text-3xl font-black font-display text-[#0A2E52] dark:text-white">
            {stats.totalInquiries}
          </h3>
          <p className="text-xs text-textmuted mt-2">Quotations submitted</p>
        </div>

        {/* Total Applications Card */}
        <div className="group relative rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 hover:shadow-xl hover:border-[#0077B6]/20 transition duration-300">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total Applications
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-300 flex items-center justify-center">
              🧑‍💼
            </div>
          </div>
          <h3 className="text-3xl font-black font-display text-purple-500 dark:text-purple-400">
            {stats.totalApplications}
          </h3>
          <div className="flex gap-2.5 items-center mt-2 text-[10px] text-textmuted">
            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">{stats.newApplications} New</span>
            <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">{stats.shortlistedCandidates} Shortlisted</span>
          </div>
        </div>

      </div>

      {/* Custom Graphic Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Line Chart Card */}
        <div className="lg:col-span-2 rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 flex flex-col justify-between shadow-md">
          <div className="mb-4">
            <h4 className="text-md font-bold font-display text-slate-700 dark:text-slate-300">
              Inquiry Submission Trends
            </h4>
            <p className="text-xs text-textmuted">Chronological performance overview</p>
          </div>

          <div className="relative w-full h-56 mt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chart-stroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0077B6" />
                  <stop offset="50%" stopColor="#00B4D8" />
                  <stop offset="100%" stopColor="#48CAE4" />
                </linearGradient>
                <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00B4D8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0077B6" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="40" y1="20" x2="480" y2="20" stroke="currentColor" className="text-slate-100 dark:text-slate-850" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="currentColor" className="text-slate-100 dark:text-slate-850" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-850" strokeWidth="1" />

              <path
                d="M 40 140 Q 120 110 160 90 T 260 50 T 360 80 T 440 30 T 480 30 L 480 140 Z"
                fill="url(#chart-fill)"
              />
              <path
                d="M 40 140 Q 120 110 160 90 T 260 50 T 360 80 T 440 30 T 480 30"
                fill="none"
                stroke="url(#chart-stroke)"
                strokeWidth="3"
                strokeLinecap="round"
              />

              <circle cx="160" cy="90" r="4" className="fill-accent stroke-white dark:stroke-[#071329]" strokeWidth="1.5" />
              <circle cx="260" cy="50" r="4" className="fill-[#0077B6] stroke-white dark:stroke-[#071329]" strokeWidth="1.5" />
              <circle cx="440" cy="30" r="4" className="fill-emerald-400 stroke-white dark:stroke-[#071329]" strokeWidth="1.5" />

              <text x="40" y="158" className="text-[9px] fill-textmuted" textAnchor="middle">Mar</text>
              <text x="150" y="158" className="text-[9px] fill-textmuted" textAnchor="middle">Apr</text>
              <text x="260" y="158" className="text-[9px] fill-textmuted" textAnchor="middle">May</text>
              <text x="370" y="158" className="text-[9px] fill-textmuted" textAnchor="middle">Jun</text>
              <text x="480" y="158" className="text-[9px] fill-textmuted" textAnchor="middle">Jul</text>
            </svg>
          </div>
        </div>

        {/* Quick actions Panel */}
        <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 flex flex-col justify-between shadow-md">
          <div>
            <h4 className="text-md font-bold font-display text-slate-700 dark:text-slate-300 mb-1">
              CMS Operations
            </h4>
            <p className="text-xs text-textmuted mb-4">Quick shortcuts to write or view listings.</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <Link href="/admin/products" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-mid/30 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-[#0c1a30]/30 transition text-xs font-semibold text-primary">
              <span>Catalog Products</span>
              <span>→</span>
            </Link>
            <Link href="/admin/applications" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-mid/30 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-[#0c1a30]/30 transition text-xs font-semibold text-primary">
              <span>Manage Applications</span>
              <span>→</span>
            </Link>
            <Link href="/admin/media" className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-mid/30 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-850 dark:hover:bg-[#0c1a30]/30 transition text-xs font-semibold text-primary">
              <span>Media Library Manager</span>
              <span>→</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Bottom Activities & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Activities List */}
        <div className="lg:col-span-2 rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 shadow-md">
          <div className="border-b border-slate-100 dark:border-slate-800/40 pb-4 mb-4">
            <h4 className="text-md font-bold font-display text-slate-700 dark:text-slate-300">
              Recent Activity Feed
            </h4>
            <p className="text-xs text-textmuted">Real-time CMS audit trace of updates.</p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-850 max-h-[360px] overflow-y-auto pr-1">
            {activities.length === 0 ? (
              <p className="text-sm text-textmuted py-8 text-center">No recent activities log generated yet.</p>
            ) : (
              activities.map((act, i) => (
                <div key={i} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0">
                  <div className="flex gap-3 items-center min-w-0">
                    <span className="text-xl p-1 bg-slate-50 dark:bg-[#0c1a30]/80 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm shrink-0">
                      {getActivityIcon(act.type)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-850 dark:text-white truncate">
                        {act.title}
                      </p>
                      <p className="text-xs text-textmuted truncate mt-0.5">{act.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getActivityBadgeColor(act.type)}`}>
                      {act.type}
                    </span>
                    <p className="text-[10px] text-textmuted mt-1">
                      {new Date(act.time).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats Summary */}
        <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 shadow-md flex flex-col justify-between">
          <div className="border-b border-slate-100 dark:border-slate-800/40 pb-4 mb-4">
            <h4 className="text-md font-bold font-display text-slate-700 dark:text-slate-300">
              Inquiry Logs inbox
            </h4>
            <p className="text-xs text-textmuted">Quotations check list shortcut.</p>
          </div>

          <div className="space-y-4 flex-1 flex flex-col justify-center text-center p-4">
            <span className="text-4xl block">📩</span>
            <div>
              <h5 className="font-extrabold text-primary text-sm">Need to contact client?</h5>
              <p className="text-xs text-textmuted mt-1 leading-relaxed">You have got {stats.totalInquiries} total inquiry submissions in the inbox list.</p>
            </div>
            <Link href="/admin/messages" className="bg-mid hover:opacity-95 text-white py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer inline-block mt-2">
              View Inquiries
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}

