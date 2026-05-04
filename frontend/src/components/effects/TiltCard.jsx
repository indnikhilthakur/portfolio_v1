import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/**
 * 3D-tilt card. Tilts on the X/Y axes following the cursor, with a soft spring.
 * Wrap any element that should respond to mouse parallax.
 */
const TiltCard = ({ children, max = 8, className = "", glare = true, ...rest }) => {
  const ref = useRef(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);

  const srx = useSpring(rx, { stiffness: 180, damping: 14 });
  const sry = useSpring(ry, { stiffness: 180, damping: 14 });

  const transform = useTransform(
    [srx, sry],
    ([a, b]) => `perspective(900px) rotateX(${a}deg) rotateY(${b}deg)`
  );
  const glareBg = useTransform(
    [gx, gy],
    ([a, b]) =>
      `radial-gradient(circle at ${a}% ${b}%, rgba(0,229,255,0.18), transparent 50%)`
  );

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * max * 2);
    ry.set((px - 0.5) * max * 2);
    gx.set(px * 100);
    gy.set(py * 100);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transform, transformStyle: "preserve-3d" }}
      className={`relative will-change-transform ${className}`}
      {...rest}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          style={{ background: glareBg }}
          className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 mix-blend-screen"
        />
      )}
    </motion.div>
  );
};

export default TiltCard;
