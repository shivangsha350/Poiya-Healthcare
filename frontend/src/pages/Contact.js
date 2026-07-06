import React, { useState } from 'react';
import axios from 'axios';
import { motion, useReducedMotion } from 'framer-motion';
import { API_BASE_URL } from '../config';
import contactHeroImg from '../Assets/ContactHero.png';

const cards = [
  {
    icon: '📞',
    title: 'Call Us',
    lines: [
      '+91 9414044499',
      '+91 9057287635'
    ],
    link: 'tel:+919414044499',
    linkTxt: 'Call Now'
  },
  {
    icon: '✉️',
    title: 'Email Us',
    lines: [
      'poiyahealthcure99@gmail.com',
      'poiyahc99@gmail.com'
    ],
    link: 'mailto:poiyahealthcure99@gmail.com',
    linkTxt: 'Send Email'
  },
  {
    icon: '📍',
    title: 'Visit Us',
    lines: [
      'Office No. 301, Third Floor, Trimurti Prime Tower, Niwaru Road, Jhotwara, Jaipur, Rajasthan - 302012'
    ],
    link: 'https://www.google.com/maps/dir/?api=1&destination=26.96524995783401,75.72187827367408',
    linkTxt: 'Get Directions'
  },
  {
    icon: '🕐',
    title: 'Working Hours',
    lines: [
      'Mon – Sat: 9:00 AM – 7:00 PM',
      'Support: 24/7'
    ],
    link: 'tel:+919414044499',
    linkTxt: 'Emergency Support'
  }
];

const branches = [
  { city: 'Jaipur', addr: 'Jhotwada Industrial Area, Jaipur - 302012' },
];

const PRODUCTS = [
  'Handheld Portable X-Ray',
  'Mobile X-Ray System',
  'Digital Radiography (DR)',
  'Computed Radiography (CR)',
  'Surgical C-Arm',
  'TB AI Software',
  'PACS / RIS',
  'Service / AMC',
];

function CornerBrackets({ size = 'w-4 h-4', color = 'border-accent', visibility = 'opacity-0 group-hover:opacity-100' }) {
  const base = `absolute ${size} ${color} ${visibility} pointer-events-none transition-all duration-300`;
  return (
    <>
      <span className={`${base} -top-2 -left-2 border-t-2 border-l-2`}></span>
      <span className={`${base} -top-2 -right-2 border-t-2 border-r-2`}></span>
      <span className={`${base} -bottom-2 -left-2 border-b-2 border-l-2`}></span>
      <span className={`${base} -bottom-2 -right-2 border-b-2 border-r-2`}></span>
    </>
  );
}

function GridBackdrop({ id, className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true">
      <defs>
        <pattern id={id} width="36" height="36" patternUnits="userSpaceOnUse">
          <path d="M36 0H0V36" fill="none" stroke="currentColor" strokeWidth="1"></path>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`}></rect>
    </svg>
  );
}

const INIT_FORM = { firstName: '', lastName: '', email: '', phone: '', org: '', product: '', message: '' };

export default function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState(INIT_FORM);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const payload = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email,
        phone: form.phone,
        product: form.product,
        message: form.org ? `[Organisation: ${form.org}] ${form.message}` : form.message,
        subject: form.product ? `Enquiry for ${form.product}` : 'General Contact Enquiry',
      };

      const res = await axios.post(`${API_BASE_URL}/messages`, payload);
      if (res.data.success) {
        setSubmitted(true);
        setForm(INIT_FORM);
      } else {
        setError(res.data.message || 'Failed to submit enquiry. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting inquiry:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 border-2 border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition bg-white";
  const labelClass = "block text-[13px] font-semibold text-primary mb-1.5";

  return (
    <main className="bg-[#EAF6FB] min-h-screen antialiased">

      {/* Hero */}
      <div className="relative w-full overflow-hidden">
        <img
          src={contactHeroImg}
          alt="Contact Poiya Healthcare — our team is ready to help you find the right radiology solution"
          className="w-full h-auto object-cover"
        />

        {/* Diagonal divider blending into the cyan-blue body below */}
        <div
          className="absolute bottom-0 left-0 w-full h-10 sm:h-14"
          style={{ background: '#EAF6FB', clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 100%)' }}
        />
      </div>

      {/* Contact method cards */}
      <section className="px-5 sm:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.06 }}
              className="group relative bg-gradient-to-r from-[#EAF6FB] via-[#D2EEFA] to-[#BCE3F7] border-2 border-accent2 rounded-2xl p-6 sm:p-7 text-center transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,100,160,0.18)] hover:-translate-y-1"
            >
              <CornerBrackets />
              <div className="w-12 h-12 rounded-xl bg-white/80 border border-accent/20 flex items-center justify-center text-2xl mx-auto mb-4 shadow-sm">
                {card.icon}
              </div>
              <h4 className="font-bold text-[15px] text-primary mb-2.5">{card.title}</h4>
              {card.lines.map((l, j) => (
                <p key={j} className="text-[13px] text-textmuted leading-relaxed">{l}</p>
              ))}
              <a
                href={card.link}
                target={card.link.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="text-[13px] text-mid font-bold mt-3 inline-block hover:underline"
              >
                {card.linkTxt} →
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="px-5 sm:px-10 py-14 md:py-20 bg-[#E1F3FA]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-7xl mx-auto">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            className="bg-white border-2 border-bordercol rounded-2xl p-6 sm:p-8 shadow-sm"
          >
            <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-4 bg-[#EAF6FB]">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
              Send a Message
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-6">Quick Enquiry Form</h2>

            {submitted ? (
              <div className="text-center py-12 px-6 bg-[#EAF6FB] rounded-2xl border-2 border-bordercol">
                <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
                <h3 className="font-display text-2xl font-extrabold text-primary mb-2.5">Message Sent</h3>
                <p className="text-sm text-textmuted mb-5">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-mid text-white px-7 py-3 rounded-xl font-bold text-sm uppercase tracking-wide hover:bg-primary transition"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                  <div>
                    <label className={labelClass}>First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ravi" required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Garg" required className={inputClass} />
                  </div>
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ravi@hospital.in" required className={inputClass} />
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className={inputClass} />
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Organisation / Hospital Name</label>
                  <input name="org" value={form.org} onChange={handleChange} placeholder="City General Hospital" className={inputClass} />
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Product Interest</label>
                  <select name="product" value={form.product} onChange={handleChange} className={inputClass}>
                    <option value="">Select a product...</option>
                    {PRODUCTS.map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-3.5">
                  <label className={labelClass}>Message *</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us about your requirements..."
                    rows={4}
                    required
                    className={`${inputClass} resize-y`}
                  ></textarea>
                </div>

                {error && (
                  <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-3.5 py-2.5 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-mid text-white px-7 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide hover:bg-primary transition disabled:opacity-60"
                >
                  {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
          >
            <div className="group relative bg-primary rounded-2xl border-2 border-primary overflow-hidden mb-6">
              <div className="w-full h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3556.052082125033!2d75.72187827367408!3d26.96524995783401!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db2d091776ad5%3A0xa5b0c4b99e901ccf!2sPoiya%20Health%20Cure!5e0!3m2!1sen!2sin!4v1782666941698!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  title="Poiya Health Cure Location"
                />
              </div>
              <div className="bg-white px-6 py-5 text-center">
                <p className="text-sm text-textmuted leading-relaxed mb-4">
                  Office No. 301, Third & Zero Floor, Trimurti Prime Tower,<br />
                  Niwaru Rd, Jhotwara, Jaipur, Rajasthan - 302012
                </p>
                <a
                  href="https://maps.app.goo.gl/nCSZ6qvp5ECnPc6BA"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-mid text-white px-5 py-2.5 rounded-xl font-bold text-[13px] uppercase tracking-wide hover:bg-primary transition inline-block"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="bg-white border-2 border-bordercol rounded-2xl p-6">
              <h4 className="font-bold text-[15px] text-primary mb-3.5 pb-3 border-b-2 border-[#EAF6FB]">Our Office</h4>
              {branches.map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 py-2.5 border-b border-bordercol last:border-b-0">
                  <div className="font-bold text-[13px] text-mid">{b.city}</div>
                  <div className="text-xs text-textmuted sm:text-right">{b.addr}</div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
}