import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send, Github, Linkedin, Mail, Copy, Check, Phone } from "lucide-react";
import { profile } from "../data/mock";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("All fields are required");
      return;
    }
    setSending(true);
    // Mock send. Persist to localStorage so user sees it works.
    await new Promise((r) => setTimeout(r, 900));
    const stored = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    stored.push({ ...form, ts: new Date().toISOString() });
    localStorage.setItem("contact_messages", JSON.stringify(stored));
    setSending(false);
    setForm({ name: "", email: "", message: "" });
    toast.success("Message transmitted. I’ll reply soon.");
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(profile.email);
    setCopied(true);
    toast.success("Email copied");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section id="contact" className="relative py-28 md:py-36 border-t border-white/5 overflow-hidden">
      <div
        aria-hidden
        className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,229,255,0.18), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <span className="section-eyebrow">05 / Contact</span>
          <h2 className="mt-4 text-4xl md:text-6xl font-semibold tracking-tight leading-[0.95] text-white">
            Let’s build
            <br />
            <span className="text-cyan-300 neon-text">something</span> good.
          </h2>
          <p className="mt-6 text-white/60 max-w-md leading-relaxed">
            Open to staff/lead engineering roles, founding-team gigs, and select
            consulting. The fastest way to reach me is the form — or just an
            old-fashioned email.
          </p>

          <div className="mt-8 space-y-3">
            <button
              onClick={copyEmail}
              className="group w-full flex items-center justify-between px-4 py-4 border border-white/10 hover:border-cyan-400/40 bg-white/[0.02] hover:bg-cyan-400/[0.04] rounded-sm transition"
            >
              <span className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-cyan-300" />
                <span className="font-mono text-sm text-white/85 group-hover:text-white">
                  {profile.email}
                </span>
              </span>
              {copied ? (
                <Check className="w-4 h-4 text-cyan-300" />
              ) : (
                <Copy className="w-4 h-4 text-white/40 group-hover:text-cyan-300 transition" />
              )}
            </button>

            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: Github, href: profile.socials.github, label: "GitHub" },
                { Icon: Linkedin, href: profile.socials.linkedin, label: "LinkedIn" },
                { Icon: Phone, href: `tel:${profile.phone.replace(/\s/g, "")}`, label: "Phone" },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-3 border border-white/10 hover:border-cyan-400/40 bg-white/[0.02] hover:bg-cyan-400/[0.04] rounded-sm transition group"
                >
                  <Icon className="w-4 h-4 text-white/60 group-hover:text-cyan-300 transition" />
                  <span className="font-mono text-[11px] tracking-widest uppercase text-white/55 group-hover:text-white transition">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative card-tile corner-brackets rounded-sm p-6 md:p-8 bg-[#0a0c10]"
          >
            <div className="flex items-center justify-between mb-6">
              <span className="font-mono text-[10px] tracking-widest uppercase text-white/40">
                ./transmit_message.sh
              </span>
              <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-dot" />
                secure
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Name" name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@domain.com" />
            </div>
            <div className="mt-4">
              <label className="block font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                placeholder="Tell me about your project, role, or idea..."
                className="w-full bg-[#08090b] border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none rounded-sm px-4 py-3 text-white placeholder:text-white/30 font-mono text-sm resize-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={sending}
              className="mt-6 btn-neon w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" />
                  Transmitting...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Message
                </>
              )}
            </button>

            <p className="mt-4 font-mono text-[10px] tracking-widest text-white/30 uppercase text-center">
              avg. response time · under 24h
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

const Field = ({ label, name, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block font-mono text-[10px] tracking-widest uppercase text-white/40 mb-2">
      {label}
    </label>
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-[#08090b] border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none rounded-sm px-4 py-3 text-white placeholder:text-white/30 font-mono text-sm transition"
    />
  </div>
);

export default Contact;
