import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';

export default function Messages() {
  const { showToast } = useAdminAuth();

  // Inbox states
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/messages');
      const data = res.data.messages || [];
      setMessages(data);
      if (data.length > 0 && !selectedMessage) {
        setSelectedMessage(data[0]);
      }
    } catch (err) {
      console.error('Error fetching messages inbox:', err);
      showToast('Error loading messages database', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, []);

  const handleMarkContacted = async (msgId, currentContactedState) => {
    try {
      const res = await api.put(`/messages/${msgId}/contacted`, { isContacted: !currentContactedState });
      if (res.data.success) {
        showToast(
          `Inquiry marked as ${!currentContactedState ? 'Contacted' : 'Pending'}`,
          'success'
        );
        
        // Update local list
        setMessages((prev) =>
          prev.map((m) => (m._id === msgId ? { ...m, isContacted: !currentContactedState, isRead: !currentContactedState } : m))
        );

        // Update selected message if applicable
        if (selectedMessage && selectedMessage._id === msgId) {
          setSelectedMessage((prev) => ({ ...prev, isContacted: !currentContactedState, isRead: !currentContactedState }));
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to change contacted status', 'error');
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm('Are you sure you want to delete this message submission?')) {
      return;
    }

    try {
      const res = await api.delete(`/messages/${msgId}`);
      if (res.data.success) {
        showToast('Message removed successfully', 'success');
        
        const nextList = messages.filter((m) => m._id !== msgId);
        setMessages(nextList);

        if (selectedMessage && selectedMessage._id === msgId) {
          setSelectedMessage(nextList.length > 0 ? nextList[0] : null);
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to delete message', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header title */}
      <div>
        <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
          Contact &amp; Product Inquiries
        </h2>
        <p className="text-sm text-textmuted">
          Review quotation proposals, clinic queries, and user partnership form submissions.
        </p>
      </div>

      {loading ? (
        /* Inbox loader skeleton */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-1 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-2xl p-4">
                <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-3 w-3/4 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 h-96 bg-white/40 dark:bg-[#0e2238]/40 border border-[#d0e8f5]/40 dark:border-slate-800/40 rounded-3xl p-6"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="p-12 text-center rounded-3xl border border-[#d0e8f5]/40 dark:border-slate-800 bg-white/40 dark:bg-[#0e2238]/40 backdrop-blur">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <h3 className="text-lg font-bold">Inbox Empty</h3>
          <p className="text-sm text-textmuted mt-1">No customer inquiries have been submitted yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Messages Left sidebar stack */}
          <div className="lg:col-span-1 space-y-3.5 max-h-[70vh] overflow-y-auto pr-1">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => setSelectedMessage(msg)}
                className={`p-4 rounded-2xl border transition duration-200 cursor-pointer text-left relative ${
                  selectedMessage?._id === msg._id
                    ? 'bg-mid/10 dark:bg-accent/15 border-mid/30 dark:border-accent/30 text-slate-800 dark:text-white'
                    : msg.isContacted
                    ? 'bg-white/50 dark:bg-[#0e2238]/30 border-[#d0e8f5]/40 dark:border-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#0e2238]/50'
                    : 'bg-white border-[#00B4D8]/30 dark:bg-[#0e2238]/70 dark:border-[#00B4D8]/30 font-semibold text-slate-800 dark:text-white shadow-sm shadow-[#00B4D8]/5'
                }`}
              >
                {!msg.isContacted && (
                  <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                )}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded text-slate-500">
                    {msg.name?.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-textmuted">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-semibold truncate leading-snug">
                  {msg.product ? `Quote: ${msg.product}` : msg.subject}
                </h4>
                <p className="text-xs text-textmuted truncate mt-1">{msg.message}</p>
              </div>
            ))}
          </div>

          {/* Messages Right Details expanded view */}
          <div className="lg:col-span-2 rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 p-6 flex flex-col justify-between shadow-xl">
            {selectedMessage ? (
              <div className="space-y-6 text-left">
                
                {/* Meta details Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#d0e8f5]/40 dark:border-slate-800/40 pb-5">
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white leading-tight">
                      {selectedMessage.product ? `Quotation Request: ${selectedMessage.product}` : selectedMessage.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-3 text-xs text-textmuted">
                      <span>Sender: <strong className="text-slate-700 dark:text-slate-300 font-bold">{selectedMessage.name}</strong></span>
                      <span>•</span>
                      <span>Email: <strong className="text-slate-700 dark:text-slate-300 font-bold">{selectedMessage.email}</strong></span>
                      {selectedMessage.phone && (
                        <>
                          <span>•</span>
                          <span>Phone: <strong className="text-slate-700 dark:text-slate-300 font-bold">{selectedMessage.phone}</strong></span>
                        </>
                      )}
                      <span>•</span>
                      <span>Date: {new Date(selectedMessage.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {/* contacted status badge */}
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedMessage.isContacted
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-amber-500/10 text-amber-500'
                  }`}>
                    {selectedMessage.isContacted ? 'Contacted' : 'Pending Review'}
                  </span>
                </div>

                {/* Message text body */}
                <div className="p-5 rounded-2xl bg-slate-100/30 dark:bg-slate-900/10 border border-[#d0e8f5]/20 dark:border-slate-800/30 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap min-h-[160px]">
                  {selectedMessage.message}
                </div>

                {/* Message footer actions */}
                <div className="flex flex-wrap justify-between items-center gap-3 border-t border-[#d0e8f5]/40 dark:border-slate-800/40 pt-4">
                  
                  {/* Mark as read toggle */}
                  <button
                    onClick={() => handleMarkContacted(selectedMessage._id, selectedMessage.isContacted)}
                    className={`flex items-center gap-1.5 px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                      selectedMessage.isContacted
                        ? 'border-slate-300 text-slate-500 hover:text-slate-800 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                        : 'border-[#0077B6]/20 bg-[#0077B6]/5 hover:bg-[#0077B6] text-[#0077B6] hover:text-white dark:border-[#00B4D8]/20 dark:bg-[#00B4D8]/5 dark:hover:bg-accent dark:text-[#00B4D8] dark:hover:text-white'
                    }`}
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedMessage.isContacted ? 'Mark as Pending' : 'Mark as Contacted'}</span>
                  </button>

                  {/* Delete action */}
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    <span>Delete Submission</span>
                  </button>

                </div>
              </div>
            ) : (
              <div className="p-12 text-center text-textmuted text-sm">
                No message selected
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
