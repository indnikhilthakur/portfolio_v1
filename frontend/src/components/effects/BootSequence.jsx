import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINES = [
  "// boot sequence v2.5 ............ ok",
  "// loading kernel modules ........ ok",
  "// mounting /portfolio ........... ok",
  "// establishing secure channel ... ok",
  "// initialising motion runtime ... ok",
  "// handing off to ui ............. ok",
];

const BootSequence = ({ onDone }) => {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("boot_seen")) {
        setVisible(false);
        if (onDone) onDone();
        return;
      }
    } catch (e) {}

    const stepTimer = setInterval(() => {
      setStep((s) => {
        if (s >= LINES.length) {
          clearInterval(stepTimer);
          return s;
        }
        return s + 1;
      });
    }, 180);
    const exitTimer = setTimeout(() => {
      try {
        sessionStorage.setItem("boot_seen", "1");
      } catch (e) {}
      setVisible(false);
      if (onDone) onDone();
    }, 1700);
    return () => {
      clearInterval(stepTimer);
      clearTimeout(exitTimer);
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="boot"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-[100] bg-[#06070a] flex items-center justify-center overflow-hidden"
        >
          {/* Sweep beam */}
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: "100%" }}
            transition={{ duration: 1.6, ease: "linear" }}
            className="absolute left-0 right-0 h-40 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(0,229,255,0.12), transparent)",
            }}
          />
          <div className="absolute inset-0 bg-grid-dense opacity-30 mask-radial pointer-events-none" />

          <div className="relative w-[min(680px,90vw)] font-mono text-[12.5px] leading-7 text-white/80">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
              <span className="text-cyan-300 tracking-[0.3em] uppercase">
                NIKHIL.THAKUR // PORTFOLIO
              </span>
            </div>
            {LINES.slice(0, step).map((l, i) => (
              <motion.div
                key={l}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex justify-between"
              >
                <span className="text-white/70">
                  <span className="text-cyan-400 mr-2">$</span>
                  {l.replace("... ok", "...").replace(".. ok", "..").split("ok")[0]}
                </span>
                <span className="text-emerald-300/80">[ OK ]</span>
              </motion.div>
            ))}
            <div className="mt-2 flex items-center gap-2 text-cyan-300">
              <span>$</span>
              <span className="animate-pulse">_</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
