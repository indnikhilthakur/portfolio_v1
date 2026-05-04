import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/mock";
import TiltCard from "./effects/TiltCard";
import MagneticButton from "./effects/MagneticButton";

const CARD_INITIAL = { opacity: 0, y: 22 };
const CARD_VISIBLE = { opacity: 1, y: 0 };
const CARD_VIEWPORT = { once: true, amount: 0.2 };

const Projects = () => {
  return (
    <section id="work" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="section-eyebrow">03 / Selected Work</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white max-w-2xl">
              Things I’ve built and shipped.
            </h2>
          </div>
          <MagneticButton strength={0.4}>
            <a href="#contact" className="btn-ghost self-start" data-cursor="Connect">
              Start a project
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </MagneticButton>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={CARD_INITIAL}
              whileInView={CARD_VISIBLE}
              viewport={CARD_VIEWPORT}
              transition={{ duration: 0.6, delay: (i % 2) * 0.08 }}
            >
              <TiltCard max={6} className="h-full">
                <a
                  href={p.href}
                  data-cursor="Open"
                  className="group relative block card-tile corner-brackets rounded-sm overflow-hidden h-full"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0e12]">
                    <img
                      src={p.image}
                  alt={p.title}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/40 to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-cyan-300 bg-[#08090b]/80 border border-cyan-400/30 px-2 py-1 rounded-sm">
                    {p.id.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-white/60 bg-[#08090b]/60 border border-white/10 px-2 py-1 rounded-sm">
                    {p.year}
                  </span>
                </div>
                <div className="absolute top-3 right-3 w-9 h-9 rounded-full border border-white/15 bg-[#08090b]/70 flex items-center justify-center text-white/60 group-hover:text-cyan-300 group-hover:border-cyan-300/60 group-hover:bg-cyan-400/10 transition">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

                <div className="p-5 md:p-6 border-t border-white/5">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight glitch">
                      {p.title}
                    </h3>
                    <span className="font-mono text-[10px] tracking-widest text-white/40 uppercase shrink-0">
                      {p.role}
                    </span>
                  </div>
                  <p className="mt-2 text-white/60 text-sm leading-relaxed">
                    {p.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10.5px] tracking-wide px-2 py-1 border border-white/10 text-white/65 rounded-sm bg-white/[0.02]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                </a>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
