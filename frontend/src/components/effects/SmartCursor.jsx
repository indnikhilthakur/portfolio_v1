import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/**
 * Smart magnetic cursor. Listens for elements with [data-cursor="..."] and
 * displays a contextual label + scales the ring appropriately.
 */
const SmartCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 350, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 350, damping: 28, mass: 0.4 });

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFine);
    if (!isFine) return;

    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest("[data-cursor]");
      if (target) {
        setHovering(true);
        setLabel(target.getAttribute("data-cursor") || "");
      } else {
        setHovering(false);
        setLabel("");
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        aria-hidden
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: hovering ? 2.3 : 1,
          backgroundColor: hovering
            ? "rgba(0, 229, 255, 0.12)"
            : "rgba(0, 229, 255, 0)",
          borderColor: hovering
            ? "rgba(0, 229, 255, 0.7)"
            : "rgba(0, 229, 255, 0.55)",
        }}
        transition={{ duration: 0.18 }}
        className="hidden md:block fixed top-0 left-0 w-7 h-7 rounded-full border pointer-events-none z-[80]"
      />
      {/* Inner dot */}
      <motion.div
        aria-hidden
        style={{
          x: x,
          y: y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: hovering ? 0 : 1 }}
        className="hidden md:block fixed top-0 left-0 w-1 h-1 rounded-full bg-cyan-300 pointer-events-none z-[80]"
      />
      {/* Floating label */}
      <AnimatePresence>
        {hovering && label && (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={{
              x: sx,
              y: sy,
              translateX: "50%",
              translateY: "50%",
            }}
            className="hidden md:block fixed top-0 left-0 pointer-events-none z-[80] ml-3 mt-3 px-2.5 py-1 bg-cyan-400 text-[#06121a] font-mono text-[10px] tracking-[0.2em] uppercase rounded-sm"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SmartCursor;
