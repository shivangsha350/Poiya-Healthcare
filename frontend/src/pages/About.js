import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import StatsBand from '../components/StatsBand';
import Logo from '../Assets/Logo.png';
import AboutHeroImg from '../Assets/AboutUsHero.png';
import ShivImg from '../Assets/Shiv.jpeg';
import ReenaImg from '../Assets/Reena.jpeg';


const team = [
  { name: "Mr. Ramkumarr Dubey", role: "Founder & CEO", initial: "RD", image: Logo },
  { name: "Mrs. Timcy Dubey", role: "Chief Managing Director", initial: "TD", image: ShivImg },
{ name: "Mr. Shiv Dixit", role: "Head - Sales & Marketing", initial: "SD", image: ShivImg },
{ name: "Mrs. Reena Sharma", role: "HR Operations", initial: "RS", image: ReenaImg },
];

const pillars = [
  { icon: '🎯', title: 'Our Mission', desc: 'To deliver affordable, high-quality radiology and imaging solutions that empower healthcare professionals to provide the best possible patient outcomes.', highlight: true },
  { icon: '🔭', title: 'Our Vision', desc: 'To become one of India\'s most trusted healthcare technology companies by delivering world-class medical equipment, advanced diagnostic solutions, and innovative healthcare products through quality, integrity, and continuous innovation.'},
  { icon: '💡', title: 'Our Values', desc: 'Quality, integrity, innovation and customer-first service form the four pillars of everything we do at Poiya Healthcure.' },
];

const reviews = [
  { text: "Poiya Healthcure transformed our radiology department. The Carestream systems they provided are exceptional, and the installation support was flawless.", name: "Dr. Arjun Mehta", role: "Radiologist, Apex Hospitals Delhi", initials: "AM" },
  { text: "Outstanding service and top-quality imaging equipment. Our portable X-ray unit from Poiya has been a game changer for our remote healthcare camps.", name: "Dr. Sunita Rao", role: "Chief Medical Officer, Shubham Health NGO", initials: "SR" },
  { text: "The AI-ready DR system we purchased works seamlessly with our reporting software. Poiya's team guided us through every step of the setup.", name: "Mr. Rakesh Gupta", role: "Hospital Administrator, JS MEMORIAL", initials: "RG" },
  { text: "We've been working with Poiya for over 8 years. Their pan-India service support is unmatched — any issue is resolved within 24 hours.", name: "Dr. Priya Sharma", role: "Director, Shiv Diagnostic Centre", initials: "PS" },
  { text: "The flexible EMI plan made it possible for our small clinic to upgrade to digital radiography. Truly a partner that understands our needs.", name: "Dr. Kiran Patel", role: "Owner, Ram Clinic Ahmedabad", initials: "KP" },
  { text: "Poiya's GeM registration made the procurement process for our government hospital completely hassle-free. Professional and trustworthy.", name: "Mr. Anil Verma", role: "Purchase Officer, AIIMS Jodhpur", initials: "AV" },
  { text: "The CR system quality is excellent and the training provided by Poiya's engineers was thorough. Highly recommend them to any healthcare facility.", name: "Dr. Meena Joshi", role: "Head of Radiology, Timcy Hospital", initials: "MJ" },
  { text: "We ordered through the government tender process and Poiya made it incredibly smooth. Equipment arrived on time and in perfect condition.", name: "Dr. Suresh Nair", role: "Medical Superintendent, Shivang Hospital Lucknow", initials: "SN" },
  { text: "The TB AI detection software integrated with our workflow perfectly. Poiya genuinely understands modern diagnostic needs.", name: "Dr. Fatima Sheikh", role: "Pulmonologist, Global Hospital Mumbai", initials: "FS" },
  { text: "Make in India portable X-ray units from Poiya have been deployed across 12 of our camps. Durable, reliable, and cost-effective.", name: "Mr. Vijay Thakur", role: "Program Director, Yash Foundation", initials: "VT" },
];

function CornerBrackets({ size = 'w-5 h-5', color = 'border-accent', visibility = 'opacity-100' }) {
  const base = `absolute ${size} ${color} ${visibility} pointer-events-none transition-all duration-300`;
  return (
    <>
      <span className={`${base} -top-2 -left-2 border-t-2 border-l-2`} />
      <span className={`${base} -top-2 -right-2 border-t-2 border-r-2`} />
      <span className={`${base} -bottom-2 -left-2 border-b-2 border-l-2`} />
      <span className={`${base} -bottom-2 -right-2 border-b-2 border-r-2`} />
    </>
  );
}

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

function CustomerSlider() {
  const [page, setPage] = useState(0);
  const perPage = 3;
  const totalPages = Math.ceil(reviews.length / perPage);
  const slice = reviews.slice(page * perPage, page * perPage + perPage);

  return (
    <section className="px-5 sm:px-10 py-16 md:py-24 bg-primary relative overflow-hidden">
      <GridBackdrop id="gridReviews" className="opacity-[0.05] text-white" />

      <div className="text-center mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-4 bg-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Happy Customers
        </div>
        <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">What Our Clients Say</h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {slice.map((r, i) => (
            <motion.div
              key={page * perPage + i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              className={`rounded-2xl p-6 sm:p-7 border-2 transition-all duration-300 ${
                i === 1
                  ? 'border-accent/60 bg-white/[0.07]'
                  : 'border-white/10 bg-white/[0.04]'
              }`}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, s) => (
                  <span key={s} className="text-accent text-base">★</span>
                ))}
              </div>
              <p className="text-[13px] text-[#B0D8ED]/80 leading-relaxed mb-5 italic">"{r.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-mid flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {r.initials}
                </div>
                <div>
                  <div className="text-white text-sm font-bold">{r.name}</div>
                  <div className="text-[#B0D8ED]/60 text-[11px]">{r.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => (p - 1 + totalPages) % totalPages)}
            className="w-9 h-9 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-200"
          >
            ←
          </button>
          <div className="flex gap-2 items-center">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? 'w-5 bg-accent' : 'w-2 bg-white/25'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="w-9 h-9 rounded-full border-2 border-white/20 text-white flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-all duration-200"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="bg-[#EAF6FB] min-h-screen antialiased">

      {/* Page Header */}
      <div className="relative w-full overflow-hidden">
        <img
          src={AboutHeroImg}
          alt="Contact MediVision Healthcare — our team is ready to help you find the right radiology solution"
          className="w-full h-auto object-cover"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-10 sm:h-14"
          style={{ background: '#EAF6FB', clipPath: 'polygon(0 100%, 100% 100%, 100% 40%, 0 100%)' }}
        />
      </div>

      {/* Mission + Vision + Values */}
      <section className="px-5 sm:px-10 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {pillars.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08 }}
              className="group relative rounded-2xl p-7 sm:p-8 border-2 border-accent2 bg-gradient-to-br from-[#1E5A8C] via-[#A9D4F0] to-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(0,100,160,0.18)]"
            >
              <CornerBrackets size="w-4 h-4" color="border-accent" visibility="opacity-0 group-hover:opacity-100" />
              <div className="w-14 h-14 rounded-xl bg-white/80 border border-accent2/30 flex items-center justify-center text-3xl mb-4 shadow-sm">
                {card.icon}
              </div>
              <h3 className="font-display text-lg sm:text-xl font-extrabold text-primary mb-2.5">{card.title}</h3>
              <p className="text-sm text-textmuted leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
{/* About Section */}
<section className="px-5 sm:px-10 py-14 md:py-20 bg-cyan-50">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center max-w-7xl mx-auto">
    {/* Left Image */}
    <div className="order-2 lg:order-1 reveal">
      <div className="rounded-[20px] overflow-hidden shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
        <img
          src={AboutHeroImg}
          alt="About Poiya Healthcare"
          className="w-full h-[240px] md:h-[340px] lg:h-[420px] object-cover rounded-[20px] transition-transform duration-500 ease-in-out hover:scale-110 cursor-pointer"
        />
      </div>
    </div>

    {/* Right Content */}
    <div className="order-1 lg:order-2 reveal">
      <div className="text-sm sm:text-base font-extrabold tracking-[2px] uppercase text-accent mb-2.5">
        About Poiya Healthcare
      </div>

      <h2 className="font-display text-2xl sm:text-4 font-bold text-primary mb-4 leading-snug">
        Building Trust in Healthcare Since 2008
      </h2>

      <p className="text-[15px] sm:text-base text-textmuted leading-relaxed mb-6">
        What began in 2008 as Digital Photo Chemistry under Mr. Ramkumarr
        Dubey has grown into Poiya Healthcare India Pvt. Ltd. — a trusted
        supplier of diagnostic imaging, nephrology, pathology, and oncology
        equipment to hospitals and diagnostic centres nationwide. Headquartered
        in Jaipur, Rajasthan, we continue to serve customers across India with
        quality products and dependable service.
      </p>

      <ul className="flex flex-col gap-3 mb-7">
        {[
          "Digital Radiography (DR) & Computed Radiography (CR) Systems",
          "X-Ray Machines, C-Arm & Cath Lab Systems",
          "CT Scan & MRI Systems",
          "Dialysis Machines & Consumables",
          "Pathology & Oncology Equipment",
          "Nationwide AMC, Installation & Technical Support",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3 text-primary text-[15px]">
            <span className="w-6 h-6 rounded-full bg-lightbg text-mid flex items-center justify-center font-bold flex-shrink-0">
              ✓
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        href="/documents/company-profile.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-cta hover:bg-ctadark text-white px-7 py-3 rounded-[10px] font-semibold transition"
      >
        Company Details
      </a>
    </div>
  </div>
</section>
      {/* Leadership Team */}
      <section className="px-5 sm:px-10 py-14 md:py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[3px] uppercase text-accent border border-accent/30 rounded-full px-4 py-1.5 mb-4 bg-white">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            Leadership
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {team.map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.07 }}
              className="group relative text-center p-6 sm:p-8 border-2 border-accent2 rounded-2xl bg-gradient-to-tl from-[#5FA8DD] via-[#A9D4F0] to-white transition-all duration-300 hover:shadow-[0_16px_36px_rgba(0,100,160,0.18)] hover:-translate-y-1"
            >
              <CornerBrackets size="w-4 h-4" color="border-accent" visibility="opacity-0 group-hover:opacity-100" />
              <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-full bg-gradient-to-br from-mid to-accent text-white font-display text-xl sm:text-2xl font-extrabold flex items-center justify-center mx-auto mb-4 ring-4 ring-white/40 group-hover:ring-white/60 transition-all duration-300 overflow-hidden">
                {member.image ? (
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  member.initial
                )}
              </div>
              <div className="font-bold text-sm sm:text-[15px] text-primary mb-1">{member.name}</div>
              <div className="text-xs sm:text-[13px] text-textmuted">{member.role}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Happy Customers Slider */}
      <CustomerSlider />

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary to-mid px-5 sm:px-10 py-16 md:py-24 text-center relative overflow-hidden">
        <GridBackdrop id="gridAboutCta" className="opacity-[0.06] text-white" />
        {!shouldReduceMotion && (
          <motion.div
            className="absolute left-0 right-0 h-28 bg-gradient-to-b from-accent/0 via-accent/20 to-accent/0 pointer-events-none"
            initial={{ top: '-25%' }}
            animate={{ top: ['-25%', '125%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 2 }}
          />
        )}

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-2xl sm:text-[36px] font-extrabold text-white mb-3 tracking-tight"
          >
            Ready to Work with Us?
          </motion.h2>
          <p className="text-[#CAF0F8] text-sm sm:text-base mb-9 max-w-xl mx-auto">
            Explore our product range or get in touch to discuss your imaging needs.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-white text-mid px-8 py-3.5 rounded-xl font-extrabold text-sm uppercase tracking-wide hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)] transition-all duration-200 hover:scale-[1.03] inline-block"
            >
              View Products
            </Link>
            <Link
              to="/contact"
              className="bg-transparent text-white px-8 py-3.5 rounded-xl font-bold text-sm border-2 border-white/35 hover:bg-white/10 hover:border-white/60 transition-all duration-200 hover:scale-[1.03] inline-block"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
