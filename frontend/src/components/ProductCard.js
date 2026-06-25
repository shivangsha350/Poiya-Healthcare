import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ icon, image, name, desc, slug, _id }) {
  const displayImage = image && image !== '/uploads/default-product.png' ? `http://localhost:5000${image}` : null;

  return (
    <div className="border border-bordercol rounded-2xl p-6 bg-white transition hover:shadow-[0_8px_24px_rgba(0,100,160,0.1)] hover:border-accent2 hover:-translate-y-1 cursor-pointer h-full flex flex-col">
      <div className="w-[52px] h-[52px] rounded-[13px] bg-lightbg flex items-center justify-center mb-4 overflow-hidden border border-slate-100/80">
        {displayImage ? (
          <img src={displayImage} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="w-7 h-7 [&_svg]:w-7 [&_svg]:h-7 [&_svg]:stroke-mid [&_svg]:fill-none [&_svg]:stroke-[1.5]">
            {icon || (
              <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M9 17a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </span>
        )}
      </div>
      <div className="font-bold text-[15px] text-primary mb-2">{name}</div>
      <div className="text-[13px] text-textmuted leading-relaxed flex-grow">{desc}</div>
      <Link to={`/products/${slug}`} className="text-[13px] text-mid font-semibold mt-3 inline-block hover:underline">
        View Details →
      </Link>
    </div>
  );
}
