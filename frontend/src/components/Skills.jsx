import React from "react";
import { motion } from "framer-motion";
import { skills } from "../data/mock";

const TILE_INITIAL = { opacity: 0, y: 16 };
const TILE_VISIBLE = { opacity: 1, y: 0 };
const TILE_VIEWPORT = { once: true, amount: 0.3 };

const Skills = () => {
  return (
    <section id="skills" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="absolute inset-0 bg-grid-dense opacity-[0.35] mask-radial pointer-events-none" />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div>
            <span className="section-eyebrow">02 / Stack</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white max-w-2xl">
              The tools I reach for, daily.
            </h2>
          </div>
          <p className="text-white/55 max-w-md">
            Pragmatic over trendy. I optimise for clarity, performance, and
            shipping — in that order.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5">
          {skills.map((s, idx) => (
            <motion.div
              key={s.group}
              initial={TILE_INITIAL}
              whileInView={TILE_VISIBLE}
              viewport={TILE_VIEWPORT}
              transition={{ duration: 0.5, delay: idx * 0.06 }}
              className="relative bg-[#0a0c10] p-6 group hover:bg-[#0d1015] transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-widest text-cyan-300/80 uppercase">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] tracking-widest text-white/30 uppercase">
                  {s.group}
                </span>
              </div>
              <h3 className="mt-6 text-white text-2xl font-medium tracking-tight">
                {s.group}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {s.items.map((i) => (
                  <li
                    key={i}
                    className="font-mono text-[11px] tracking-wide px-2 py-1 border border-white/10 text-white/75 rounded-sm bg-white/[0.02] group-hover:border-cyan-400/30 group-hover:text-white transition"
                  >
                    {i}
                  </li>
                ))}
              </ul>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-cyan-400 group-hover:w-full transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
