import React from 'react';
import { Link } from 'react-router-dom';
import StatsBand from '../components/StatsBand';

const timeline = [
  { year: '1996', title: 'Company Founded', desc: 'Started as a small distributor of X-ray consumables in New Delhi.' },
  { year: '2002', title: 'Carestream Partnership', desc: 'Became an authorised partner of Carestream Health (formerly Kodak Health Imaging).' },
  { year: '2008', title: 'Digital Transition', desc: 'Launched our first line of CR and DR digital radiography systems.' },
  { year: '2015', title: 'Make in India', desc: 'Started manufacturing portable X-ray units under the Make in India initiative.' },
  { year: '2020', title: 'Global Expansion', desc: 'Extended reach to Nepal, Bangladesh, Philippines, Dubai and Singapore.' },
  { year: '2024', title: 'AI Integration', desc: 'Launched TB AI detection software and advanced radiology reporting tools.' },
];

const team = [
  { name: 'Dr. Rajesh Sharma', role: 'Founder & CEO', initial: 'RS' },
  { name: 'Priya Mehta', role: 'VP – Sales & Marketing', initial: 'PM' },
  { name: 'Anil Kumar', role: 'Head of Engineering', initial: 'AK' },
  { name: 'Sunita Rao', role: 'Director – Service Operations', initial: 'SR' },
];

export default function About() {
  return (
    <main>
      {/* Page Header */}
      <div className="bg-gradient-to-br from-primary via-primary to-mid px-5 sm:px-10 py-12 md:py-[70px] text-center text-white">
        <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-3">Who We Are</div>
        <h1 className="font-display text-2xl sm:text-3xl md:text-[42px] font-extrabold text-white mb-3">About MediVision Healthcare</h1>
        <p className="text-sm sm:text-base text-[#B0D8ED]">28+ years of advancing radiology across India and the world</p>
      </div>

      {/* Mission + Vision */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-7xl mx-auto">
          <div className="border-[1.5px] border-accent2 bg-lightbg rounded-2xl p-7 sm:p-8 transition hover:shadow-[0_8px_24px_rgba(0,100,160,0.1)] hover:-translate-y-0.5">
            <div className="text-3xl mb-3.5">🎯</div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-primary mb-2.5">Our Mission</h3>
            <p className="text-sm text-textmuted leading-relaxed">To deliver affordable, high-quality radiology and imaging solutions that empower healthcare professionals to provide the best possible patient outcomes.</p>
          </div>
          <div className="border-[1.5px] border-bordercol bg-white rounded-2xl p-7 sm:p-8 transition hover:shadow-[0_8px_24px_rgba(0,100,160,0.1)] hover:-translate-y-0.5">
            <div className="text-3xl mb-3.5">🔭</div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-primary mb-2.5">Our Vision</h3>
            <p className="text-sm text-textmuted leading-relaxed">To be the most trusted name in medical imaging across South Asia and the Middle East by 2030, driven by innovation and the Make in India initiative.</p>
          </div>
          <div className="border-[1.5px] border-bordercol bg-white rounded-2xl p-7 sm:p-8 transition hover:shadow-[0_8px_24px_rgba(0,100,160,0.1)] hover:-translate-y-0.5">
            <div className="text-3xl mb-3.5">💡</div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-primary mb-2.5">Our Values</h3>
            <p className="text-sm text-textmuted leading-relaxed">Quality, integrity, innovation and customer-first service form the four pillars of everything we do at MediVision.</p>
          </div>
        </div>
      </section>

      <StatsBand />

      {/* Timeline */}
      <section className="px-5 sm:px-10 py-12 md:py-16 bg-sectionbg">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Our Journey</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">28 Years of Excellence</h2>
        </div>

        <div className="relative max-w-[800px] mx-auto py-5">
          {/* Vertical line - centered on desktop, left-aligned on mobile */}
          <div className="absolute top-0 bottom-0 w-0.5 bg-bordercol left-2 md:left-1/2 md:-translate-x-1/2" />

          {timeline.map((item, i) => (
            <div
              key={i}
              className={`relative flex mb-8 sm:mb-10 pl-8 md:pl-0 ${
                i % 2 === 0 ? 'md:justify-end md:pr-[calc(50%+32px)]' : 'md:justify-start md:pl-[calc(50%+32px)]'
              }`}
            >
              <div className="bg-white border-[1.5px] border-bordercol rounded-2xl p-5 sm:p-6 max-w-full md:max-w-[300px] transition hover:border-accent2 hover:shadow-[0_4px_16px_rgba(0,100,160,0.08)]">
                <div className="font-display text-xl sm:text-[22px] font-extrabold text-accent mb-1.5">{item.year}</div>
                <h4 className="text-[15px] font-bold text-primary mb-1.5">{item.title}</h4>
                <p className="text-[13px] text-textmuted leading-relaxed">{item.desc}</p>
              </div>
              <div className="absolute left-2 md:left-1/2 top-6 w-3.5 h-3.5 rounded-full bg-accent border-[3px] border-white shadow-[0_0_0_2px_#48CAE4] -translate-x-1/2" />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="px-5 sm:px-10 py-12 md:py-16">
        <div className="text-center mb-10">
          <div className="text-xs font-semibold tracking-[2px] uppercase text-accent mb-2.5">Leadership</div>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-primary">Meet Our Team</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6 max-w-7xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="text-center p-6 sm:p-8 border-[1.5px] border-bordercol rounded-2xl bg-white transition hover:shadow-[0_8px_24px_rgba(0,100,160,0.1)] hover:border-accent2">
              <div className="w-16 sm:w-[72px] h-16 sm:h-[72px] rounded-full bg-gradient-to-br from-mid to-accent text-white font-display text-lg sm:text-[22px] font-extrabold flex items-center justify-center mx-auto mb-4">
                {member.initial}
              </div>
              <div className="font-bold text-sm sm:text-[15px] text-primary mb-1">{member.name}</div>
              <div className="text-xs sm:text-[13px] text-textmuted">{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-br from-primary to-mid px-5 sm:px-10 py-12 md:py-16 text-center">
        <h2 className="font-display text-2xl sm:text-[30px] font-extrabold text-white mb-3">Ready to Work with Us?</h2>
        <p className="text-[#CAF0F8] text-sm sm:text-base mb-7 max-w-xl mx-auto">Explore our product range or get in touch to discuss your imaging needs.</p>
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link to="/products" className="bg-white text-mid px-7 py-3 rounded-[9px] font-bold text-sm hover:bg-lightbg transition inline-block">View Products</Link>
          <Link to="/contact" className="bg-transparent text-white px-7 py-3 rounded-[9px] font-semibold text-sm border-2 border-white/35 hover:bg-white/10 transition inline-block">Contact Us →</Link>
        </div>
      </div>
    </main>
  );
}
