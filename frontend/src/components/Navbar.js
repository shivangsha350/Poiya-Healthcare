import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../Assets/Logo.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/products", label: "Products" },
    { to: "/career", label: "Career" },
  ];

  return (
    <nav
      className={`bg-cyan-50 px-10 py-2 flex justify-between items-center sticky top-0 z-[100] transition-shadow ${
        scrolled
          ? "shadow-[0_4px_20px_rgba(0,100,160,0.13)]"
          : "shadow-[0_2px_12px_rgba(0,100,160,0.07)]"
      } max-md:px-5`}
    >
      <Link to="/" className="flex items-center gap-2.5">
        <img
          src={logo}
          alt="MediVision Logo"
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
        className={`${
          menuOpen ? "flex" : "hidden"
        } md:flex flex-col md:flex-row gap-3 md:gap-6 list-none items-center
        md:static absolute top-[68px] left-0 right-0 bg-cyan-50 p-5 md:p-0 shadow-lg md:shadow-none`}
      >
        {links.map(({ to, label }) => (
          <li key={to}>
            <Link
              to={to}
              onClick={() => setMenuOpen(false)}
              className={`text-sm font-medium py-1.5 md:py-0 border-b-2 transition ${
                isActive(to)
                  ? "text-mid border-accent"
                  : "text-textDark border-transparent hover:text-mid hover:border-accent"
              }`}
              style={{ color: isActive(to) ? undefined : "#0A2E52" }}
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="bg-cta text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-ctadark transition inline-block"
          >
            Contact Us
          </Link>
        </li>
      </ul>
    </nav>
  );
}
