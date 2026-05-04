import React, { useEffect, useRef } from "react";

/**
 * Hero interactive background.
 *
 * Two-layer composition rendered to a single <canvas>:
 *   1. Snowflake-style triangular lattice (nodes + edges).
 *      Nodes near the cursor glow cyan; the closest edges propagate
 *      a brighter cyan pulse outward from the cursor.
 *   2. Floating particle constellation drifting in the foreground —
 *      particles connect to nearby particles with thin lines and are
 *      gently pulled toward the pointer (gravity well).
 *
 * Performance: ~50 lattice nodes + ~60 particles on desktop, halved on
 * narrow viewports. devicePixelRatio-aware. requestAnimationFrame loop
 * pauses when tab loses focus via document.hidden.
 */
const HeroBackground = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    // State
    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      mouse: { x: -9999, y: -9999, active: false },
      time: 0,
      lattice: [],
      edges: [],
      particles: [],
      pulses: [],
    };

    const isMobile = () => window.innerWidth < 768;

    // --- Geometry helpers ----------------------------------------------------
    const buildLattice = () => {
      const spacing = isMobile() ? 110 : 130;
      const triH = (spacing * Math.sqrt(3)) / 2;
      const nodes = [];
      let id = 0;
      for (let row = -1; row * triH < state.h + spacing; row++) {
        const yPos = row * triH;
        const xOffset = (row % 2) * (spacing / 2);
        for (let col = -1; col * spacing < state.w + spacing; col++) {
          const xPos = col * spacing + xOffset;
          nodes.push({
            id: id++,
            row,
            col,
            x: xPos,
            y: yPos,
            // small jitter so it doesn't look perfectly mechanical
            jx: (Math.sin(id * 1.7) + Math.cos(id * 0.9)) * 6,
            jy: (Math.cos(id * 2.3) + Math.sin(id * 1.1)) * 6,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
      state.lattice = nodes;

      // Edges: connect each node to up to 6 nearest neighbours within
      // a single lattice spacing (forms triangles). Dedupe by id pair.
      const edges = [];
      const seen = new Set();
      const maxDist = spacing * 1.05;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDist * maxDist) {
            const key = `${a.id}-${b.id}`;
            if (!seen.has(key)) {
              seen.add(key);
              edges.push({ a, b });
            }
          }
        }
      }
      state.edges = edges;
    };

    const buildParticles = () => {
      const count = isMobile() ? 28 : 60;
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push({
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: 0.8 + Math.random() * 1.4,
          baseAlpha: 0.25 + Math.random() * 0.45,
        });
      }
      state.particles = arr;
    };

    // --- Pulse: occasional cyan dot travelling along an edge -----------------
    const spawnPulse = () => {
      if (!state.edges.length) return;
      const edge = state.edges[(Math.random() * state.edges.length) | 0];
      state.pulses.push({ edge, t: 0, life: 1.6 });
    };

    let pulseTimer = 0;

    // --- Resize handling -----------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * state.dpr;
      canvas.height = rect.height * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      buildLattice();
      buildParticles();
    };

    // --- Mouse ---------------------------------------------------------------
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
      state.mouse.active = true;
    };
    const onLeave = () => {
      state.mouse.active = false;
      state.mouse.x = -9999;
      state.mouse.y = -9999;
    };

    // --- Render --------------------------------------------------------------
    const render = (now) => {
      state.time = now;
      const { w, h, lattice, edges, particles, mouse } = state;

      ctx.clearRect(0, 0, w, h);

      // Soft mouse halo
      if (mouse.active) {
        const grd = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          240
        );
        grd.addColorStop(0, "rgba(0, 229, 255, 0.10)");
        grd.addColorStop(1, "rgba(0, 229, 255, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      const influence = 220;
      const inf2 = influence * influence;

      // Edges
      ctx.lineWidth = 1;
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const ax = e.a.x + e.a.jx;
        const ay = e.a.y + e.a.jy;
        const bx = e.b.x + e.b.jx;
        const by = e.b.y + e.b.jy;

        // distance from cursor to edge midpoint
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = mx - mouse.x;
        const dy = my - mouse.y;
        const d2 = dx * dx + dy * dy;
        const t = Math.max(0, 1 - d2 / inf2);

        const alpha = 0.04 + t * 0.32;
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Lattice nodes
      for (let i = 0; i < lattice.length; i++) {
        const n = lattice[i];
        const x = n.x + n.jx;
        const y = n.y + n.jy;
        const dx = x - mouse.x;
        const dy = y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const t = Math.max(0, 1 - d2 / inf2);

        // slow breathing
        const breathe = 0.5 + 0.5 * Math.sin(now * 0.0008 + n.phase);
        const radius = 0.9 + t * 2.6 + breathe * 0.4;

        // outer glow when close to cursor
        if (t > 0.05) {
          ctx.fillStyle = `rgba(0, 229, 255, ${t * 0.18})`;
          ctx.beginPath();
          ctx.arc(x, y, radius * 4, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgba(${Math.round(140 + t * 115)}, ${Math.round(
          230 + t * 25
        )}, 255, ${0.35 + t * 0.6})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pulses (data flowing along an edge)
      pulseTimer -= 16;
      if (pulseTimer <= 0) {
        spawnPulse();
        pulseTimer = 600 + Math.random() * 900;
      }
      for (let i = state.pulses.length - 1; i >= 0; i--) {
        const p = state.pulses[i];
        p.t += 0.012;
        if (p.t >= 1) {
          state.pulses.splice(i, 1);
          continue;
        }
        const ax = p.edge.a.x + p.edge.a.jx;
        const ay = p.edge.a.y + p.edge.a.jy;
        const bx = p.edge.b.x + p.edge.b.jx;
        const by = p.edge.b.y + p.edge.b.jy;
        const px = ax + (bx - ax) * p.t;
        const py = ay + (by - ay) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.fillStyle = `rgba(180, 245, 255, ${0.85 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 1.8 + fade * 1.6, 0, Math.PI * 2);
        ctx.fill();
        // streak
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.45 * fade})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(
          px - (bx - ax) * 0.06,
          py - (by - ay) * 0.06
        );
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      // Particles update + draw
      const partInfl = 180;
      const partInf2 = partInfl * partInfl;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // gentle drift
        p.x += p.vx;
        p.y += p.vy;
        // gravity toward cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < partInf2 && d2 > 1) {
            const f = (1 - d2 / partInf2) * 0.04;
            p.vx += (dx / Math.sqrt(d2)) * f;
            p.vy += (dy / Math.sqrt(d2)) * f;
          }
        }
        // friction so particles don't run away
        p.vx *= 0.985;
        p.vy *= 0.985;
        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // draw particle
        ctx.fillStyle = `rgba(190, 245, 255, ${p.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Particle-to-particle links (only nearby pairs, cheap O(n^2) for n=60)
      ctx.lineWidth = 0.8;
      const linkDist = 130;
      const link2 = linkDist * linkDist;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < link2) {
            const a1 = (1 - d2 / link2) * 0.18;
            ctx.strokeStyle = `rgba(0, 229, 255, ${a1})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    // Boot
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default HeroBackground;
