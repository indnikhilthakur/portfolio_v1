import React, { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Skills from "./Skills";
import Projects from "./Projects";
import Experience from "./Experience";
import Contact from "./Contact";
import Footer from "./Footer";

const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  // Custom cursor (desktop only)
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(isFinePointer);
    if (!isFinePointer) return;

    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div className="relative bg-[#08090b] text-white selection:bg-cyan-400 selection:text-[#06121a]">
      {/* Top progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan-400 origin-left z-[60]"
      />

      {/* Custom cursor */}
      {enabled && (
        <>
          <motion.div
            aria-hidden
            animate={{ x: pos.x - 14, y: pos.y - 14 }}
            transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.4 }}
            className="hidden md:block fixed top-0 left-0 w-7 h-7 rounded-full border border-cyan-300/70 pointer-events-none z-[70] mix-blend-difference"
          />
          <motion.div
            aria-hidden
            animate={{ x: pos.x - 2, y: pos.y - 2 }}
            transition={{ type: "spring", stiffness: 600, damping: 28 }}
            className="hidden md:block fixed top-0 left-0 w-1 h-1 rounded-full bg-cyan-300 pointer-events-none z-[70]"
          />
        </>
      )}

      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Portfolio;
