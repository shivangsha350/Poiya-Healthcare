import React from 'react';

const items = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="1.8" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: '24/7 Support',
    sub: 'Always here when you need us most',
    link: '+91 9414044499',
    href: 'tel:9414044499',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="1.8" className="w-6 h-6">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.23 2 2 0 012 .01h3a2 2 0 012 1.72c.128.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    title: 'Contact Us',
    sub: 'Call us, write us or visit our office',
    link: 'Send Enquiry →',
    href: '/contact',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#0077B6" strokeWidth="1.8" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    title: 'Work With Us',
    sub: 'Explore open job positions and apply',
    link: 'Careers →',
    href: '/career',
  },
];

export default function QuickInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 bg-cyan-5 border-b border-bordercol">
      {items.map((item, i) => (
        <div
          key={i}
          className={`p-6 md:p-7 flex items-start gap-4 hover:bg-lightbg transition
            border-b sm:border-b-0 md:border-r border-bordercol
            ${i === items.length - 1 ? 'md:border-r-0' : ''}
            ${i === 1 ? 'sm:border-r md:border-r' : ''}
          `}
        >
          <div className="w-12 h-12 rounded-xl bg-lightbg flex items-center justify-center flex-shrink-0">
            {item.icon}
          </div>
          <div>
            <div className="font-semibold text-[15px] text-primary mb-1">{item.title}</div>
            <div className="text-[13px] text-textmuted">{item.sub}</div>
            <a href={item.href} className="text-[13px] text-mid font-medium mt-1.5 inline-block hover:underline">
              {item.link}
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
