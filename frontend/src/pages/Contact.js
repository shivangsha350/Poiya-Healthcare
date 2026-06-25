import React, { useState } from 'react';
import axios from 'axios';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', org: '', product: '', message: '' });

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
        subject: form.product ? `Enquiry for ${form.product}` : 'General Contact Enquiry'
      };

      const res = await axios.post('http://localhost:5000/api/messages', payload);
      if (res.data.success) {
        setSubmitted(true);
        setForm({ firstName: '', lastName: '', email: '', phone: '', org: '', product: '', message: '' });
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

  const cards = [
    { icon: '📞', title: 'Call Us', lines: ['1800-120-280-280 (Toll Free)', '+91 11 2780 2345'], link: 'tel:18001202880', linkTxt: 'Call Now' },
    { icon: '✉️', title: 'Email Us', lines: ['info@medivisionhealth.com', 'support@medivisionhealth.com'], link: 'mailto:info@medivisionhealth.com', linkTxt: 'Send Email' },
    { icon: '📍', title: 'Visit Us', lines: ['B-83, Mangolpuri Industrial Area,', 'Phase-II, New Delhi - 110034'], link: 'https://maps.google.com', linkTxt: 'Get Directions' },
    { icon: '🕐', title: 'Working Hours', lines: ['Mon – Sat: 9:00 AM – 6:00 PM', 'Support: 24/7'], link: '#', linkTxt: 'Emergency Support' },
  ];

  const branches = [
    { city: 'Mumbai', addr: 'Lower Parel, Mumbai - 400013' },
    { city: 'Bengaluru', addr: 'Koramangala, Bengaluru - 560034' },
    { city: 'Hyderabad', addr: 'Banjara Hills, Hyderabad - 500034' },
    { city: 'Kolkata', addr: 'Salt Lake, Kolkata - 700064' },
    { city: 'Chennai', addr: 'Anna Nagar, Chennai - 600040' },
  ];

  return (
    <main>
      <div className="bg-gradient-to-br from-primary via-primary to-mid px-5 sm:px-10 py-12 md:py-[70px] text-center text-white">
        <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-3">Get In Touch</div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-[42px] font-extrabold text-white mb-3">Contact Us</h1>
        <p className="text-sm sm:text-base text-[#B0D8ED]">Our team is ready to help you find the right radiology solution</p>
      </div>

      {/* Contact Info Cards */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto">
          {cards.map((card, i) => (
            <div key={i} className="border-[1.5px] border-bordercol rounded-2xl p-6 sm:p-7 bg-white text-center transition hover:border-accent2 hover:shadow-[0_6px_20px_rgba(0,100,160,0.08)] hover:-translate-y-0.5">
              <div className="text-3xl mb-3.5">{card.icon}</div>
              <h4 className="font-bold text-[15px] text-primary mb-2.5">{card.title}</h4>
              {card.lines.map((l, j) => <p key={j} className="text-[13px] text-textmuted leading-relaxed">{l}</p>)}
              <a
                href={card.link}
                target={card.link.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="text-[13px] text-mid font-semibold mt-3 inline-block hover:underline"
              >
                {card.linkTxt} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start max-w-7xl mx-auto">
          {/* Form */}
          <div>
            <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Send a Message</div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary mb-6">Quick Enquiry Form</h2>

            {submitted ? (
              <div className="text-center py-12 px-6 bg-lightbg rounded-2xl border-[1.5px] border-bordercol">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display text-2xl font-extrabold text-primary mb-2.5">Message Sent!</h3>
                <p className="text-sm text-textmuted">Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} className="bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition mt-4">
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                  <div>
                    <label className="block text-[13px] font-medium text-primary mb-1.5">First Name *</label>
                    <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ravi" required className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-primary mb-1.5">Last Name *</label>
                    <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Sharma" required className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                  </div>
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-medium text-primary mb-1.5">Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="ravi@hospital.in" required className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-medium text-primary mb-1.5">Phone Number *</label>
                  <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" required className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-medium text-primary mb-1.5">Organisation / Hospital Name</label>
                  <input name="org" value={form.org} onChange={handleChange} placeholder="City General Hospital" className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition" />
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-medium text-primary mb-1.5">Product Interest</label>
                  <select name="product" value={form.product} onChange={handleChange} className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition">
                    <option value="">Select a product...</option>
                    <option>Handheld Portable X-Ray</option>
                    <option>Mobile X-Ray System</option>
                    <option>Digital Radiography (DR)</option>
                    <option>Computed Radiography (CR)</option>
                    <option>Surgical C-Arm</option>
                    <option>TB AI Software</option>
                    <option>PACS / RIS</option>
                    <option>Service / AMC</option>
                  </select>
                </div>
                <div className="mb-3.5">
                  <label className="block text-[13px] font-medium text-primary mb-1.5">Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us about your requirements..." rows={4} required className="w-full px-3.5 py-2.5 border-[1.5px] border-bordercol rounded-lg text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition resize-y" />
                </div>

                {error && (
                  <div className="mb-4 text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-lg">
                    ⚠️ {error}
                  </div>
                )}

                <button type="submit" disabled={submitting} className="w-full bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>

          {/* Info Side */}
          <div>
            <div className="bg-gradient-to-br from-lightbg to-[#CAF0F8] rounded-2xl border-[1.5px] border-bordercol h-[220px] flex flex-col items-center justify-center text-center p-6 mb-6">
              <div className="text-4xl mb-3">📍</div>
              <p className="text-sm text-textmuted leading-relaxed">B-83, Mangolpuri Industrial Area<br />Phase-II, New Delhi - 110034</p>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="bg-cta text-white px-5 py-2.5 rounded-[9px] font-semibold text-[13px] hover:bg-ctadark transition inline-block mt-4">
                Open in Google Maps
              </a>
            </div>
            <div>
              <h4 className="font-bold text-[15px] text-primary mb-3.5">Our Branch Offices</h4>
              {branches.map((b, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-center gap-1 py-2.5 border-b border-bordercol last:border-b-0">
                  <div className="font-semibold text-[13px] text-mid">{b.city}</div>
                  <div className="text-xs text-textmuted sm:text-right">{b.addr}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
