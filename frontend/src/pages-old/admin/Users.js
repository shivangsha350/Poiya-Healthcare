import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';

export default function Users() {
  const { showToast } = useAdminAuth();

  // Users lists
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Queries
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?search=${search}`);
      setUsers(res.data.users || []);
    } catch (err) {
      console.error('Error fetching users database:', err);
      showToast('Error loading user accounts', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    try {
      const res = await api.put(`/users/${userId}/status`, { status: nextStatus });
      if (res.data.success) {
        showToast(`User status updated to ${nextStatus}`, 'success');
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
        );
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update account status', 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? All associated customer profile files will be removed.')) {
      return;
    }

    try {
      const res = await api.delete(`/users/${userId}`);
      if (res.data.success) {
        showToast('User account deleted successfully', 'success');
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete user account', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          User Account Management
        </h2>
        <p className="text-sm text-textmuted">
          Inspect registered customer profiles, monitor access logs, and toggle block listings.
        </p>
      </div>

      {/* Control bar */}
      <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user name or email..."
              className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            Find
          </button>
        </form>

        <span className="text-xs text-textmuted font-bold tracking-wider uppercase">
          Total Customers: {users.length} Active
        </span>

      </div>

      {/* Users Data Table */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl shadow-slate-100/20 dark:shadow-none">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-5 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <h3 className="text-lg font-bold">No Users Found</h3>
            <p className="text-sm text-textmuted mt-1">No customer profiles match the current filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">User profile</th>
                  <th className="p-5">Email Address</th>
                  <th className="p-5 text-center">Date Joined</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* User profile initials avatar & name */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-mid to-accent text-white font-bold flex items-center justify-center shadow-sm uppercase">
                          {user.name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-slate-800 dark:text-white">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="p-5 text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>

                    {/* Date Joined */}
                    <td className="p-5 text-center text-xs text-textmuted">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Status Toggle slider / button */}
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleToggleStatus(user._id, user.status)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'
                            : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        <span>{user.status === 'active' ? 'Active' : 'Blocked'}</span>
                      </button>
                    </td>

                    {/* Actions (Delete) */}
                    <td className="p-5 text-center">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-1.5 rounded-lg border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white transition duration-200 cursor-pointer"
                        title="Delete User"
                      >
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
