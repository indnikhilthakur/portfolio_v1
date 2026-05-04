import React, { useEffect, useState } from "react";
import { ArrowUp, Github, Linkedin, Twitter } from "lucide-react";
import { profile } from "../data/mock";

const Footer = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTime(t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer className="relative border-t border-white/5 bg-[#06070a]">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-cyan-300/80 uppercase mb-2">
              END_OF_LINE
            </div>
            <div className="text-white text-2xl font-medium tracking-tight">
              {profile.name}
            </div>
            <div className="text-white/40 text-sm font-mono mt-1">
              {profile.role} · {profile.location}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[
              { Icon: Github, href: profile.socials.github },
              { Icon: Linkedin, href: profile.socials.linkedin },
              { Icon: Twitter, href: profile.socials.x },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-sm border border-white/10 hover:border-cyan-400/40 bg-white/[0.02] hover:bg-cyan-400/[0.06] flex items-center justify-center text-white/60 hover:text-cyan-300 transition"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
            <a
              href="#top"
              className="ml-2 w-10 h-10 rounded-sm border border-cyan-400/30 bg-cyan-400/5 hover:bg-cyan-400/15 flex items-center justify-center text-cyan-300 transition"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="font-mono text-[10.5px] tracking-widest text-white/30 uppercase">
            © {new Date().getFullYear()} {profile.name}. Built with React + Framer Motion.
          </div>
          <div className="flex items-center gap-3 font-mono text-[10.5px] tracking-widest text-white/30 uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
              SYS_ONLINE
            </span>
            <span className="text-white/20">|</span>
            <span>BER {time}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
