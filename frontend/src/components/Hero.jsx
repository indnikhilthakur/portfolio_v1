import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, MoveRight, MapPin } from "lucide-react";
import { profile } from "../data/mock";
import MagneticButton from "./effects/MagneticButton";
import CountUp from "./effects/CountUp";
import SplitText from "./effects/SplitText";
import HeroBackground from "./effects/HeroBackground"; // eslint-disable-line no-unused-vars
import SnowflakeLattice from "./effects/SnowflakeLattice";

const MARQUEE_TAGS = [
  "SNOWFLAKE",
  "// SNOWPARK",
  "// NATIVE APPS",
  "// PYTHON",
  "// DJANGO",
  "// CORTEX",
  "// RAG",
  "// LANGCHAIN",
  "// AWS",
  "// STREAMLIT",
];
// Pre-build duplicated list at module scope (used to create seamless marquee).
const MARQUEE_ITEMS = [
  ...MARQUEE_TAGS.map((t, i) => ({ key: `a-${i}`, t })),
  ...MARQUEE_TAGS.map((t, i) => ({ key: `b-${i}`, t })),
];

const Hero = () => {
  const codeRef = useRef(null);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const orbY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

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
      ref={sectionRef}
      id="top"
      className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16"
    >
      {/* Subtle grid base */}
      <div className="absolute inset-0 bg-grid mask-radial opacity-40" />

      {/* Active hero background — Option 1: pure Snowflake Data Lattice */}
      <SnowflakeLattice />
      {/* Alt: Hybrid Lattice + Particles. Swap by commenting line above and uncommenting below */}
      {/* <HeroBackground /> */}

      {/* Cyan glow orb */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        style={{
          y: orbY,
          background:
            "radial-gradient(circle at center, rgba(0,229,255,0.18), transparent 60%)",
          filter: "blur(20px)",
        }}
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full"
      />
      <motion.div
        aria-hidden
        style={{
          y: orbY2,
          background:
            "radial-gradient(circle at center, rgba(197,255,61,0.08), transparent 60%)",
          filter: "blur(30px)",
        }}
        className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full opacity-60"
      />

      <div className="noise" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full grid lg:grid-cols-12 gap-10 items-center">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="lg:col-span-7"
        >
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

          <h1 className="font-semibold tracking-tight leading-[0.95] text-[clamp(2.6rem,7.5vw,6.2rem)]">
            <SplitText
              as="span"
              text={profile.firstName}
              className="block text-white/95"
              stagger={0.04}
            />
            <span className="block text-white/40">
              <SplitText
                as="span"
                text={profile.lastName}
                className="inline-block"
                delay={0.18}
                stagger={0.04}
              />
              <span className="text-cyan-400 neon-text">.</span>
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="mt-6 max-w-xl text-white/70 text-lg leading-relaxed"
          >
            <span className="text-white/90">{profile.role}</span>
            <span className="text-white/40"> // </span>
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <MagneticButton strength={0.4}>
              <a href="#work" className="btn-neon" data-cursor="View">
                View Selected Work
                <ArrowDownRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
            <MagneticButton strength={0.4}>
              <a href="#contact" className="btn-ghost" data-cursor="Connect">
                Get in touch
                <MoveRight className="w-3.5 h-3.5" />
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>

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
                ~/nikhil — zsh
              </span>
            </div>
            <div className="p-5 font-mono text-[12.5px] leading-7 text-white/80">
              <p>
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">whoami</span>
              </p>
              <p className="text-white/60">
                founding engineer / snowflake native app builder
              </p>
              <p className="mt-3">
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">cat stack.json</span>
              </p>
              <p
                ref={codeRef}
                data-text='{ "data": ["snowflake", "snowpark", "cortex"], "backend": ["python", "django", "flask"], "ai": ["langchain", "rag", "tensorflow"] }'
                className="text-cyan-200/80 break-all"
              />
              <p className="mt-3">
                <span className="text-cyan-400">$</span>{" "}
                <span className="text-white">status</span>
              </p>
              <p className="text-emerald-300/90 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                building Flow @ Coridors · open to collabs
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
                <div className="mt-1 font-semibold text-white text-lg tabular-nums">
                  <CountUp value={s.value} />
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
