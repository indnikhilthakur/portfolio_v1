import React, { useEffect, useRef } from "react";

/**
 * Space + Data Globe hero background.
 *
 * Layers (single canvas):
 *   1. Deep space — soft cyan / indigo nebula gradients + parallax starfield
 *      (slow far stars, faster near stars, occasional shooting star).
 *   2. Wireframe globe — latitude/longitude great-circle grid of a rotating
 *      sphere using simple 3D rotation + perspective projection (no WebGL).
 *   3. Data points — Fibonacci-distributed points on the sphere; brighter
 *      on the front hemisphere, faded on the back.
 *   4. Data arcs — periodic great-circle arcs animate between random points
 *      with a glowing leading head, evoking inter-region data flows.
 *
 * Cursor interaction: horizontal cursor offset gently steers the globe's
 * Y-rotation speed; vertical offset tilts X-rotation. Move away from globe
 * and rotation eases back to the default pace.
 */
const SpaceGlobe = () => {
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
      mouse: { x: 0, y: 0, active: false },
      stars: [],
      shooters: [],
      points: [],
      arcs: [],
      gridLat: [],
      gridLon: [],
      rot: { x: 0.35, y: 0, vy: 0.0025, vx: 0 },
      cx: 0,
      cy: 0,
      r: 0,
    };

    const isMobile = () => window.innerWidth < 768;

    // ---- Build sphere data --------------------------------------------------
    const buildPoints = () => {
      const count = isMobile() ? 70 : 140;
      const golden = Math.PI * (3 - Math.sqrt(5));
      const arr = [];
      for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = golden * i;
        arr.push({
          x: Math.cos(theta) * radius,
          y,
          z: Math.sin(theta) * radius,
          baseSize: 0.6 + Math.random() * 1.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
      state.points = arr;
    };

    const buildGridLines = () => {
      const lat = [];
      const lon = [];
      const segs = 64;
      // Latitude rings
      for (let li = 1; li < 10; li++) {
        const phi = (li / 10) * Math.PI - Math.PI / 2;
        const ring = [];
        const cy = Math.sin(phi);
        const cr = Math.cos(phi);
        for (let s = 0; s <= segs; s++) {
          const t = (s / segs) * Math.PI * 2;
          ring.push({ x: Math.cos(t) * cr, y: cy, z: Math.sin(t) * cr });
        }
        lat.push(ring);
      }
      // Longitude meridians
      for (let mi = 0; mi < 12; mi++) {
        const lambda = (mi / 12) * Math.PI * 2;
        const ring = [];
        for (let s = 0; s <= segs; s++) {
          const phi = (s / segs) * Math.PI * 2 - Math.PI;
          ring.push({
            x: Math.cos(phi) * Math.cos(lambda),
            y: Math.sin(phi),
            z: Math.cos(phi) * Math.sin(lambda),
          });
        }
        lon.push(ring);
      }
      state.gridLat = lat;
      state.gridLon = lon;
    };

    const buildStars = () => {
      const count = isMobile() ? 90 : 220;
      const arr = [];
      for (let i = 0; i < count; i++) {
        const depth = Math.random();
        arr.push({
          x: Math.random() * state.w,
          y: Math.random() * state.h,
          r: 0.4 + depth * 1.4,
          a: 0.2 + depth * 0.7,
          twPhase: Math.random() * Math.PI * 2,
          twSpeed: 0.0007 + Math.random() * 0.0018,
          drift: 0.02 + depth * 0.08,
        });
      }
      state.stars = arr;
    };

    // ---- Resize -------------------------------------------------------------
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      state.w = rect.width;
      state.h = rect.height;
      canvas.width = rect.width * state.dpr;
      canvas.height = rect.height * state.dpr;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);

      // Globe sits to the right side, vertically centered.
      const minDim = Math.min(state.w, state.h);
      state.r = Math.max(180, minDim * 0.42);
      // On wide screens, push the globe right so it sits behind the terminal card.
      state.cx =
        state.w > 1024 ? state.w * 0.78 : state.w * 0.5;
      state.cy = state.h * 0.5;
      buildStars();
    };

    // Build once.
    buildPoints();
    buildGridLines();

    // ---- Mouse -------------------------------------------------------------
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mouse.x = e.clientX - rect.left;
      state.mouse.y = e.clientY - rect.top;
      state.mouse.active = true;
    };
    const onLeave = () => {
      state.mouse.active = false;
    };

    // ---- 3D helpers ---------------------------------------------------------
    const project = (p, sinX, cosX, sinY, cosY) => {
      // Rotate around Y, then X
      const x1 = p.x * cosY + p.z * sinY;
      const z1 = -p.x * sinY + p.z * cosY;
      const y2 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;
      return { x: x1, y: y2, z: z2 };
    };

    // ---- Arc spawning -------------------------------------------------------
    let arcCooldown = 600;
    const spawnArc = () => {
      const pts = state.points;
      if (pts.length < 2) return;
      const a = pts[(Math.random() * pts.length) | 0];
      const b = pts[(Math.random() * pts.length) | 0];
      if (a === b) return;
      // Build N intermediate points along the great-circle arc (slerp).
      const dot = a.x * b.x + a.y * b.y + a.z * b.z;
      const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (omega < 0.4) return; // skip arcs that are too short
      const sinO = Math.sin(omega);
      const segs = 36;
      const path = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const s1 = Math.sin((1 - t) * omega) / sinO;
        const s2 = Math.sin(t * omega) / sinO;
        // Lift slightly off the sphere to suggest an arc above the surface.
        const lift = 1 + 0.18 * Math.sin(t * Math.PI);
        path.push({
          x: (a.x * s1 + b.x * s2) * lift,
          y: (a.y * s1 + b.y * s2) * lift,
          z: (a.z * s1 + b.z * s2) * lift,
        });
      }
      state.arcs.push({ path, t: 0, life: 1.6 });
    };

    // ---- Render -------------------------------------------------------------
    let last = performance.now();
    const render = (now) => {
      const dt = Math.min(48, now - last) / 16; // approx frames
      last = now;
      const { w, h, mouse, points, gridLat, gridLon, stars, arcs } = state;

      // Background gradient
      const bgGrd = ctx.createRadialGradient(
        state.cx,
        state.cy,
        50,
        state.cx,
        state.cy,
        Math.max(state.w, state.h) * 0.9
      );
      bgGrd.addColorStop(0, "rgba(8, 30, 50, 0.55)");
      bgGrd.addColorStop(0.5, "rgba(6, 14, 28, 0.25)");
      bgGrd.addColorStop(1, "rgba(8, 9, 11, 0)");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, w, h);

      // A second nebula puff (warm violet) for depth, top-left
      const neb = ctx.createRadialGradient(
        w * 0.18,
        h * 0.25,
        20,
        w * 0.18,
        h * 0.25,
        Math.max(w, h) * 0.6
      );
      neb.addColorStop(0, "rgba(120, 80, 200, 0.10)");
      neb.addColorStop(1, "rgba(120, 80, 200, 0)");
      ctx.fillStyle = neb;
      ctx.fillRect(0, 0, w, h);

      // Stars (with twinkle + slow drift)
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.x -= s.drift * dt;
        if (s.x < -2) s.x = w + 2;
        const tw = 0.55 + 0.45 * Math.sin(now * s.twSpeed + s.twPhase);
        ctx.fillStyle = `rgba(220, 240, 255, ${s.a * tw})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Occasional shooting star
      if (Math.random() < 0.0025) {
        state.shooters.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.6,
          vx: 4 + Math.random() * 3,
          vy: 1 + Math.random() * 1.5,
          life: 1,
        });
      }
      for (let i = state.shooters.length - 1; i >= 0; i--) {
        const sh = state.shooters[i];
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.life -= 0.018;
        if (sh.life <= 0) {
          state.shooters.splice(i, 1);
          continue;
        }
        const grd = ctx.createLinearGradient(
          sh.x,
          sh.y,
          sh.x - sh.vx * 8,
          sh.y - sh.vy * 8
        );
        grd.addColorStop(0, `rgba(220, 245, 255, ${sh.life})`);
        grd.addColorStop(1, "rgba(220, 245, 255, 0)");
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 8, sh.y - sh.vy * 8);
        ctx.stroke();
      }

      // Update rotation, react to cursor
      let targetVy = 0.0028;
      let targetVx = 0;
      if (mouse.active) {
        const dx = (mouse.x - state.cx) / state.w; // -0.5..0.5
        const dy = (mouse.y - state.cy) / state.h;
        targetVy = 0.0014 + dx * 0.012;
        targetVx = -dy * 0.006;
      }
      state.rot.vy += (targetVy - state.rot.vy) * 0.04;
      state.rot.vx += (targetVx - state.rot.vx) * 0.04;
      state.rot.y += state.rot.vy * dt * 16;
      state.rot.x += state.rot.vx * dt * 16;
      // Clamp X tilt
      const maxTilt = 0.9;
      if (state.rot.x > maxTilt) state.rot.x = maxTilt;
      if (state.rot.x < -maxTilt) state.rot.x = -maxTilt;

      const sinX = Math.sin(state.rot.x);
      const cosX = Math.cos(state.rot.x);
      const sinY = Math.sin(state.rot.y);
      const cosY = Math.cos(state.rot.y);
      const fov = 2.4;

      // Globe ambient halo
      const halo = ctx.createRadialGradient(
        state.cx,
        state.cy,
        state.r * 0.6,
        state.cx,
        state.cy,
        state.r * 1.6
      );
      halo.addColorStop(0, "rgba(0, 229, 255, 0.10)");
      halo.addColorStop(1, "rgba(0, 229, 255, 0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(state.cx, state.cy, state.r * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Helper to project unit-sphere coord to canvas
      const toScreen = (p) => {
        const r3 = project(p, sinX, cosX, sinY, cosY);
        const persp = fov / (fov + r3.z);
        return {
          x: state.cx + r3.x * state.r * persp,
          y: state.cy - r3.y * state.r * persp,
          z: r3.z,
          k: persp,
        };
      };

      // Latitude rings
      ctx.lineWidth = 0.7;
      for (let li = 0; li < gridLat.length; li++) {
        const ring = gridLat[li];
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const sp = toScreen(ring[i]);
          const alpha = sp.z > 0 ? 0.18 : 0.05;
          if (i === 0) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${alpha})`;
            ctx.moveTo(sp.x, sp.y);
          } else {
            ctx.lineTo(sp.x, sp.y);
          }
        }
        ctx.stroke();
      }
      // Longitude meridians
      for (let mi = 0; mi < gridLon.length; mi++) {
        const ring = gridLon[mi];
        ctx.beginPath();
        for (let i = 0; i < ring.length; i++) {
          const sp = toScreen(ring[i]);
          if (i === 0) {
            ctx.strokeStyle = `rgba(0, 229, 255, 0.10)`;
            ctx.moveTo(sp.x, sp.y);
          } else {
            ctx.lineTo(sp.x, sp.y);
          }
        }
        ctx.stroke();
      }

      // Equator pop
      const eq = gridLat[Math.floor(gridLat.length / 2)];
      if (eq) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 229, 255, 0.28)";
        ctx.lineWidth = 1;
        for (let i = 0; i < eq.length; i++) {
          const sp = toScreen(eq[i]);
          if (i === 0) ctx.moveTo(sp.x, sp.y);
          else ctx.lineTo(sp.x, sp.y);
        }
        ctx.stroke();
      }

      // Data points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sp = toScreen(p);
        const front = sp.z > 0;
        const breathe = 0.6 + 0.4 * Math.sin(now * 0.0012 + p.phase);
        if (front) {
          // glow
          ctx.fillStyle = `rgba(0, 229, 255, ${0.18 * breathe})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, p.baseSize * 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = front
          ? `rgba(190, 245, 255, ${0.55 + breathe * 0.4})`
          : `rgba(120, 180, 220, 0.12)`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, p.baseSize * (front ? 1.1 : 0.7), 0, Math.PI * 2);
        ctx.fill();
      }

      // Spawn arcs periodically
      arcCooldown -= 16 * dt;
      if (arcCooldown <= 0) {
        spawnArc();
        arcCooldown = 700 + Math.random() * 900;
      }

      // Draw arcs (animated growing trail with glowing head)
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.t += 0.015 * dt;
        if (a.t >= a.life) {
          arcs.splice(i, 1);
          continue;
        }
        const lifeFade =
          a.t < 1 ? 1 : Math.max(0, 1 - (a.t - 1) / (a.life - 1));
        const head = Math.min(a.t, 1);
        const segs = a.path.length - 1;
        const headIdx = Math.floor(head * segs);

        // Trail polyline
        ctx.lineWidth = 1.3;
        ctx.strokeStyle = `rgba(0, 229, 255, ${0.55 * lifeFade})`;
        ctx.beginPath();
        let started = false;
        for (let j = 0; j <= headIdx; j++) {
          const sp = toScreen(a.path[j]);
          if (!started) {
            ctx.moveTo(sp.x, sp.y);
            started = true;
          } else {
            ctx.lineTo(sp.x, sp.y);
          }
        }
        ctx.stroke();

        // Glowing head
        if (headIdx < a.path.length) {
          const sp = toScreen(a.path[Math.min(headIdx, a.path.length - 1)]);
          ctx.fillStyle = `rgba(180, 245, 255, ${0.95 * lifeFade})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(0, 229, 255, ${0.4 * lifeFade})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 6, 0, Math.PI * 2);
          ctx.fill();
        }
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

export default SpaceGlobe;
