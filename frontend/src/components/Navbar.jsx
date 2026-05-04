import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Terminal } from "lucide-react";
import { navLinks } from "../data/mock";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#about");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = navLinks.map((l) => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-[#08090b]/70 border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-sm border border-cyan-400/40 flex items-center justify-center bg-cyan-400/5 group-hover:bg-cyan-400/15 transition">
            <Terminal className="w-3.5 h-3.5 text-cyan-300" strokeWidth={2} />
          </span>
          <span className="font-mono text-xs tracking-[0.2em] text-white/80 group-hover:text-white transition">
            NIKHIL.THAKUR
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className="relative px-3 py-2 font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 hover:text-white transition"
            >
              <span className="text-cyan-400/60 mr-1.5">0{i + 1}.</span>
              {l.label}
              {active === l.href && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute left-3 right-3 -bottom-0.5 h-px bg-cyan-400"
                />
              )}
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          className="hidden md:inline-flex btn-neon"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
          Available
        </a>

        <button
          aria-label="Toggle menu"
          className="md:hidden p-2 text-white/80"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-[#0a0b0e]/95 backdrop-blur"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((l, i) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="py-3 font-mono text-xs tracking-[0.2em] uppercase text-white/70 hover:text-cyan-300 transition"
                >
                  <span className="text-cyan-400/60 mr-2">0{i + 1}.</span>
                  {l.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 btn-neon justify-center"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                Available
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
