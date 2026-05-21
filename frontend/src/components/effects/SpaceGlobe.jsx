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

    const defaultStats = {
      projects: {
        "p01": { "name": "Flow by Coridors", "commits": 145, "color": "cyan" },
        "p02": { "name": "RAG Document Assistant", "commits": 42, "color": "violet" },
        "p03": { "name": "Secure Ingestion Connector", "commits": 38, "color": "emerald" },
        "p04": { "name": "CARL — Investment App", "commits": 88, "color": "amber" },
        "p05": { "name": "Autonomous Drone Delivery", "commits": 64, "color": "rose" },
        "p06": { "name": "Breast Cancer ML Classifier", "commits": 22, "color": "fuchsia" },
        "p07": { "name": "LinkStash App", "commits": 50, "color": "emerald" },
        "p08": { "name": "Portfolio v1", "commits": 120, "color": "rose" }
      },
      practice: { "leetcode_commits": 145, "hackerrank_commits": 80, "total": 225 }
    };

    const FIXED_NODES = {
      p01: { x: 0.8,  y: 0.4,   z: 0.44 },   // Top right front-ish
      p02: { x: -0.6, y: 0.5,   z: -0.62 },  // Top left back-ish
      p03: { x: 0.1,  y: -0.8,  z: 0.59 },   // Bottom front
      p04: { x: -0.7, y: -0.3,  z: 0.64 },   // Bottom-left front-ish
      p05: { x: 0.5,  y: 0.2,   z: -0.84 },  // Right back-ish
      p06: { x: -0.3, y: -0.6,  z: -0.74 },  // Bottom-left back-ish
      p07: { x: 0.5,  y: -0.4,  z: -0.76 },  // Right, lower back-ish
      p08: { x: -0.8, y: 0.2,   z: 0.57 },   // Left, middle front-ish
      practice_hub: { x: 0.0, y: 0.6, z: 0.8 } // Top center front (very prominent!)
    };

    const getDynamicProjectPos = (id) => {
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }
      const y = ((Math.abs(hash) % 100) / 50) - 1; // -1 to 1
      const theta = ((Math.abs(hash >> 8) % 100) / 100) * Math.PI * 2;
      const radius = Math.sqrt(1 - y * y);
      return {
        x: Math.cos(theta) * radius,
        y,
        z: Math.sin(theta) * radius
      };
    };

    const colorMap = {
      cyan: { primary: "#00e5ff", glow: "rgba(0, 229, 255, 0.4)", text: "#e0f7fc" },
      violet: { primary: "#d946ef", glow: "rgba(217, 70, 239, 0.4)", text: "#fdf4ff" },
      emerald: { primary: "#10b981", glow: "rgba(16, 185, 129, 0.4)", text: "#ecfdf5" },
      amber: { primary: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", text: "#fffbeb" },
      rose: { primary: "#f43f5e", glow: "rgba(244, 63, 94, 0.4)", text: "#fff1f2" },
      fuchsia: { primary: "#a855f7", glow: "rgba(168, 85, 247, 0.4)", text: "#faf5ff" }
    };

    const getColorTheme = (colorName) => {
      return colorMap[colorName.toLowerCase()] || colorMap.cyan;
    };

    const state = {
      w: 0,
      h: 0,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
      mouse: { x: 0, y: 0, active: false },
      stars: [],
      shooters: [],
      points: [],
      activeNodes: [],
      nodeParticles: [],
      arcs: [],
      gridLat: [],
      gridLon: [],
      rot: { x: 0.35, y: 0, vy: 0.0025, vx: 0 },
      cx: 0,
      cy: 0,
      r: 0,
      stats: defaultStats
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
          baseSize: 0.4 + Math.random() * 0.8,
          phase: Math.random() * Math.PI * 2,
        });
      }
      state.points = arr;
    };

    const buildActiveNodes = () => {
      const stats = state.stats || defaultStats;
      const nodes = [];

      // 1. Core and dynamic projects
      Object.entries(stats.projects).forEach(([pid, proj]) => {
        let pos = FIXED_NODES[pid];
        if (!pos) {
          pos = getDynamicProjectPos(pid);
        }
        nodes.push({
          id: pid,
          name: proj.name,
          x: pos.x,
          y: pos.y,
          z: pos.z,
          commits: proj.commits,
          color: proj.color || "cyan",
          phase: Math.random() * Math.PI * 2,
          isPractice: false
        });
      });

      // 2. Practice hub node
      const practice = stats.practice || { leetcode_commits: 145, hackerrank_commits: 80, total: 225 };
      const hubPos = FIXED_NODES.practice_hub;
      nodes.push({
        id: "practice_hub",
        name: "Practice Hub",
        x: hubPos.x,
        y: hubPos.y,
        z: hubPos.z,
        commits: practice.total,
        leetcodeCommits: practice.leetcode_commits,
        hackerrankCommits: practice.hackerrank_commits,
        color: "emerald",
        phase: Math.random() * Math.PI * 2,
        isPractice: true
      });

      state.activeNodes = nodes;
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
    buildActiveNodes();

    // Fetch live stats
    fetch("/api/globe-stats")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data && data.projects && data.practice) {
          state.stats = data;
          buildActiveNodes();
        }
      })
      .catch((err) => {
        console.warn("Could not fetch live globe stats, using local defaults:", err);
      });

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
      const activeNodes = state.activeNodes;
      if (!activeNodes || activeNodes.length < 2) return;

      // Select starting active node, favoring ones with higher commits
      let totalCommits = activeNodes.reduce((sum, n) => sum + (n.commits || 5), 0);
      if (totalCommits <= 0) totalCommits = 1;
      let rand = Math.random() * totalCommits;
      let startNode = activeNodes[0];
      let runningSum = 0;
      for (const n of activeNodes) {
        runningSum += (n.commits || 5);
        if (rand <= runningSum) {
          startNode = n;
          break;
        }
      }

      // Target can be any other active node
      const otherNodes = activeNodes.filter((n) => n.id !== startNode.id);
      if (otherNodes.length === 0) return;
      const endNode = otherNodes[(Math.random() * otherNodes.length) | 0];

      // Build great-circle arc (slerp)
      const dot = startNode.x * endNode.x + startNode.y * endNode.y + startNode.z * endNode.z;
      const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
      if (omega < 0.3) return; // skip if too close

      const sinO = Math.sin(omega);
      const segs = 40;
      const path = [];
      for (let i = 0; i <= segs; i++) {
        const t = i / segs;
        const s1 = Math.sin((1 - t) * omega) / sinO;
        const s2 = Math.sin(t * omega) / sinO;
        // Lift slightly off the sphere, making a beautiful arching trajectory
        const lift = 1 + 0.15 * Math.sin(t * Math.PI);
        path.push({
          x: (startNode.x * s1 + endNode.x * s2) * lift,
          y: (startNode.y * s1 + endNode.y * s2) * lift,
          z: (startNode.z * s1 + endNode.z * s2) * lift,
        });
      }

      state.arcs.push({
        path,
        t: 0,
        life: 1.4 + Math.random() * 0.6,
        color: startNode.color
      });
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

      // Data points (background lattice)
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const sp = toScreen(p);
        const front = sp.z > 0;
        const breathe = 0.6 + 0.4 * Math.sin(now * 0.001 + p.phase);
        if (front) {
          ctx.fillStyle = `rgba(0, 180, 216, ${0.08 * breathe})`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, p.baseSize * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = front
          ? `rgba(140, 220, 240, ${0.25 + breathe * 0.15})`
          : `rgba(80, 140, 180, 0.04)`;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, p.baseSize * (front ? 0.8 : 0.5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw active nodes (Project Zones & Practice Hub)
      for (let i = 0; i < state.activeNodes.length; i++) {
        const node = state.activeNodes[i];
        const sp = toScreen(node);
        const front = sp.z > 0;

        if (!front) {
          ctx.fillStyle = "rgba(120, 180, 220, 0.08)";
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.0, 0, Math.PI * 2);
          ctx.fill();
          continue;
        }

        const theme = getColorTheme(node.color);
        const baseSize = node.isPractice ? 3.5 : 2.5;
        const commits = node.commits || 0;
        const scale = Math.log(commits + 1) * 1.2;
        const radius = baseSize + scale;

        // Dynamic breathe speed & amplitude based on commits
        const breatheSpeed = 0.0012 + Math.min(0.003, commits * 0.00001);
        const breathe = 0.5 + 0.5 * Math.sin(now * breatheSpeed + node.phase);

        // 1. Large glowing ambient aura
        const glowGrd = ctx.createRadialGradient(
          sp.x, sp.y, radius * 0.5,
          sp.x, sp.y, radius * (2.2 + 1.2 * breathe)
        );
        glowGrd.addColorStop(0, theme.glow.replace("0.4", (0.35 + breathe * 0.15).toString()));
        glowGrd.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = glowGrd;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, radius * (2.2 + 1.2 * breathe), 0, Math.PI * 2);
        ctx.fill();

        // 2. Main node core
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // 3. Inner highlight center
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // 4. Premium text labels
        if (sp.z > 0.45) {
          ctx.fillStyle = theme.text;
          ctx.font = "500 9px 'Outfit', 'Inter', sans-serif";
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";

          const text = node.isPractice
            ? `${node.name} (${node.commits} solved)`
            : `${node.name} [${node.commits}]`;
          ctx.fillText(text, sp.x + radius + 6, sp.y);

          // Add a tiny pointer line
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * sp.z})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sp.x + radius + 1, sp.y);
          ctx.lineTo(sp.x + radius + 4, sp.y);
          ctx.stroke();
        }
      }

      // Spawn custom particles from active nodes based on commit count
      if (Math.random() < 0.3) {
        state.activeNodes.forEach((node) => {
          const commits = node.commits || 0;
          const spawnChance = Math.min(0.7, (commits * 0.0018) + 0.02);
          if (Math.random() < spawnChance) {
            const speed = 0.008 + Math.random() * 0.012;
            const vx = node.x * speed + (Math.random() - 0.5) * 0.008;
            const vy = node.y * speed + (Math.random() - 0.5) * 0.008;
            const vz = node.z * speed + (Math.random() - 0.5) * 0.008;

            state.nodeParticles.push({
              x: node.x,
              y: node.y,
              z: node.z,
              vx,
              vy,
              vz,
              color: node.color,
              life: 1.0,
              decay: 0.02 + Math.random() * 0.03
            });
          }
        });
      }

      // Update and draw node particles zipping outwards
      for (let i = state.nodeParticles.length - 1; i >= 0; i--) {
        const p = state.nodeParticles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.z += p.vz * dt;
        p.life -= p.decay * dt;

        if (p.life <= 0) {
          state.nodeParticles.splice(i, 1);
          continue;
        }

        const sp = toScreen(p);
        if (sp.z <= 0) continue; // Skip back hemisphere

        const theme = getColorTheme(p.color || "cyan");
        ctx.fillStyle = theme.primary;
        ctx.beginPath();
        const size = Math.max(0.4, p.life * 1.5);
        ctx.arc(sp.x, sp.y, size, 0, Math.PI * 2);
        ctx.fill();

        if (size > 0.9) {
          ctx.fillStyle = theme.glow.replace("0.4", (p.life * 0.25).toString());
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spawn arcs periodically
      arcCooldown -= 16 * dt;
      if (arcCooldown <= 0) {
        spawnArc();
        arcCooldown = 600 + Math.random() * 800;
      }

      // Draw arcs (animated growing trail with glowing head)
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.t += 0.012 * dt;
        if (a.t >= a.life) {
          arcs.splice(i, 1);
          continue;
        }
        const lifeFade = a.t < 1 ? 1 : Math.max(0, 1 - (a.t - 1) / (a.life - 1));
        const head = Math.min(a.t, 1);
        const segs = a.path.length - 1;
        const headIdx = Math.floor(head * segs);

        const theme = getColorTheme(a.color || "cyan");

        // Trail polyline
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = theme.glow.replace("0.4", (0.5 * lifeFade).toString());
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
          ctx.fillStyle = `#ffffff`;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = theme.primary;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 4.5, 0, Math.PI * 2);
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
