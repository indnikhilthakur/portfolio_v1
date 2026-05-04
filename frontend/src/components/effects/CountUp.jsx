import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/**
 * Animates a numeric value from 0 to `value` once the element enters the viewport.
 * Falls back gracefully for non-numeric values (just renders them as-is).
 */
const CountUp = ({ value, duration = 1200, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [display, setDisplay] = useState("0");

  // Parse the numeric portion (handles "04+", "3.1K", "02", etc.)
  const match = String(value).match(/^([0-9.]+)([a-zA-Z+%]*)$/);
  const isNumeric = !!match;
  const numericTarget = isNumeric ? parseFloat(match[1]) : 0;
  const trailing = isNumeric ? match[2] : "";
  const padLen = isNumeric ? match[1].split(".")[0].length : 0;

  useEffect(() => {
    if (!inView) return;
    if (!isNumeric) {
      setDisplay(value);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = numericTarget * eased;
      const intPart = match[1].includes(".") ? cur.toFixed(1) : Math.round(cur).toString();
      setDisplay(intPart.padStart(padLen, "0") + trailing);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, isNumeric, numericTarget, trailing, padLen, match]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
