import React, { useEffect, useRef, useState } from 'react';

const stats = [
  { num: 1500, suffix: '+', label: 'Installations' },
  { num: 16, suffix: '+', label: 'Years Experience' },
  { num: 20, suffix: '+', label: 'Employees' },
  { num: 10, suffix: '+', label: 'Awards Won' },
];

function useCountUp(target, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ num, suffix, label, start }) {
  const count = useCountUp(num, 1600, start);
  return (
    <div className="text-white text-center">
      <div className="font-display text-3xl sm:text-4xl md:text-[48px] font-extrabold leading-none">
        {count}
        <span className="text-2xl sm:text-3xl text-accent2">{suffix}</span>
      </div>
      <div className="text-[11px] sm:text-[13px] text-[#90D0E8] uppercase tracking-wide mt-2">{label}</div>
    </div>
  );
}

export default function StatsBand() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="bg-gradient-to-br from-mid to-primary px-5 sm:px-10 py-12 md:py-[60px]" ref={ref}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-[900px] mx-auto">
        {stats.map((s, i) => (
          <StatItem key={i} {...s} start={started} />
        ))}
      </div>
    </div>
  );
}
