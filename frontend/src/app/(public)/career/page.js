"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, useReducedMotion } from 'framer-motion';
import { API_BASE_URL } from '../../../config';
import CareerHeroImg from '../../../Assets/CareerHero.webp';

const perks = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Industry-leading compensation with performance bonuses.' },
  { icon: '📈', title: 'Career Growth', desc: 'Structured career paths and promotion cycles every 12 months.' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive medical cover for you and your family.' },
  { icon: '🎓', title: 'Learning & Development', desc: 'Annual training budget and access to technical certifications.' },
  { icon: '🚗', title: 'Travel Allowance', desc: 'Fuel reimbursement and travel allowances for field roles.' },
  { icon: '🏖️', title: 'Paid Leave', desc: '18 days annual leave plus public holidays and sick leave.' },
];

function GridBackdrop({ id, className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function Career() {
  const shouldReduceMotion = useReducedMotion();

  const [openings, setOpenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selected, setSelected] = useState(null);
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    employer: '',
    motivation: ''
  });

  const [resumeFile, setResumeFile] = useState(null);

  // Fetch openings
  useEffect(() => {
    const fetchOpenings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/jobs`);
        if (res.data.success) {
          setOpenings(res.data.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError('Failed to load current job openings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setResumeFile(e.target.files[0]);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setSubmitError('Please fill out all required fields (*)');
      return;
    }

    if (!resumeFile) {
      setSubmitError('Please upload your resume (PDF) *');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('email', form.email);
      payload.append('phone', form.phone);
      payload.append('location', form.location || '');
      payload.append('experience', form.experience || '');
      payload.append('appliedPosition', selected.title);
      payload.append('coverLetter', form.motivation || '');
      payload.append('resume', resumeFile);

      const res = await axios.post(`${API_BASE_URL}/careers/apply`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setApplied(true);
        setForm({
          name: '',
          email: '',
          phone: '',
          location: '',
          experience: '',
          employer: '',
          motivation: ''
        });
        setResumeFile(null);
      } else {
        setSubmitError(res.data.message || 'Failed to submit application. Please try again.');
      }
    } catch (err) {
      console.error('Error applying for job:', err);
      setSubmitError(err.response?.data?.message || 'Failed to submit application. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#EAF6FB] min-h-screen">
      <div className="relative w-full overflow-hidden">
        <img
          src={CareerHeroImg.src || CareerHeroImg}
          alt="Contact Poiya Healthcare — our team is ready to help you find the right radiology solution"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Perks */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="text-center mb-10 max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Why Work With Us</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">Life at Poiya Healthcare</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {perks.map((p, i) => (
            <div key={i} className="border-[1.5px] border-bordercol rounded-2xl p-6 sm:p-7 bg-white transition hover:border-accent2 hover:shadow-[0_6px_20px_rgba(0,100,160,0.08)] hover:-translate-y-0.5">
              <div className="text-2xl sm:text-3xl mb-3.5">{p.icon}</div>
              <h4 className="font-bold text-[15px] text-primary mb-2">{p.title}</h4>
              <p className="text-[13px] text-textmuted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="text-center mb-10 max-w-7xl mx-auto">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Open Positions</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">Current Openings</h2>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-10 h-10 border-4 border-mid border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-textmuted font-semibold">Loading available openings...</p>
          </div>
        ) : error ? (
          <div className="text-center max-w-md mx-auto py-10 bg-white border border-rose-100 rounded-2xl p-6 text-sm text-rose-500 font-semibold shadow">
            ⚠️ {error}
          </div>
        ) : openings.length === 0 ? (
          <div className="text-center max-w-xl mx-auto py-16 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
            <div className="text-4xl mb-4 font-semibold text-slate-400">💼</div>
            <h4 className="font-display font-extrabold text-primary text-lg mb-2">No Open Openings Right Now</h4>
            <p className="text-sm text-textmuted">We don't have any specific active openings currently. However, you can send your resume to our team directly below.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5 max-w-7xl mx-auto">
            {openings.map((job) => (
              <div key={job._id} className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-5 sm:p-6 bg-white border-[1.5px] border-bordercol rounded-2xl transition hover:border-accent2 hover:shadow-[0_4px_16px_rgba(0,100,160,0.08)]">
                <div>
                  <div className="font-bold text-[15px] text-primary mb-2">{job.title}</div>
                  <div className="flex gap-3.5 flex-wrap items-center">
                    <span className="bg-lightbg text-mid px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide">{job.department}</span>
                    <span className="text-xs text-textmuted">📍 {job.location}</span>
                    <span className="text-xs text-textmuted">⏱️ {job.type}</span>
                    {job.experience && <span className="text-xs text-textmuted">🧑💼 {job.experience}</span>}
                  </div>
                  {job.description && (
                    <p className="text-xs text-textmuted mt-2.5 line-clamp-2 leading-relaxed whitespace-pre-line max-w-3xl">
                      {job.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => { setSelected(job); setApplied(false); setSubmitError(''); }}
                  className="bg-cta text-white px-5 py-2.5 rounded-[9px] font-semibold text-[13px] hover:bg-ctadark transition flex-shrink-0 w-full sm:w-auto self-start sm:self-center"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Apply Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-primary/45 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 sm:p-5"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-[20px] p-6 sm:p-9 w-full max-w-[580px] max-h-[90vh] overflow-y-auto relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-5 bg-transparent border-none text-lg cursor-pointer text-textmuted w-8 h-8 rounded-full flex items-center justify-center hover:bg-lightbg hover:text-primary transition"
            >
              ✕
            </button>

            {applied ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-primary mb-3">Application Submitted!</h3>
                <p className="text-sm text-textmuted leading-relaxed">
                  Thank you for applying for <strong>{selected.title}</strong>. Our HR team will review your application and get back to you within 5 business days.
                </p>
                <button onClick={() => setSelected(null)} className="bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition mt-5">
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-primary">Apply for: {selected.title}</h3>
                  <div className="flex gap-3.5 flex-wrap items-center mt-1.5">
                    <span className="bg-lightbg text-mid px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide">{selected.department}</span>
                    <span className="text-xs text-textmuted">📍 {selected.location}</span>
                    <span className="text-xs text-textmuted">{selected.type}</span>
                  </div>
                </div>
                <form onSubmit={handleApplySubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[13px] font-medium text-primary mb-1.5">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Ravi Sharma" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-primary mb-1.5">Email *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="ravi@email.com" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                    <div>
                      <label className="block text-[13px] font-medium text-primary mb-1.5">Phone *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                    </div>
                    <div>
                      <label className="block text-[13px] font-medium text-primary mb-1.5">Current Location</label>
                      <input name="location" value={form.location} onChange={handleChange} placeholder="New Delhi" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                    </div>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[13px] font-medium text-primary mb-1.5">Total Experience</label>
                    <select name="experience" value={form.experience} onChange={handleChange} className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition">
                      <option value="">Select experience...</option>
                      <option value="Fresher (0 years)">Fresher (0 years)</option>
                      <option value="1–2 years">1–2 years</option>
                      <option value="3–5 years">3–5 years</option>
                      <option value="5–10 years">5–10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[13px] font-medium text-primary mb-1.5">Current Employer</label>
                    <input name="employer" value={form.employer} onChange={handleChange} placeholder="Company name (optional)" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                  </div>
                  <div className="mb-3.5">
                    <label className="block text-[13px] font-medium text-primary mb-1.5">Why do you want to join Poiya Healthcare?</label>
                    <textarea name="motivation" value={form.motivation} onChange={handleChange} rows={3} placeholder="Tell us about your motivation..." className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-y" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-[13px] font-medium text-primary mb-1.5">Upload Resume (PDF)</label>
                    <label className="border-[1.5px] border-dashed border-bordercol rounded-lg p-4 text-center cursor-pointer text-[13px] text-textmuted hover:border-accent hover:text-mid hover:bg-lightbg transition block relative">
                      {resumeFile ? `📎 Selected: ${resumeFile.name}` : '📎 Click to upload your resume'}
                      <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" />
                    </label>
                  </div>

                  {submitError && (
                    <div className="mb-4 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg">
                      ⚠️ {submitError}
                    </div>
                  )}

                  <button type="submit" disabled={submitting} className="w-full bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
                    {submitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="relative px-5 sm:px-10 py-16 md:py-24 text-center overflow-hidden bg-gradient-to-br from-accent to-mid">
        <GridBackdrop id="gridCareerCta" className="opacity-[0.10] text-white" />

        <div className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-0 w-96 h-96 rounded-full bg-accent2/20 blur-3xl pointer-events-none" />

        {!shouldReduceMotion && (
          <motion.div
            className="absolute left-0 right-0 h-24 bg-gradient-to-b from-white/0 via-white/30 to-white/0 pointer-events-none"
            initial={{ top: '-20%' }}
            animate={{ top: ['-20%', '120%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-6 sm:px-10 py-10 sm:py-12 shadow-[0_20px_60px_rgba(0,60,90,0.25)]"
        >
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-white border border-white/40 rounded-full px-4 py-1.5 mb-5 bg-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Still Looking
          </div>

          <h2 className="font-display text-xl sm:text-[32px] font-extrabold text-white mb-3 tracking-tight">
            Don't See a Suitable Role?
          </h2>

          <p className="text-cyan-50 text-sm sm:text-base mb-8 max-w-md mx-auto">
            Send us your resume and we'll reach out when the right opportunity arises.
          </p>

          <motion.a
            href="mailto:poiyahealthcure99@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="group bg-white text-cyan-700 px-8 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide hover:shadow-[0_10px_30px_rgba(255,255,255,0.4)] transition-shadow duration-200 inline-flex items-center gap-2"
          >
            <span>Send Your Resume</span>
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </motion.a>
        </motion.div>
      </div>
    </main>
  );
}
