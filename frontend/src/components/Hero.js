"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import Hero1 from "../Assets/Hero section/Hero1.jpg";
import Hero2 from "../Assets/Hero section/Hero2.jpg";
import Hero3 from "../Assets/Hero section/Hero3.jpg";
import Hero4 from "../Assets/Hero section/Hero4.jpg";

const SLIDES = [Hero1, Hero2, Hero3, Hero4];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[680px] flex items-center px-10 py-[70px] max-md:flex-col max-md:text-center max-md:px-5 max-md:py-12">

      {/* ── BACKGROUND SLIDER ── */}
      {SLIDES.map((src, i) => (
        <img
          key={i}
          src={src.src || src}
          alt={`slide-${i + 1}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {/* Dark overlay */}
<div
  className="absolute inset-0 z-[1] bg-gradient-to-r
    from-[#071e33]/95
    via-[#071e33]/60
    to-transparent"
/>     

{/* Decorative blur circle */}
      <div className="absolute -right-20 -top-20 w-[500px] h-[500px] rounded-full bg-accent/[0.08] pointer-events-none z-[2]" />

      {/* ── TEXT CONTENT ── */}
      <div className="relative z-10 max-w-[560px]">
        <div className="inline-block bg-accent/[0.18] text-accent3 text-xs font-semibold tracking-[1.5px] uppercase px-4 py-1.5 rounded-full mb-5">
          🏥 Make in India Initiative
        </div>
        <h1 className="font-display text-[46px] max-md:text-[32px] font-extrabold text-white leading-[1.15] mb-4.5">
          Advanced Radiology, Nephrology &amp;
          <br />
          <span className="text-accent">Oncology Solutions</span>
        </h1>
        <p className="text-base text-[#B0D8ED] leading-relaxed mb-8">
          Delivering cutting-edge, affordable Medical Equipments to hospitals and diagnostic centers across India and beyond.
        </p>
        <div className="flex gap-3.5 flex-wrap mb-10 max-md:justify-center">
          <Link
            href="/products"
            className="bg-cta text-white px-7 py-3 rounded-[9px] font-semibold text-sm hover:bg-ctadark hover:-translate-y-0.5 transition inline-block"
          >
            Explore Products
          </Link>
          <Link
            href="/contact"
            className="bg-transparent text-white px-7 py-3 rounded-[9px] font-semibold text-sm border-2 border-white/35 hover:bg-white/10 transition inline-block"
          >
            Request a Demo
          </Link>
        </div>
        <div className="flex gap-8 max-md:justify-center">
          <div>
            <div className="font-display text-2xl font-extrabold text-accent">1500+</div>
            <div className="text-xs text-[#90CAE0] uppercase tracking-wide">Installations</div>
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold text-accent">17+</div>
            <div className="text-xs text-[#90CAE0] uppercase tracking-wide">Years Experience</div>
          </div>
          <div>
            <div className="font-display text-2xl font-extrabold text-accent">10+</div>
            <div className="text-xs text-[#90CAE0] uppercase tracking-wide">Awards Won</div>
          </div>
        </div>
      </div>

      {/* ── DOT INDICATORS ── */}
      {/* <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 h-2.5 bg-accent"
                : "w-2.5 h-2.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div> */}

    </section>
  );
}