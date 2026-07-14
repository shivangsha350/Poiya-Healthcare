import React, { useState, useEffect } from 'react';
import { api, useAdminAuth } from '../../context/AdminAuthContext';

export default function Careers() {
  const { showToast } = useAdminAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null); // null means adding a new job

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    location: '',
    type: 'Full-Time',
    experience: '',
    description: '',
    requirements: '',
    status: 'Open'
  });

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/jobs/admin');
      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error('Error fetching admin jobs:', err);
      showToast('Error loading jobs list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const openAddModal = () => {
    setEditingJob(null);
    setFormData({
      title: '',
      department: '',
      location: '',
      type: 'Full-Time',
      experience: '',
      description: '',
      requirements: '',
      status: 'Open'
    });
    setModalOpen(true);
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      type: job.type || 'Full-Time',
      experience: job.experience || '',
      description: job.description || '',
      requirements: (job.requirements || []).join(', '),
      status: job.status || 'Open'
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.department || !formData.location) {
      showToast('Please fill out all required fields', 'error');
      return;
    }

    const payload = {
      ...formData,
      requirements: formData.requirements
        ? formData.requirements.split(',').map((req) => req.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingJob) {
        // Edit job opening
        const res = await api.put(`/jobs/${editingJob._id}`, payload);
        if (res.data.success) {
          showToast(`Job opening "${formData.title}" updated successfully`, 'success');
          fetchJobs();
          setModalOpen(false);
        }
      } else {
        // Create job opening
        const res = await api.post('/jobs', payload);
        if (res.data.success) {
          showToast(`Job opening "${formData.title}" created successfully`, 'success');
          fetchJobs();
          setModalOpen(false);
        }
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to save job opening', 'error');
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`Are you sure you want to delete the job opening "${title}"?`)) {
      return;
    }

    try {
      const res = await api.delete(`/jobs/${jobId}`);
      if (res.data.success) {
        showToast('Job opening deleted successfully', 'success');
        setJobs(jobs.filter((job) => job._id !== jobId));
      }
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to delete job opening', 'error');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold font-display text-[#0A2E52] dark:text-white">
            Careers Customization
          </h2>
          <p className="text-sm text-textmuted">
            Add, update, and manage job openings and vacancies displayed on the public Careers page.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-mid hover:bg-[#005f92] text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md shadow-mid/10"
        >
          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span>Add Job Opening</span>
        </button>
      </div>

      {/* Jobs Catalog */}
      <div className="rounded-3xl bg-white/70 dark:bg-[#0e2238]/60 backdrop-blur-md border border-[#d0e8f5]/40 dark:border-slate-800/40 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center flex flex-col justify-center items-center gap-3">
            <div className="w-8 h-8 border-2 border-mid border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-textmuted">Loading jobs database...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-16 text-center text-slate-500">
            <div className="text-4xl mb-3">💼</div>
            <p className="text-sm font-semibold">No job openings found.</p>
            <p className="text-xs text-textmuted mt-1">Click the "Add Job Opening" button to create your first listing.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#d0e8f5]/40 dark:border-slate-800/40 bg-slate-100/30 dark:bg-slate-900/10 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="p-5">Job Title</th>
                  <th className="p-5">Department</th>
                  <th className="p-5">Location</th>
                  <th className="p-5">Type / Experience</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm">
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
                    <td className="p-5 font-bold text-slate-800 dark:text-white">
                      {job.title}
                    </td>
                    <td className="p-5 text-slate-600 dark:text-slate-350">
                      <span className="bg-lightbg text-mid dark:bg-slate-800 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {job.department}
                      </span>
                    </td>
                    <td className="p-5 text-slate-650 dark:text-slate-300">
                      📍 {job.location}
                    </td>
                    <td className="p-5 text-xs text-textmuted space-y-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">{job.type}</div>
                      <div>🧑‍💼 {job.experience || 'Not Specified'}</div>
                    </td>
                    <td className="p-5">
                      {job.status === 'Open' ? (
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Open
                        </span>
                      ) : (
                        <span className="text-[10px] bg-slate-500/10 text-slate-500 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="p-5">
                      <div className="flex gap-2 justify-center items-center">
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(job)}
                          className="p-2 border border-mid/20 hover:border-mid bg-mid/5 hover:bg-mid text-mid hover:text-white rounded-xl transition cursor-pointer"
                          title="Edit Job"
                        >
                          <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.83 20.062a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                          </svg>
                        </button>
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteJob(job._id, job.title)}
                          className="p-2 border border-rose-500/20 hover:border-rose-500 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition cursor-pointer"
                          title="Delete Job"
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

      {/* Add/Edit Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <div className="relative w-full max-w-lg p-6 rounded-3xl bg-white dark:bg-[#0c1a30] border border-[#d0e8f5]/40 dark:border-slate-800 shadow-2xl my-8 text-left inline-block align-middle transform transition-all">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold font-display text-slate-800 dark:text-white">
                {editingJob ? 'Edit Job Opening' : 'Add New Job Opening'}
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
              {/* Job Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Sales Executive – Medical Equipment"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Department */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g. Sales, Service, Technology"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Delhi / Mumbai / Bengaluru"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Job Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Required Experience
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 2–5 years"
                    className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Listing Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                >
                  <option value="Open">Open (Visible on site)</option>
                  <option value="Closed">Closed (Hidden from site)</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Job Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Provide a summary of the role, responsibilities..."
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent text-xs dark:text-white"
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Key Requirements (Comma-Separated)
                </label>
                <input
                  type="text"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleInputChange}
                  placeholder="e.g. Experience with X-Ray systems, strong communication skills, engineering degree"
                  className="w-full bg-slate-100/50 dark:bg-slate-900/40 border border-[#d0e8f5]/40 dark:border-slate-800/50 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-accent dark:text-white"
                />
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
                  Save Job Opening
                </button>
              </div>
             </form>
           </div>
         </div>
       </div>
       )}
     </div>
  );
}
