import React from "react";
import { motion } from "framer-motion";
import { experience } from "../data/mock";
import { CornerDownRight } from "lucide-react";

const Experience = () => {
  return (
    <section id="path" className="relative py-28 md:py-36 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="mb-14">
          <span className="section-eyebrow">04 / Path</span>
          <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white max-w-2xl">
            A short trace of where I’ve been.
          </h2>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <span className="absolute left-3 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent" />

          <ul className="space-y-10">
            {experience.map((e, idx) => (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative pl-12 md:pl-16"
              >
                <span className="absolute left-0 top-2 w-7 h-7 md:w-9 md:h-9 rounded-sm border border-cyan-400/30 bg-[#0c0e12] flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                </span>

                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-white text-xl md:text-2xl font-medium tracking-tight">
                    {e.role}
                  </h3>
                  <span className="text-cyan-300 font-mono text-xs tracking-widest uppercase">
                    @ {e.company}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[11px] tracking-widest text-white/40 uppercase">
                  {e.period} · {e.location}
                </div>
                <ul className="mt-4 space-y-2">
                  {e.bullets.map((b, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-white/65 leading-relaxed"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 mt-1.5 text-cyan-400/60 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Experience;
