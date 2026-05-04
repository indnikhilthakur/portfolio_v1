import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowDownRight, MoveRight, MapPin } from "lucide-react";
import { profile } from "../data/mock";

const MARQUEE_TAGS = [
  "REACT",
  "// TYPESCRIPT",
  "// FRAMER MOTION",
  "// FASTAPI",
  "// POSTGRES",
  "// AWS",
  "// DESIGN SYSTEMS",
  "// REALTIME",
  "// WEBGL",
  "// PERFORMANCE",
];
// Pre-build duplicated list at module scope (used to create seamless marquee).
const MARQUEE_ITEMS = [
  ...MARQUEE_TAGS.map((t, i) => ({ key: `a-${i}`, t })),
  ...MARQUEE_TAGS.map((t, i) => ({ key: `b-${i}`, t })),
];

const Hero = () => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (!codeRef.current) return;
    const text = codeRef.current.dataset.text || "";
    let i = 0;
    codeRef.current.textContent = "";
    const id = setInterval(() => {
      if (!codeRef.current) return;
      codeRef.current.textContent = text.slice(0, i);
      i++;
      if (i > text.length) clearInterval(id);
    }, 22);
    return () => clearInterval(id);
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Grid background with vignette */}
      <div className="absolute inset-0 bg-grid mask-radial opacity-80" />

      {/* Cyan glow orb */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(0,229,255,0.18), transparent 60%)",
          filter: "blur(20px)",
        }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle at center, rgba(197,255,61,0.08), transparent 60%)",
          filter: "blur(30px)",
        }}
      />

      <div className="noise" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="section-eyebrow">SYS / PORTFOLIO_v2.5</span>
            <span className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-white/40 ml-2">
              <MapPin className="w-3 h-3" />
              {profile.location}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 }}
            className="font-semibold tracking-tight leading-[0.95] text-[clamp(2.6rem,7.5vw,6.2rem)]"
          >
            <span className="block text-white/95">{profile.name.split(" ")[0]}</span>
            <span className="block text-white/40">
              {profile.name.split(" ")[1]}
              <span className="text-cyan-400 neon-text">.</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-xl text-white/70 text-lg leading-relaxed"
          >
            <span className="text-white/90">{profile.role}</span>
            <span className="text-white/40"> // </span>
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <a href="#work" className="btn-neon">
              View Selected Work
              <ArrowDownRight className="w-3.5 h-3.5" />
            </a>
            <a href="#contact" className="btn-ghost">
              Get in touch
              <MoveRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        </div>

        {/* Right: Terminal card */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="lg:col-span-5"
        >
          <div className="relative card-tile corner-brackets rounded-sm overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/70" />
              <span className="ml-3 font-mono text-[10px] tracking-widest text-white/40">
                ~/alex — zsh
              </span>
            </div>
            <div className="p-5 font-mono text-[12.5px] leading-7 text-white/80">
              <p>
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">whoami</span>
              </p>
              <p className="text-white/60">
                engineer / designer / pragmatist
              </p>
              <p className="mt-3">
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">cat stack.json</span>
              </p>
              <p
                ref={codeRef}
                data-text='{ "frontend": ["react", "next", "motion"], "backend": ["node", "python", "postgres"], "infra": ["vercel", "aws"] }'
                className="text-cyan-200/80 break-all"
              />
              <p className="mt-3">
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">status</span>
              </p>
              <p className="text-emerald-300/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                open to select roles & collaborations
              </p>
              <p className="mt-3">
                <span className="text-cyan-400">$</span> <span className="animate-pulse">_</span>
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="mt-4 grid grid-cols-4 border border-white/5 divide-x divide-white/5 bg-white/[0.015]">
            {profile.stats.map((s) => (
              <div key={s.label} className="px-3 py-3">
                <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                  {s.label}
                </div>
                <div className="mt-1 font-semibold text-white text-lg">
                  {s.value}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-[#08090b]/80 overflow-hidden">
        <div className="marquee py-3 font-mono text-[11px] tracking-[0.3em] uppercase text-white/30">
          {MARQUEE_ITEMS.map((m) => (
            <span key={m.key} className="shrink-0">
              {m.t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
