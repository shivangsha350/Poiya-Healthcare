"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "../Assets/Logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => pathname === path;

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/products", label: "Products" },
    { href: "/career", label: "Career" },
  ];

  return (
    <nav
      className={`bg-cyan-100 px-10 py-2 flex justify-between items-center sticky top-0 z-[100] transition-shadow ${scrolled
        ? "shadow-[0_4px_20px_rgba(0,100,160,0.13)]"
        : "shadow-[0_2px_12px_rgba(0,100,160,0.07)]"
        } max-md:px-5`}
    >
      <Link href="/" className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="Poiya Healthcare Logo"
          className="h-5 md:h-12 w-auto object-contain"
        />
        <span className="font-montserrat text-3xl font-extrabold text-primary">
          Poiya <span className="text-accent">Healthcare</span>
        </span>
      </Link>

      <button
        className="md:hidden flex flex-col gap-1.5 bg-transparent border-none cursor-pointer p-1"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span className="block w-6 h-0.5 bg-primary rounded" />
        <span className="block w-6 h-0.5 bg-primary rounded" />
        <span className="block w-6 h-0.5 bg-primary rounded" />
      </button>

      <ul
        className={`${menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-3 md:gap-6 list-none items-center
        md:static absolute top-[68px] left-0 right-0 bg-cyan-100 p-5 md:p-0 shadow-lg md:shadow-none`}
      >
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-1.5 md:py-0 border-b-2 transition ${isActive(href)
                ? "text-mid border-accent"
                : "text-textDark border-transparent hover:text-mid hover:border-accent"
                }`}
              style={{ color: isActive(href) ? undefined : "#0A2E52" }}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-cyan-500 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-cyan-800 transition inline-block"
          >
            Contact Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
