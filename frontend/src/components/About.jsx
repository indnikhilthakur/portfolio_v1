import React from "react";
import { motion } from "framer-motion";
import { profile } from "../data/mock";
import { Sparkles } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="relative py-28 md:py-36">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="grid lg:grid-cols-12 gap-10"
        >
          <div className="lg:col-span-4">
            <span className="section-eyebrow">01 / About</span>
            <h2 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-white">
              Building at the seam of
              <span className="text-cyan-300"> design</span> and
              <span className="text-cyan-300"> systems</span>.
            </h2>
            <div className="mt-8 inline-flex items-center gap-2 px-3 py-1.5 border border-cyan-400/30 bg-cyan-400/5 rounded-full font-mono text-[10px] tracking-[0.2em] uppercase text-cyan-200">
              <Sparkles className="w-3 h-3" />
              {profile.role}
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="space-y-6 text-lg leading-relaxed text-white/70">
              {profile.about.map((p, i) => (
                <motion.p
                  key={p.slice(0, 24)}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {p}
                </motion.p>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/5 border border-white/5"
            >
              {[
                { k: "Currently", v: "Staff @ Northwind" },
                { k: "Timezone", v: "CET / UTC+1" },
                { k: "Languages", v: "EN / DE" },
                { k: "Side bets", v: "OSS, audio tools" },
                { k: "Reading", v: "Designing Data-Intensive Apps" },
                { k: "Listening", v: "Synthwave, ambient" },
              ].map((row) => (
                <div
                  key={row.k}
                  className="bg-[#0b0d11] px-4 py-4"
                >
                  <div className="font-mono text-[10px] tracking-widest text-white/40 uppercase">
                    {row.k}
                  </div>
                  <div className="mt-1 text-white/85 text-sm">{row.v}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
