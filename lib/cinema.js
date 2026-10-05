// Scroll-driven canvas scene: one house, one day, five stages.
// createCinema(canvas).render(p) draws the scene at progress p (0 → 1).
// No images or video needed: everything is drawn, so it stays sharp and loads instantly.

export const STAGES = [
  { n: "01", title: "18:00. Stage 4.", text: "The whole street goes dark. Fridge off, Wi-Fi off, dinner on hold." },
  { n: "02", title: "Site survey", text: "We measure your roof, check its angle and direction, and size a system for your actual usage." },
  { n: "03", title: "Install day", text: "Eight panels, a hybrid inverter and a lithium battery. Most homes are done in one day." },
  { n: "04", title: "The sun does the work", text: "Panels power the house and charge the battery at the same time." },
  { n: "05", title: "Lights on", text: "Loadshedding hits again tonight. Your house stays on." },
];

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const seg = (p, a, b) => clamp((p - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeOutBack = (t) => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };

function hex(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a, b, t) { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], t))).join(",")})`; }
function rgba(h, a) { const [r, g, b] = hex(h); return `rgba(${r},${g},${b},${a})`; }

export function createCinema(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const font = opts.font || "system-ui, sans-serif";
  let W = 0, H = 0, dpr = 1, last = 0;

  // Fixed star field (seeded so it never jumps between frames)
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const stars = Array.from({ length: 90 }, () => ({ x: rand(), y: rand() * 0.6, r: 0.4 + rand() * 1.2, tw: rand() }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render(last);
  }

  function house(cx, gy, hw, o) {
    const wallH = hw * 0.85, top = gy - wallH, over = hw * 0.12;
    const roof = { bl: [cx - hw - over, top], br: [cx + hw + over, top], tl: [cx - hw * 0.55, top - hw * 0.62], tr: [cx + hw * 0.55, top - hw * 0.62] };
    // walls
    ctx.fillStyle = o.wall; ctx.fillRect(cx - hw, top, hw * 2, wallH);
    // roof
    ctx.fillStyle = o.roof; ctx.beginPath();
    ctx.moveTo(...roof.bl); ctx.lineTo(...roof.tl); ctx.lineTo(...roof.tr); ctx.lineTo(...roof.br); ctx.closePath(); ctx.fill();
    // windows + door
    const win = (x, y, w, h) => {
      if (o.lit > 0) { ctx.save(); ctx.shadowColor = rgba("#FFC24A", 0.9 * o.lit); ctx.shadowBlur = 30 * o.lit; }
      ctx.fillStyle = o.glassBase; ctx.fillRect(x, y, w, h);
      if (o.lit > 0) { ctx.fillStyle = rgba("#FFC965", o.lit); ctx.fillRect(x, y, w, h); ctx.restore(); }
      ctx.fillStyle = o.frame; ctx.fillRect(x + w / 2 - 1, y, 2, h); ctx.fillRect(x, y + h / 2 - 1, w, 2);
    };
    const ww = hw * 0.42, wh = wallH * 0.36, wy = top + wallH * 0.2;
    win(cx - hw * 0.82, wy, ww, wh); win(cx + hw * 0.4, wy, ww, wh);
    ctx.fillStyle = o.door; ctx.fillRect(cx - hw * 0.14, gy - wallH * 0.55, hw * 0.28, wallH * 0.55);
    return roof;
  }

  function onRoof(roof, u, v) {
    const lx = lerp(roof.bl[0], roof.tl[0], v), rx = lerp(roof.br[0], roof.tr[0], v);
    return [lerp(lx, rx, u), lerp(roof.bl[1], roof.tl[1], v)];
  }

  function render(p) {
    last = p;
    if (!W) return;
    ctx.clearRect(0, 0, W, H);

    // ---- time of day ----
    const dawn = 0.12 * seg(p, 0.2, 0.42);
    const day = Math.min(seg(p, 0.42, 0.6), 1 - seg(p, 0.8, 0.9));
    const light = Math.max(dawn, day);
    const pre = 1 - seg(p, 0.025, 0.07);           // street lights before loadshedding
    const ours = seg(p, 0.85, 0.92);                // our house lights in stage 5

    // sky
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, mix("#05070F", "#3A78D4", light));
    g.addColorStop(0.75, mix("#141C38", "#F2C27D", light));
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // stars
    for (const s of stars) {
      const a = (1 - light) * (0.5 + 0.5 * Math.sin(p * 40 + s.tw * 6));
      if (a <= 0.02) continue;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2); ctx.fill();
    }

    // sun on an arc
    const sp = seg(p, 0.42, 0.86);
    const ang = Math.PI * (1 - sp * 0.85);
    const sx = W * 0.5 + Math.cos(ang) * W * 0.42, sy = H * 0.82 - Math.sin(ang) * H * 0.62;
    if (day > 0) {
      const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 140);
      sg.addColorStop(0, rgba("#FFE7A3", 0.9 * day)); sg.addColorStop(0.25, rgba("#FFC24A", 0.5 * day)); sg.addColorStop(1, rgba("#FFC24A", 0));
      ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 140, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = rgba("#FFF4D1", day); ctx.beginPath(); ctx.arc(sx, sy, 26, 0, Math.PI * 2); ctx.fill();
    }

    // ground
    const narrow = W < 640;
    const gy = H * (narrow ? 0.64 : 0.8);
    ctx.fillStyle = mix("#090D18", "#3D5236", light);
    ctx.beginPath(); ctx.moveTo(0, gy + 10);
    ctx.quadraticCurveTo(W * 0.25, gy - 18, W * 0.5, gy); ctx.quadraticCurveTo(W * 0.75, gy + 14, W, gy - 6);
    ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();

    const hw = narrow ? W * 0.24 : Math.min(W * 0.2, 230), cx = W * 0.5;
    const wall = mix("#161C2B", "#E8DFCE", light), roofC = mix("#1F2536", "#9A4433", light);
    const glass = mix("#0B1120", "#9CC3E8", light), frame = mix("#0A0E18", "#F5F1E8", light), door = mix("#10151F", "#5B3A2A", light);

    // neighbours (no solar: they go dark and stay dark)
    for (const side of [-1, 1]) {
      house(cx + side * hw * 2.55, gy + 4, hw * 0.62, { wall: mix("#121725", "#D9CFBD", light), roof: mix("#1A2030", "#7E5A48", light), glassBase: glass, frame, door, lit: pre });
    }

    // our house
    const roof = house(cx, gy, hw, { wall, roof: roofC, glassBase: glass, frame, door, lit: Math.max(pre, ours) });

    // ---- stage 2: survey overlay ----
    const sv = seg(p, 0.22, 0.28) * (1 - seg(p, 0.38, 0.44));
    if (sv > 0) {
      ctx.save(); ctx.globalAlpha = sv;
      ctx.strokeStyle = "#FFC24A"; ctx.lineWidth = 1.5; ctx.setLineDash([6, 6]); ctx.lineDashOffset = -p * 600;
      ctx.beginPath(); ctx.moveTo(...roof.bl); ctx.lineTo(...roof.tl); ctx.lineTo(...roof.tr); ctx.lineTo(...roof.br); ctx.closePath(); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(roof.br[0], roof.br[1], 34, Math.PI, Math.PI + 0.9, false); ctx.stroke();
      ctx.fillStyle = "#FFC24A"; ctx.font = `600 13px ${font}`; ctx.textAlign = "center";
      ctx.fillText("North-facing · 32 m²", cx, roof.tl[1] - 16);
      ctx.textAlign = "left"; ctx.fillText("28°", roof.br[0] + 8, roof.br[1] - 12);
      ctx.restore();
    }

    // ---- stage 3: panels drop in ----
    const cols = 4, rows = 2;
    for (let i = 0; i < cols * rows; i++) {
      const t = seg(p, 0.42 + i * 0.018, 0.47 + i * 0.018);
      if (t <= 0) continue;
      const c = i % cols, r = Math.floor(i / cols);
      const u0 = 0.14 + c * 0.18, u1 = u0 + 0.16, v0 = 0.14 + r * 0.4, v1 = v0 + 0.34;
      const dy = (1 - easeOutBack(t)) * -H * 0.35;
      const pts = [onRoof(roof, u0, v0), onRoof(roof, u1, v0), onRoof(roof, u1, v1), onRoof(roof, u0, v1)].map(([x, y]) => [x, y + dy]);
      ctx.save(); ctx.globalAlpha = Math.min(1, t * 2);
      ctx.fillStyle = mix("#0F1830", "#1E3766", light);
      ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgba("#8FB4FF", 0.35); ctx.lineWidth = 1; ctx.stroke();
      // cell lines
      ctx.beginPath();
      for (let k = 1; k < 3; k++) {
        const a = [lerp(pts[0][0], pts[1][0], k / 3), lerp(pts[0][1], pts[1][1], k / 3)], b = [lerp(pts[3][0], pts[2][0], k / 3), lerp(pts[3][1], pts[2][1], k / 3)];
        ctx.moveTo(...a); ctx.lineTo(...b);
      }
      const m0 = [(pts[0][0] + pts[3][0]) / 2, (pts[0][1] + pts[3][1]) / 2], m1 = [(pts[1][0] + pts[2][0]) / 2, (pts[1][1] + pts[2][1]) / 2];
      ctx.moveTo(...m0); ctx.lineTo(...m1); ctx.stroke();
      // sun glint
      if (day > 0.3) {
        ctx.fillStyle = rgba("#FFFFFF", 0.18 * day * (0.6 + 0.4 * Math.sin(p * 30 + i)));
        ctx.beginPath(); ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...m1); ctx.lineTo(...m0); ctx.closePath(); ctx.fill();
      }
      ctx.restore();
    }

    // ---- battery unit beside the house ----
    const bIn = seg(p, 0.5, 0.58);
    const bw = hw * 0.26, bh = hw * 0.5, bx = cx + hw + hw * 0.3, by = gy - bh;
    const charge = clamp(seg(p, 0.62, 0.78) - 0.3 * seg(p, 0.88, 1));
    if (bIn > 0) {
      ctx.save(); ctx.globalAlpha = bIn;
      ctx.fillStyle = mix("#1C2233", "#F4F4F2", light); ctx.fillRect(bx, by + (1 - ease(bIn)) * 30, bw, bh);
      const pad = 6, ih = bh - pad * 2 - 18;
      ctx.fillStyle = mix("#0A0E18", "#2B3245", light); ctx.fillRect(bx + pad, by + pad, bw - pad * 2, ih);
      ctx.fillStyle = charge > 0.98 ? "#4ADE80" : "#FFC24A";
      ctx.fillRect(bx + pad, by + pad + ih * (1 - charge), bw - pad * 2, ih * charge);
      ctx.fillStyle = mix("#E8ECF5", "#1D2030", light); ctx.font = `600 11px ${font}`; ctx.textAlign = "center";
      ctx.fillText(Math.round(charge * 100) + "%", bx + bw / 2, by + bh - 6);
      ctx.restore();
    }

    // ---- energy flow ----
    const flowIn = seg(p, 0.58, 0.63) * (1 - seg(p, 0.79, 0.83));
    const flowOut = seg(p, 0.86, 0.9);
    const from = onRoof(roof, 0.9, 0.5);
    const drawFlow = (a, b, color, alpha, dir) => {
      if (alpha <= 0) return;
      ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.setLineDash([2, 12]); ctx.lineDashOffset = dir * p * 900;
      ctx.shadowColor = color; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.moveTo(...a);
      ctx.quadraticCurveTo(b[0] + 10, a[1] - 10, b[0], b[1]); ctx.stroke(); ctx.restore();
    };
    drawFlow(from, [bx + bw / 2, by], "#FFC24A", flowIn, -1);
    drawFlow([bx, by + bh * 0.4], [cx + hw * 0.6, gy - hw * 0.5], "#4ADE80", flowOut * 0.9, -1);

    // grid status chip (top-left of scene)
    const off = 1 - pre;
    if (off > 0) {
      ctx.save(); ctx.globalAlpha = off * (1 - day);
      ctx.font = `600 12px ${font}`; ctx.textAlign = "left";
      const label = ours > 0.5 ? "GRID OFF · SUNVAULT ON" : "GRID OFF · STAGE 4";
      const tw = ctx.measureText(label).width + 28;
      const cy = Math.min(96, H * 0.14);
      ctx.fillStyle = "rgba(255,255,255,0.08)"; ctx.fillRect(20, cy, tw, 28);
      ctx.fillStyle = ours > 0.5 ? "#4ADE80" : "#FF6B5E"; ctx.beginPath(); ctx.arc(32, cy + 14, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E8ECF5"; ctx.fillText(label, 42, cy + 18.5);
      ctx.restore();
    }
  }

  window.addEventListener("resize", resize);
  resize();
  return { render, resize, destroy: () => window.removeEventListener("resize", resize) };
}
