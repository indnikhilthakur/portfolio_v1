import React, { useEffect, useRef } from "react";

/**
 * Snowflake Data Lattice — option 1, fully on-brand for a Snowflake-Native-App engineer.
 *
 * Each lattice node is a literal 6-pointed snowflake (six radial arms with
 * small branches). Nodes live on a hexagonal grid so connections form
 * perfect hex cells. The whole structure breathes; cursor proximity:
 *   - rotates and scales nearby snowflakes
 *   - brightens edges in concentric rings out from the pointer
 *   - spawns occasional cyan "data" pulses that travel along edges
 *
 * Single canvas, devicePixelRatio aware, halved on mobile.
 */
const SnowflakeLattice = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });

    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      mouse: { x: -9999, y: -9999, active: false },
      nodes: [],
      edges: [],
      pulses: [],
    };

    const isMobile = () => window.innerWidth < 768;

    // ---- Build hexagonal lattice -------------------------------------------
    const buildLattice = () => {
      const spacing = isMobile() ? 110 : 140;
      const rowH = (spacing * Math.sqrt(3)) / 2;
      const nodes = [];
      let id = 0;
      for (let row = -1; row * rowH < state.h + spacing; row++) {
        const yPos = row * rowH;
        const xOffset = (row % 2) * (spacing / 2);
        for (let col = -1; col * spacing < state.w + spacing; col++) {
          const xPos = col * spacing + xOffset;
          nodes.push({
            id: id++,
            x: xPos,
            y: yPos,
            rotPhase: Math.random() * Math.PI * 2,
            bobPhase: Math.random() * Math.PI * 2,
            baseSize: 8 + Math.random() * 3,
          });
        }
      }
      state.nodes = nodes;

      // Edges between nearest neighbours within ~spacing distance.
      const edges = [];
      const seen = new Set();
      const maxDist = spacing * 1.05;
      const maxD2 = maxDist * maxDist;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2) {
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

    // ---- Snowflake drawing primitive ---------------------------------------
    const drawSnowflake = (x, y, size, rotation, alpha, glow) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Optional glow halo when very close to cursor
      if (glow > 0.05) {
        ctx.fillStyle = `rgba(0, 229, 255, ${glow * 0.18})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = `rgba(${Math.round(140 + glow * 115)}, ${Math.round(
        225 + glow * 30
      )}, 255, ${alpha})`;
      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      // Six radial arms with small chevron branches at 0.55 of arm length
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        // main arm
        ctx.moveTo(0, 0);
        ctx.lineTo(size, 0);
        // branches
        const bx = size * 0.55;
        const by = size * 0.22;
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + by, by);
        ctx.moveTo(bx, 0);
        ctx.lineTo(bx + by, -by);
        // tiny outer notches
        ctx.moveTo(size * 0.85, 0);
        ctx.lineTo(size * 0.95, by * 0.45);
        ctx.moveTo(size * 0.85, 0);
        ctx.lineTo(size * 0.95, -by * 0.45);
        ctx.stroke();
        ctx.rotate(Math.PI / 3);
      }

      // Center dot
      ctx.fillStyle = `rgba(190, 245, 255, ${Math.min(1, alpha + glow * 0.5)})`;
      ctx.beginPath();
      ctx.arc(0, 0, 1.6 + glow * 1.4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // ---- Pulses ------------------------------------------------------------
    const spawnPulse = () => {
      if (!state.edges.length) return;
      const edge = state.edges[(Math.random() * state.edges.length) | 0];
      state.pulses.push({ edge, t: 0 });
    };
    let pulseCooldown = 0;

    // ---- Resize ------------------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * state.dpr;
      canvas.height = rect.height * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
      buildLattice();
    };

    // ---- Mouse -------------------------------------------------------------
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

    // ---- Render ------------------------------------------------------------
    const INFLUENCE = 240;
    const INF2 = INFLUENCE * INFLUENCE;

    const render = (now) => {
      const { w, h, nodes, edges, mouse } = state;
      ctx.clearRect(0, 0, w, h);

      // Cursor halo
      if (mouse.active) {
        const grd = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          280
        );
        grd.addColorStop(0, "rgba(0, 229, 255, 0.10)");
        grd.addColorStop(1, "rgba(0, 229, 255, 0)");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Edges first (so flakes draw on top)
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const ax = e.a.x;
        const ay = e.a.y;
        const bx = e.b.x;
        const by = e.b.y;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = mx - mouse.x;
        const dy = my - mouse.y;
        const d2 = dx * dx + dy * dy;
        const t = Math.max(0, 1 - d2 / INF2);
        const alpha = 0.05 + t * 0.4;
        ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
        ctx.lineWidth = 0.7 + t * 0.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // Snowflakes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        const t = Math.max(0, 1 - d2 / INF2);

        const bob =
          Math.sin(now * 0.0007 + n.bobPhase) * (1.2 + t * 1.2);
        const baseRot = n.rotPhase + now * 0.00025;
        const rot = baseRot + t * 0.6 * Math.sin(now * 0.002);

        const size = n.baseSize + t * 5;
        const alpha = 0.18 + t * 0.55;

        drawSnowflake(n.x, n.y + bob, size, rot, alpha, t);
      }

      // Data pulses along random edges
      pulseCooldown -= 16;
      if (pulseCooldown <= 0) {
        spawnPulse();
        pulseCooldown = 500 + Math.random() * 800;
      }
      for (let i = state.pulses.length - 1; i >= 0; i--) {
        const p = state.pulses[i];
        p.t += 0.014;
        if (p.t >= 1) {
          state.pulses.splice(i, 1);
          continue;
        }
        const ax = p.edge.a.x;
        const ay = p.edge.a.y;
        const bx = p.edge.b.x;
        const by = p.edge.b.y;
        const px = ax + (bx - ax) * p.t;
        const py = ay + (by - ay) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        // Trailing streak
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.5 * fade})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(
          px - (bx - ax) * 0.08,
          py - (by - ay) * 0.08
        );
        ctx.lineTo(px, py);
        ctx.stroke();
        // Head
        ctx.fillStyle = `rgba(190, 245, 255, ${0.95 * fade})`;
        ctx.beginPath();
        ctx.arc(px, py, 2 + fade * 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

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

export default SnowflakeLattice;
