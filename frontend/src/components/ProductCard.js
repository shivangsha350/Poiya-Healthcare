import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ icon, image, name, slug, _id, index = 0 }) {
  const displayImage = image && image !== '/uploads/default-product.png' ? `http://localhost:5000${image}` : null;

  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const tint = index % 2 === 0 ? 'bg-sky-50' : 'bg-emerald-50';

  return (
    <div
      ref={cardRef}
      style={{ transitionDelay: isVisible ? `${index * 60}ms` : '0ms' }}
      className={`group relative rounded-2xl border border-bordercol bg-white overflow-hidden
                  transition-all duration-700 ease-out
                  hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_20px_48px_rgba(0,100,160,0.18)] hover:border-accent2
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {/* Image area — fixed height so it doesn't balloon on wide columns */}
      <div className={`relative w-full h-44 ${tint} overflow-hidden flex items-center justify-center`}>

        {displayImage ? (
          <img
            src={displayImage}
            alt={name}
            loading="lazy"
            className="max-w-full max-h-full object-contain p-2
                       transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="relative z-10 w-10 h-10 [&_svg]:w-10 [&_svg]:h-10 [&_svg]:stroke-mid [&_svg]:fill-none [&_svg]:stroke-[1.4]
                            transition-transform duration-500 ease-out group-hover:scale-110">
            {icon || (
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M9 17a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </span>
        )}

        {/* Gradient wash on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>

      {/* Label */}
      <div className="px-4 pt-4 pb-3 text-center">
        <h3 className="font-bold text-[15px] text-primary leading-snug line-clamp-2">
          {name}
        </h3>
      </div>

      {/* View Details button */}
      <div className="px-4 pb-4">
        <Link
          to={`/products/${slug}`}
          className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-bordercol
                     py-2.5 text-[13px] font-semibold text-mid
                     transition-all duration-300 ease-out
                     group-hover:bg-accent2 group-hover:border-accent2 group-hover:text-white"
        >
          View Details
          <svg
            viewBox="0 0 24 24"
            className="w-3.5 h-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
            fill="none"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* Glowing ring highlight on hover */}
      <div className="absolute inset-0 rounded-2xl ring-2 ring-accent2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
