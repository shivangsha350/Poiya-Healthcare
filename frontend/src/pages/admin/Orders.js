import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';
import { BACKEND_URL } from '../../config';

export default function Orders() {
  const { showToast } = useAdminAuth();

  // Orders states
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Query
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Detail Overlay modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?status=${selectedStatus}&search=${search}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showToast('Error loading orders database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data.success) {
        showToast(`Order status updated to ${newStatus}`, 'success');
        
        // Update local list
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? res.data.order : o))
        );

        // If updated order is currently selected in modal, sync it
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.data.order);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to update order status', 'error');
    }
  };

  const openDetailsModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  // Format currency helper
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const badgeColors = {
    Pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    Processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    Shipped: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    Delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    Cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          Order Management
        </h2>
        <p className="text-sm text-textmuted">
          Review customer billing invoices, verify details, and adjust logistics shipping statuses.
        </p>
      </div>

      {/* Control bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md flex gap-2">
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
              placeholder="Search by Order ID, Name, or Email..."
              className="w-full bg-white/70 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer"
          >
            Find
          </button>
        </form>

        {/* Status Tabs Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900/40 border border-[#d0e8f5]/30 dark:border-slate-800/50 rounded-2xl overflow-x-auto w-full lg:w-auto shrink-0">
          {['All', ...statusOptions].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                selectedStatus === status
                  ? 'bg-white dark:bg-[#0c1a30] text-[#0077B6] dark:text-accent shadow-sm border border-[#d0e8f5]/30 dark:border-slate-800/30'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* Orders list table */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl shadow-slate-100/20 dark:shadow-none">
        {loading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-5 animate-pulse">
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
                </div>
                <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.116 60.116 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <h3 className="text-lg font-bold">No Orders Found</h3>
            <p className="text-sm text-textmuted mt-1">Try toggling filter criteria tab parameters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">Order ID / Date</th>
                  <th className="p-5">Customer info</th>
                  <th className="p-5 text-right">Invoice Pricing</th>
                  <th className="p-5 text-center">Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    
                    {/* ID / Date */}
                    <td className="p-5">
                      <span className="font-mono text-xs font-bold text-mid dark:text-accent">
                        #{order._id.substring(order._id.length - 8).toUpperCase()}
                      </span>
                      <p className="text-xs text-textmuted mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="p-5">
                      <p className="font-semibold text-slate-800 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-textmuted">{order.customerEmail}</p>
                    </td>

                    {/* Amount */}
                    <td className="p-5 text-right font-bold text-slate-800 dark:text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>

                    {/* Status Select dropdown directly in row */}
                    <td className="p-5 text-center">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1.5 rounded-xl border focus:outline-none font-display uppercase tracking-wider ${
                          badgeColors[order.status] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st} className="bg-white dark:bg-[#071329] text-slate-800 dark:text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Details modal trigger */}
                    <td className="p-5 text-center">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="px-4 py-2 border border-accent/20 bg-accent/5 hover:bg-accent text-accent hover:text-white font-semibold text-xs rounded-xl transition duration-200 uppercase tracking-wider cursor-pointer"
                      >
                        Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order details overlay modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-accent font-mono uppercase tracking-widest">
                  Order Invoicing Details
                </span>
                <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white mt-1">
                  ID: #{selectedOrder._id.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Details body */}
            <div className="space-y-6">
              
              {/* Customer summary */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-100/30 dark:bg-slate-900/10 border border-[#d0e8f5]/20 dark:border-slate-800/30 text-sm">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Client Details
                  </p>
                  <p className="font-semibold">{selectedOrder.customerName}</p>
                  <p className="text-xs text-textmuted mt-0.5">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Order Logistics
                  </p>
                  <p className="text-xs">
                    Placed: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none uppercase tracking-wider ${
                        badgeColors[selectedOrder.status] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st} className="bg-white dark:bg-[#071329] text-slate-800 dark:text-white">
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Itemized list of products */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Itemized Order List
                </h4>
                <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2">
                  {selectedOrder.products.map((item, idx) => {
                    const prod = item.product || {};
                    return (
                      <div
                        key={prod._id || idx}
                        className="flex justify-between items-center p-3 border border-[#d0e8f5]/20 dark:border-slate-800/30 rounded-2xl bg-white/40 dark:bg-slate-900/10 text-sm"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={prod.image ? `${BACKEND_URL}${prod.image}` : '/uploads/default-product.png'}
                            alt={prod.name}
                            onError={(e) => { e.target.src = '/logo.png'; }}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800 bg-white"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold truncate text-slate-800 dark:text-white">
                              {prod.name || 'Deleted Product'}
                            </p>
                            <p className="text-xs text-textmuted">
                              {formatCurrency(prod.price || 0)} × {item.quantity}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">
                          {formatCurrency((prod.price || 0) * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Invoice Pricing Totals */}
              <div className="flex justify-between items-center pt-4 border-t border-[#d0e8f5]/40 dark:border-slate-800/40">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Total Amount Due:
                </span>
                <span className="text-xl font-black font-display text-emerald-500">
                  {formatCurrency(selectedOrder.totalAmount)}
                </span>
              </div>

              {/* Close action */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800/80 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                >
                  Close Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
