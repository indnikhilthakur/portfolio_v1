import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "top", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Stack" },
  { id: "work", label: "Work" },
  { id: "path", label: "Path" },
  { id: "contact", label: "Contact" },
];

const SectionRail = () => {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-3">
      {SECTIONS.map((s) => {
        const isActive = s.id === active;
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="group flex items-center gap-3 justify-end"
            data-cursor={s.label}
          >
            <motion.span
              animate={{
                opacity: isActive ? 1 : 0,
                x: isActive ? 0 : 6,
              }}
              transition={{ duration: 0.2 }}
              className="font-mono text-[10px] tracking-[0.25em] uppercase text-cyan-300"
            >
              {s.label}
            </motion.span>
            <motion.span
              animate={{
                width: isActive ? 28 : 14,
                backgroundColor: isActive
                  ? "rgba(0, 229, 255, 1)"
                  : "rgba(255, 255, 255, 0.18)",
              }}
              transition={{ duration: 0.25 }}
              className="h-px block"
            />
          </a>
        );
      })}
    </div>
  );
};

export default SectionRail;
