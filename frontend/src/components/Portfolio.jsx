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
import BootSequence from "./effects/BootSequence";
import SmartCursor from "./effects/SmartCursor";
import SectionRail from "./effects/SectionRail";

const Portfolio = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.4,
  });

  const [booted, setBooted] = useState(
    typeof window !== "undefined" && !!sessionStorage.getItem("boot_seen")
  );

  // Hide native cursor while SmartCursor is active (desktop only)
  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) {
      document.documentElement.classList.add("custom-cursor-on");
    }
    return () =>
      document.documentElement.classList.remove("custom-cursor-on");
  }, []);

  return (
    <div className="relative bg-[#08090b] text-white selection:bg-cyan-400 selection:text-[#06121a]">
      <BootSequence onDone={() => setBooted(true)} />

      {/* Top progress bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-cyan-400 origin-left z-[60]"
      />

      <SmartCursor />
      <SectionRail />

      <Navbar />
      <main
        className="relative"
        style={{
          opacity: booted ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s",
        }}
      >
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
