// Calculator page UI shared by tools.js (English) and tools-bn.js (Bangla):
// filter bar, cards with a live diagram per calculator, and result pulse.
// Each VIZ entry redraws an SVG from the same input values the calculator uses.
(function () {
  const r1 = v => Math.round(v * 10) / 10;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, isFinite(v) ? v : a));
  const rad = d => d * Math.PI / 180;
  const fmt = (x, dp = 1) => (isFinite(x) ? Number(x).toLocaleString("en-US", { maximumFractionDigits: dp, minimumFractionDigits: 0 }) : "–");
  const T = (x, y, s, cls = "tx", a = "middle") => '<text x="' + r1(x) + '" y="' + r1(y) + '" class="' + cls + '" text-anchor="' + a + '">' + s + "</text>";
  const dim = (x1, y1, x2, y2, cls = "dm") => {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, tx = 3.5 * (ux - uy), ty = 3.5 * (uy + ux);
    const tk = (x, y) => "M" + r1(x - tx) + " " + r1(y - ty) + "L" + r1(x + tx) + " " + r1(y + ty);
    return '<path class="' + cls + '" d="M' + r1(x1) + " " + r1(y1) + "L" + r1(x2) + " " + r1(y2) + tk(x1, y1) + tk(x2, y2) + '"/>';
  };
  const pipe = (d, w = 14, tone = "") => '<path class="po" d="' + d + '" stroke-width="' + (w + 3) + '"/><path class="pi ' + tone + '" d="' + d + '" stroke-width="' + w + '"/>';
  const svg = (body, h = 170) => '<svg viewBox="0 0 320 ' + h + '" role="img" aria-hidden="true">' + body + "</svg>";
  const uid = () => "u" + Math.random().toString(36).slice(2, 7);
  const nice = [1, 1.6, 2.5, 4, 6, 10, 16, 25, 40, 60, 100, 160, 250, 400, 600, 1000];

  // round dial: value v on a 0..max scale, needle animates from the previous value
  function gauge(cx, cy, R, v, max, ctx, key, mark) {
    const a0 = -225, sw = 270, ang = x => a0 + sw * clamp(x / max, 0, 1.04), to = ang(v), from = ctx.prev(key, to);
    const P = (a, r) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
    let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="f"/>';
    for (let i = 0; i <= 10; i++) {
      const a = a0 + sw * i / 10, p = P(a, R - 4), q = P(a, R - (i % 2 ? 8 : 12)), l = P(a, R - 20);
      s += '<path class="dm" d="M' + p.map(r1).join(" ") + "L" + q.map(r1).join(" ") + '"/>' + (i % 2 || R < 40 && i % 5 ? "" : T(l[0], l[1] + 3, +(max * i / 10).toPrecision(3), "ts"));
    }
    if (mark != null) { const m0 = P(ang(mark), R - 4), m1 = P(ang(mark * 1.06), R - 4); s += '<path class="zone" d="M' + m0.map(r1).join(" ") + "A" + (R - 4) + " " + (R - 4) + " 0 0 1 " + m1.map(r1).join(" ") + '"/>'; }
    return s + '<g class="needle" style="transform-origin:' + cx + "px " + cy + "px;--from:" + r1(from + 90) + "deg;--to:" + r1(to + 90) + 'deg"><path d="M' + (cx - 3) + " " + cy + "L" + cx + " " + (cy - R + 9) + "L" + (cx + 3) + " " + cy + 'z" class="ndl"/></g><circle cx="' + cx + '" cy="' + cy + '" r="4" class="hubdot"/>';
  }
  // horizontal scale with coloured zones and an animated pointer
  function scale(v, max, zones, ctx, key, label) {
    const X = x => 16 + 288 * clamp(x / max, 0, 1), to = X(v), from = ctx.prev(key, to);
    return zones.map(z => '<rect class="z' + z[2] + '" x="' + r1(X(z[0])) + '" y="70" width="' + r1(X(z[1]) - X(z[0])) + '" height="24"/>' + T((X(z[0]) + X(z[1])) / 2, 110, z[3], "ts")).join("") +
      [...new Set(zones.flatMap(z => [z[0], z[1]]))].map(x => T(X(x), 64, +x.toPrecision(3), "ts")).join("") +
      '<g class="ptr" style="--from:' + r1(from - to) + 'px"><path d="M' + r1(to) + ' 96l-7 -11h14z" class="ndl"/><path d="M' + r1(to) + ' 96V66" class="needleline"/>' + T(clamp(to, 60, 260), 38, label, "big") + "</g>";
  }
  function star(n) {
    const order = [], used = new Set(), q = n / 4, step = [0];
    for (let s = 1; s < q; s++) { let best = -1, bd = -1; for (let c = 0; c < q; c++) if (!step.includes(c)) { const dmin = Math.min(...step.map(x => Math.min(Math.abs(x - c), q - Math.abs(x - c)))); if (dmin > bd) { bd = dmin; best = c; } } step.push(best); }
    for (const s of step) [0, 2, 1, 3].forEach(k => { const b = s + k * q + 1; if (!used.has(b)) { used.add(b); order.push(b); } });
    return order;
  }
  function boltCircle(n, cx, cy, R, ctx) {
    if (n < 4 || n % 4 || n > 64) return T(cx, cy, ctx.L("4, 8, 12, 16…", "৪, ৮, ১২, ১৬…"), "ta");
    const order = star(n), seq = {}, br = clamp(Math.PI * R / n * .7, 4, 10), step = .45;
    order.forEach((b, i) => { seq[b] = i; });
    const P = i => [cx + R * Math.sin(2 * Math.PI * (i - 1) / n), cy - R * Math.cos(2 * Math.PI * (i - 1) / n)];
    let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + br + 8) + '" class="fs"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r1(Math.max(10, R - br - 10)) + '" class="f"/>';
    s += '<path class="starln" d="M' + order.map(b => P(b).map(r1).join(" ")).join("L") + 'z"/>';
    for (let b = 1; b <= n; b++) { const p = P(b); s += '<g class="bolt" style="--d:' + (seq[b] * step).toFixed(2) + "s;--cy:" + (n * step).toFixed(2) + 's"><circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(br) + '"/>' + (br >= 6 ? T(p[0], p[1] + 3.5, b, "tb") : "") + "</g>"; }
    return s;
  }

  const VIZ = {
    align(v, c) {
      const t = [[600, .13, .23, .09, .13], [1000, .07, .13, .06, .10], [1500, .06, .09, .05, .07], [3000, .03, .06, .03, .04], [6000, .02, .03, .02, .03]];
      const r = t.find(x => v.rpm <= x[0]) || t[4], o = Math.abs(v.off), a = Math.abs(v.ang);
      const st = o > r[2] || a > r[4] ? "bad" : o > r[1] || a > r[3] ? "warn" : "ok";
      const dy = clamp(v.off * 300, -26, 26), da = clamp(v.ang * 150, -12, 12);
      return svg('<rect x="14" y="44" width="78" height="72" rx="6" class="fs"/>' + T(53, 84, c.L("Motor", "মোটর"), "ts") + pipe("M92 80H150", 12) + '<rect x="146" y="62" width="12" height="36" class="f"/>' +
        '<path class="d" d="M14 80H310"/><g class="sw ' + st + '" transform="translate(0 ' + r1(dy) + ") rotate(" + r1(da) + ' 162 80)"><rect x="162" y="62" width="12" height="36" class="f"/>' + pipe("M174 80H228", 12) + '<rect x="228" y="44" width="78" height="72" rx="6" class="fs"/>' + T(267, 84, c.L("Pump", "পাম্প"), "ts") + '<path class="cl" d="M162 80H306"/></g>' +
        T(160, 22, c.L("offset ", "অফসেট ") + fmt(v.off, 2) + " · " + c.L("angle ", "কোণ ") + fmt(v.ang, 2) + "/100", "ta") + T(160, 150, c.L("exaggerated so you can see it", "বোঝার জন্য বাড়িয়ে আঁকা"), "ts"));
    },
    softfoot(v, c) {
      const vals = [v.a, v.b, v.c, v.d], mx = Math.max(0.1, ...vals.map(x => Math.abs(x) || 0)) * 1.15, H = 100, y0 = 140, lim = y0 - H * .05 / mx;
      const pos = [[34, 50], [96, 50], [34, 112], [96, 112]];
      return svg('<rect x="20" y="36" width="90" height="90" rx="5" class="fsoft"/><rect x="40" y="56" width="50" height="50" rx="4" class="fs"/>' +
        pos.map((p, i) => '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" class="foot ' + (vals[i] > .05 ? "bad" : "ok") + '"/>' + T(p[0], p[1] + 4, i + 1, "tb")).join("") +
        vals.map((x, i) => { const h = H * clamp(x, 0, mx) / mx, X = 150 + i * 40; return '<rect class="bar grow ' + (x > .05 ? "bad" : "ok") + '" style="--i:' + i + '" x="' + X + '" y="' + r1(y0 - h) + '" width="26" height="' + r1(Math.max(h, 1)) + '" rx="3"/>' + T(X + 13, y0 + 14, i + 1, "ts") + T(X + 13, y0 - h - 5, fmt(x, 2), "tx"); }).join("") +
        '<path class="limit" d="M142 ' + r1(lim) + 'H312"/>' + T(312, lim - 5, c.L("limit 0.05", "সীমা ০.০৫"), "ts", "end") + T(65, 24, c.L("feet (top view)", "পা (উপর থেকে)"), "ts"));
    },
    thermal(v, c) {
      const g = v.m * v.l / 1000 * v.t / 1000, dy = clamp(g * 60, 4, 30);
      return svg('<rect x="40" y="128" width="240" height="12" class="fsoft"/><rect x="80" y="60" width="160" height="68" rx="6" class="fs"/>' + dim(56, 128, 56, 86) + T(50, 110, "L", "tx", "end") +
        '<path class="d" d="M40 86H300"/>' + T(300, 100, c.L("cold", "ঠান্ডা"), "ts", "end") + '<g class="rise" style="--dy:' + r1(dy) + 'px"><path class="hot" d="M40 ' + r1(86 - dy) + 'H300"/>' + T(300, 80 - dy, c.L("running", "চালু অবস্থায়"), "ta", "end") + "</g>" +
        '<path class="arrow" d="M160 86V' + r1(90 - dy) + '"/>' + T(168, 40, c.L("growth ", "বৃদ্ধি ") + fmt(g, 3) + " mm · ΔT " + fmt(v.t, 0) + " °C", "ta", "middle"));
    },
    vib(v, c) {
      const L = { "2r": [1.4, 2.8, 4.5], "2f": [2.3, 4.5, 7.1], "1r": [2.3, 4.5, 7.1], "1f": [3.5, 7.1, 11] }[v.g + v.fd], max = L[2] * 1.5;
      return svg(scale(v.v, max, [[0, L[0], "ok", "A"], [L[0], L[1], "ok2", "B"], [L[1], L[2], "warn", "C"], [L[2], max, "bad", "D"]], c, "vib", fmt(v.v, 1) + " mm/s") + T(160, 140, c.L("ISO 10816-3 zones", "ISO 10816-3 জোন"), "ts"));
    },
    vibconv(v, c) {
      const id = uid(), A = 40, wl = 96, path = Array.from({ length: 81 }, (_, i) => { const x = -wl + i * (wl * 4.5 / 80); return (i ? "L" : "M") + r1(x) + " " + r1(85 - A * Math.sin(2 * Math.PI * x / wl)); }).join("");
      return svg('<defs><clipPath id="' + id + '"><rect x="40" y="20" width="270" height="130"/></clipPath></defs><path class="d" d="M40 85H310"/>' +
        '<g clip-path="url(#' + id + ')"><g class="wave" style="--w:' + wl + "px;--t:" + clamp(12 / v.hz, .25, 3).toFixed(2) + 's"><path class="sig" d="' + path + '"/></g></g>' +
        dim(30, 45, 30, 125) + T(36, 40, "pk-pk", "ts", "start") + T(310, 16, fmt(v.hz, 1) + " Hz · " + fmt(v.hz * 60, 0) + " cpm", "ta", "end"));
    },
    balance(v, c) {
      const U = 9549 * v.g * v.m / v.n, t = clamp(600 / v.n, .25, 3).toFixed(2);
      let sp = ""; for (let i = 0; i < 6; i++) sp += '<path class="dm" d="M90 85L' + r1(90 + 52 * Math.cos(i * Math.PI / 3)) + " " + r1(85 + 52 * Math.sin(i * Math.PI / 3)) + '"/>';
      return svg('<g class="spin" style="--t:' + t + 's"><circle cx="90" cy="85" r="60" class="fs"/>' + sp + '<circle cx="90" cy="85" r="10" class="f"/><circle cx="90" cy="37" r="7" class="wt"/></g>' +
        T(220, 60, c.L("residual U", "অবশিষ্ট U"), "ts") + T(220, 84, fmt(U, 0) + " g·mm", "big") + T(220, 116, fmt(U / v.r, 1) + " g @ " + fmt(v.r, 0) + " mm", "ta") + T(220, 140, "G" + v.g + " · " + fmt(v.n, 0) + " rpm", "ts"));
    },
    belt(v, c) {
      const R1 = v.d1 / 2, R2 = v.d2 / 2, k = Math.min(270 / (v.c + R1 + R2), 110 / (2 * Math.max(R1, R2)));
      if (!(k > 0) || v.c <= Math.abs(R2 - R1)) return svg(T(160, 85, c.L("check the sizes", "মাপ যাচাই করুন"), "ta"));
      const r1p = R1 * k, r2p = R2 * k, x1 = 25 + r1p, x2 = x1 + v.c * k, y = 82, ph = Math.asin((R2 - R1) / v.c), s = Math.sin(ph), co = Math.cos(ph);
      const p = (x, r, sg) => [x - r * s, y + sg * r * co].map(r1).join(" ");
      const big = R2 >= R1, belt = "M" + p(x1, r1p, -1) + "L" + p(x2, r2p, -1) + "A" + r1(r2p) + " " + r1(r2p) + " 0 " + (big ? 1 : 0) + " 1 " + p(x2, r2p, 1) + "L" + p(x1, r1p, 1) + "A" + r1(r1p) + " " + r1(r1p) + " 0 " + (big ? 0 : 1) + " 1 " + p(x1, r1p, -1) + "z";
      const t1 = clamp(400 / v.n1, .3, 4), n2 = v.n1 * v.d1 / v.d2, t2 = clamp(400 / n2, .3, 6);
      const pul = (x, r, t) => '<g class="spin" style="--t:' + t.toFixed(2) + 's"><circle cx="' + r1(x) + '" cy="' + y + '" r="' + r1(r) + '" class="fs"/><path class="dm" d="M' + r1(x - r) + " " + y + "H" + r1(x + r) + "M" + r1(x) + " " + r1(y - r) + "V" + r1(y + r) + '"/><circle cx="' + r1(x) + '" cy="' + y + '" r="4" class="f"/></g>';
      return svg(pul(x1, r1p, t1) + pul(x2, r2p, t2) + '<path class="beltp" d="' + belt + '"/>' + T(x1, 160, fmt(v.n1, 0) + " rpm", "tx") + T(x2, 160, fmt(n2, 0) + " rpm", "ta"));
    },
    affinity(v, c) {
      const r = v.n2 / v.n1, items = [["Q", r], ["H", r * r], ["P", r ** 3]], mx = Math.max(1, r ** 3, r) * 1.1;
      return svg(items.map(([l, x], i) => { const X = 40 + i * 95, h0 = 100 / mx, h1 = 100 * x / mx; return '<rect class="bar old" x="' + X + '" y="' + r1(130 - h0) + '" width="26" height="' + r1(h0) + '" rx="3"/><rect class="bar grow acc" style="--i:' + i + '" x="' + (X + 30) + '" y="' + r1(130 - h1) + '" width="26" height="' + r1(Math.max(1, h1)) + '" rx="3"/>' + T(X + 28, 148, l + (i ? (i === 1 ? " ∝ N²" : " ∝ N³") : " ∝ N"), "tx") + T(X + 43, 124 - h1, fmt(x * 100, 0) + "%", "ta"); }).join("") +
        T(160, 18, c.L("grey = now, orange = new speed", "ধূসর = এখন, কমলা = নতুন স্পিড"), "ts"));
    },
    npsh(v, c) {
      const a = (v.ps - v.pv) * 10.197 / v.sg + v.z - v.hf, mx = Math.max(a, v.nr, 1) * 1.2, H = 110, st = a - v.nr >= 1 && a / v.nr >= 1.1 ? "ok" : a > v.nr ? "warn" : "bad";
      const lz = clamp(v.z * 12, -30, 60), ly = 120 - lz;
      return svg('<rect x="16" y="20" width="70" height="110" rx="6" class="f"/><rect class="water" x="17" y="' + r1(clamp(ly, 22, 128)) + '" width="68" height="' + r1(clamp(129 - ly, 1, 108)) + '"/>' + pipe("M86 120H150", 10, "b") + '<circle cx="160" cy="120" r="16" class="fs"/>' +
        '<path class="d" d="M86 120H190"/>' + (lz > 4 ? dim(100, 120, 100, ly) + T(106, (120 + ly) / 2 + 4, "z", "tx", "start") : "") +
        ["NPSHa", "NPSHr"].map((l, i) => { const x = i ? v.nr : a, h = H * clamp(x, 0, mx) / mx, X = 220 + i * 50; return '<rect class="bar grow ' + (i ? "old" : st) + '" style="--i:' + i + '" x="' + X + '" y="' + r1(140 - h) + '" width="32" height="' + r1(Math.max(1, h)) + '" rx="3"/>' + T(X + 16, 156, l, "ts") + T(X + 16, 134 - h, fmt(x, 1), "ta"); }).join(""));
    },
    pumphead(v, c) {
      const H = (v.pd - v.ps) * 10.197 / v.sg + v.dz, max = nice.find(x => x >= Math.max(v.pd, v.ps) * 1.3) || 1000;
      return svg(pipe("M10 120H130", 12, "b") + pipe("M150 104V40H312", 12, "b") + '<circle cx="146" cy="116" r="22" class="fs"/><path class="flow" d="M10 120H124M150 96V40H312"/>' +
        gauge(60, 70, 32, v.ps, max, c, "gs") + '<path class="dm" d="M60 102V114"/>' + gauge(220, 92, 32, v.pd, max, c, "gd") + '<path class="dm" d="M220 60V46"/>' +
        T(60, 160, c.L("suction ", "সাকশন ") + fmt(v.ps, 1), "ts") + T(220, 140, c.L("discharge ", "ডিসচার্জ ") + fmt(v.pd, 1), "ts") + T(290, 160, "H = " + fmt(H, 1) + " m", "ta", "end"));
    },
    velocity(v, c) {
      const vel = v.q / 3600 / (Math.PI * Math.pow(v.id / 1000, 2) / 4), st = vel > 3 ? "bad" : vel < 1 ? "warn" : "ok";
      return svg('<rect x="10" y="50" width="300" height="60" class="pipewall"/><rect x="10" y="56" width="300" height="48" class="water"/>' +
        [64, 80, 96].map(y => '<path class="flowfast" style="--t:' + clamp(1.6 / vel, .12, 4).toFixed(2) + 's" d="M10 ' + y + 'H310"/>').join("") +
        T(160, 36, fmt(vel, 2) + " m/s", "big") + '<rect x="110" y="128" width="100" height="18" rx="9" class="tag ' + st + '"/>' + T(160, 141, st === "ok" ? c.L("good range", "ঠিক আছে") : st === "bad" ? c.L("too fast", "খুব দ্রুত") : c.L("slow", "ধীর"), "tb"));
    },
    torque(v, c) {
      const T_ = v.k * v.f * v.d;
      return svg('<path class="fs" d="M60 60h40l10 25-10 25H60l-10-25z"/><rect x="72" y="20" width="16" height="130" class="f"/><path class="fs" d="M60 60h40l10 25-10 25H60l-10-25z"/>' +
        '<g class="wrench"><path class="fa" d="M80 85L230 60l4 14L84 99z"/><circle cx="80" cy="85" r="18" class="ring"/></g><path class="arrow" d="M240 40a90 90 0 0 1 10 40"/>' +
        T(240, 130, fmt(T_, 0) + " N·m", "big") + T(240, 152, "K × F × d", "ts"));
    },
    flangetq(v, c) {
      const [d, a] = String(v.s).split("|").map(Number), T_ = v.k * v.st * 1000 * a * d / 12, n = Math.round(v.n);
      return svg(boltCircle(n, 78, 85, 52, c) + [.3, .7, 1].map((x, i) => '<g>' + T(170, 42 + i * 42, c.L("pass ", "পাস ") + (i + 1), "ts", "start") + '<rect class="bar grow ' + (i === 2 ? "acc" : "old") + '" style="--i:' + i + '" x="170" y="' + (48 + i * 42) + '" width="' + r1(100 * x) + '" height="14" rx="3"/>' + T(176 + 100 * x, 59 + i * 42, fmt(T_ * x, 0), "tx", "start") + "</g>").join("") + T(170, 165, "ft·lb", "ts", "start"));
    },
    pattern(v, c) { return svg(boltCircle(Math.round(v.n), 160, 88, 62, c), 176); },
    sling(v, c) { return slingDraw(v.a, v.legs === "1" ? 1 : 2, v.w / (v.legs === "1" ? 1 : 2) / Math.sin(rad(v.a)), c); },
    slinglen(v, c) { const half = v.s / 2; if (half >= v.l) return svg(T(160, 85, c.L("sling too short", "স্লিং ছোট"), "ta")); return slingDraw(Math.asin(Math.sqrt(v.l * v.l - half * half) / v.l) * 180 / Math.PI, 2, null, c); },
    cog(v, c) {
      const k = 240 / v.ab, xa = 40, xb = 280, xc = xa + clamp(v.da, 0, v.ab) * k, hk = clamp(v.h * Math.min(k, 100 / v.h), 20, 100), yb = 130, yh = yb - hk;
      const va = v.w * (v.ab - v.da) / v.ab, vb = v.w * v.da / v.ab, ta = va * Math.hypot(v.da, v.h) / v.h, tb = vb * Math.hypot(v.ab - v.da, v.h) / v.h;
      return svg('<rect x="30" y="' + yb + '" width="260" height="14" class="fs"/><path class="sl" d="M' + xa + " " + yb + "L" + r1(xc) + " " + r1(yh) + "L" + xb + " " + yb + '"/><circle cx="' + r1(xc) + '" cy="' + r1(yh - 6) + '" r="6" class="ring"/>' +
        '<circle cx="' + r1(xc) + '" cy="' + (yb + 7) + '" r="7" class="cog"/><path class="d" d="M' + r1(xc) + " " + r1(yh) + "V" + (yb + 7) + '"/>' + T(xa, yb + 30, "A " + fmt(ta, 2) + " t", "ta", "start") + T(xb, yb + 30, fmt(tb, 2) + " t B", "ta", "end") + T(r1(xc), yh - 18, "CoG", "ts"));
    },
    crane(v, c) {
      const p = (v.load + v.rig + v.hook) / v.chart * 100, from = c.prev("cr", p), A = x => rad(180 + 180 * clamp(x / 120, 0, 1)), cx = 160, cy = 130, R = 100;
      const arc = (a, b, cls) => '<path class="' + cls + '" d="M' + r1(cx + R * Math.cos(A(a))) + " " + r1(cy + R * Math.sin(A(a))) + "A" + R + " " + R + " 0 0 1 " + r1(cx + R * Math.cos(A(b))) + " " + r1(cy + R * Math.sin(A(b))) + '"/>';
      return svg(arc(0, 75, "arc ok") + arc(75, 85, "arc warn") + arc(85, 120, "arc bad") + [0, 50, 75, 100].map(x => T(cx + (R + 12) * Math.cos(A(x)), cy + (R + 12) * Math.sin(A(x)) + 4, x + "%", "ts")).join("") +
        '<g class="needle" style="transform-origin:' + cx + "px " + cy + "px;--from:" + r1(180 * clamp(from / 120, 0, 1) - 90) + "deg;--to:" + r1(180 * clamp(p / 120, 0, 1) - 90) + 'deg"><path class="ndl" d="M' + (cx - 4) + " " + cy + "L" + cx + " " + (cy - R + 14) + "L" + (cx + 4) + " " + cy + 'z"/></g><circle cx="' + cx + '" cy="' + cy + '" r="6" class="hubdot"/>' + T(cx, cy + 30, fmt(p, 0) + "%", "big"), 170);
    },
    ground(v, c) {
      const A = v.p * 9.81 / v.q, need = Math.sqrt(A), mx = Math.max(need, v.side), k = 120 / mx, cx = 100, cy = 85, ok = v.side * v.side >= A;
      const sq = (s, cls) => '<rect class="' + cls + '" x="' + r1(cx - s * k / 2) + '" y="' + r1(cy - s * k / 2) + '" width="' + r1(s * k) + '" height="' + r1(s * k) + '"/>';
      return svg(sq(v.side, "mat " + (ok ? "ok" : "bad")) + sq(need, "need") + '<circle cx="' + cx + '" cy="' + cy + '" r="12" class="fs"/>' +
        T(220, 60, c.L("needed ", "দরকার ") + fmt(need, 2) + " m", "tx", "start") + T(220, 84, c.L("your mat ", "আপনার ম্যাট ") + fmt(v.side, 2) + " m", "ta", "start") + T(220, 108, fmt(v.p * 9.81 / (v.side * v.side), 0) + " kPa", "big", "start") + T(220, 130, c.L("dashed = minimum", "ড্যাশ = সর্বনিম্ন"), "ts", "start"));
    },
    plate(v, c) {
      if (v.shape === "plate") return svg('<path class="fs" d="M40 110L160 140L290 90L170 60z"/><path class="fl" d="M40 110v12L160 152v-12z"/><path class="fl" d="M160 152L290 102V90L160 140z"/>' + T(95, 140, fmt(v.a, 2) + " m", "tx") + T(240, 135, fmt(v.b, 2) + " m", "tx") + T(40, 60, "t " + fmt(v.c, 0) + " mm", "ta", "start"));
      const hole = v.shape === "pipe";
      return svg('<path class="fs" d="M60 60H260A16 28 0 0 1 260 116H60z"/><ellipse cx="60" cy="88" rx="16" ry="28" class="f"/>' + (hole ? '<ellipse cx="60" cy="88" rx="11" ry="20" class="hole"/>' : "") +
        dim(60, 132, 260, 132) + T(160, 150, fmt(v.c, 2) + " m", "tx") + T(60, 40, "OD " + fmt(v.a, 0) + (hole ? " · t " + fmt(v.b, 1) : "") + " mm", "ta"));
    },
    offset(v, c) {
      const set = Math.hypot(v.s, v.r || 0), a = rad(v.a), run = set / Math.tan(a), tr = set / Math.sin(a), k = Math.min(100 / set, 190 / run), sp = set * k, rp = run * k;
      const x0 = clamp(150 - rp / 2, 50, 150), y0 = 135, x1 = x0 + rp, y1 = y0 - sp, path = "M10 " + y0 + "H" + r1(x0) + "L" + r1(x1) + " " + r1(y1) + "H312";
      return svg('<path class="d" d="M' + r1(x0) + " " + y0 + "H" + r1(x1) + "V" + r1(y1) + '"/>' + pipe(path, 12, "b") + '<path class="po" d="M' + r1(x0) + " " + y0 + "L" + r1(x1) + " " + r1(y1) + '" stroke-width="15"/><path class="pi y" d="M' + r1(x0) + " " + y0 + "L" + r1(x1) + " " + r1(y1) + '" stroke-width="12"/><path class="flow" d="' + path + '"/>' +
        dim(x1 + 18, y0, x1 + 18, y1) + T(x1 + 24, (y0 + y1) / 2 + 4, fmt(set, 0), "tx", "start") + dim(x0, y0 + 16, x1, y0 + 16) + T((x0 + x1) / 2, y0 + 30, c.L("run ", "রান ") + fmt(run, 0), "tx") +
        T((x0 + x1) / 2 - 12, (y0 + y1) / 2 - 6, c.L("travel ", "ট্রাভেল ") + fmt(tr, 0), "ta", "end") + T(x0 + 34, y0 - 6, v.a + "°", "ta", "start"));
    },
    elbow(v, c) {
      const R = v.r * v.nps * 25.4, th = rad(clamp(v.ang, 1, 180)), t = R * Math.tan(th / 2), E = [R * Math.sin(th), R - R * Math.cos(th)], ext = Math.max(R * .35, 20);
      const pts = [[-ext, 0], [0, 0], E, [E[0] + ext * Math.cos(th), E[1] + ext * Math.sin(th)], [t, 0], [0, R]];
      const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), k = Math.min(260 / (Math.max(...xs) - Math.min(...xs)), 120 / (Math.max(...ys) - Math.min(...ys) || 1));
      const ox = 160 - (Math.max(...xs) + Math.min(...xs)) / 2 * k, oy = 85 + (Math.max(...ys) + Math.min(...ys)) / 2 * k, M = p => [ox + p[0] * k, oy - p[1] * k].map(r1).join(" ");
      const tooBig = th > rad(179);
      return svg(pipe("M" + M(pts[0]) + "L" + M(pts[1]) + "A" + r1(R * k) + " " + r1(R * k) + " 0 0 0 " + M(E) + "L" + M(pts[3]), 14, "b") + (tooBig ? "" : '<path class="d" d="M' + M([0, 0]) + "L" + M([t, 0]) + "L" + M(E) + '"/><circle cx="' + M([t, 0]).split(" ")[0] + '" cy="' + M([t, 0]).split(" ")[1] + '" r="4" class="wp"/>') +
        '<path class="dm" d="M' + M([0, R]) + "L" + M(E) + '"/>' + T(...M([E[0] / 2, R - (R - E[1]) / 2]).split(" ").map(Number), "R " + fmt(R, 0), "ts") + T(160, 18, c.L("take-out ", "টেক-আউট ") + fmt(t, 1) + " mm", "ta"));
    },
    cutlen(v, c) {
      const k = 270 / Math.max(v.cc, 1), w1 = clamp(v.t1 * k, 18, 80), w2 = clamp(v.t2 * k, 18, 80), A = 25, B = 295, y = 110, cut = v.cc - v.t1 - v.t2 - 2 * v.g;
      const el = (x, w, dir) => pipe("M" + r1(x + dir * w) + " " + y + "A" + r1(w) + " " + r1(w) + " 0 0 " + (dir > 0 ? 1 : 0) + " " + x + " " + r1(y - w) + "V" + r1(y - w - 10), 14, "b");
      return svg(dim(A, 18, B, 18) + T(160, 34, "C–C " + fmt(v.cc, 0), "tx") + el(A, w1, 1) + el(B, w2, -1) + (B - w2 - 4 > A + w1 + 4 ? pipe("M" + r1(A + w1 + 4) + " " + y + "H" + r1(B - w2 - 4), 14, "y") + T(160, y + 4, fmt(cut, 0), "tk") : "") +
        '<rect class="wd" x="' + r1(A + w1) + '" y="' + (y - 9) + '" width="4" height="18"/><rect class="wd" x="' + r1(B - w2 - 4) + '" y="' + (y - 9) + '" width="4" height="18"/>' + dim(A, 150, A + w1, 150) + T(A + w1 / 2, 166, fmt(v.t1, 0), "ts") + dim(B - w2, 150, B, 150) + T(B - w2 / 2, 166, fmt(v.t2, 0), "ts"), 172);
    },
    branch(v, c) {
      const R = v.R / 2, r = v.r / 2; if (!(r > 0 && r <= R)) return svg(T(160, 85, c.L("branch ≤ header", "ব্রাঞ্চ ≤ হেডার"), "ta"));
      const Rp = 56, rp = Rp * r / R, cx = 160, cy = 108, yb = cy - Math.sqrt(Rp * Rp - rp * rp), top = cy - Rp, d = R - Math.sqrt(R * R - r * r);
      return svg('<circle cx="' + cx + '" cy="' + cy + '" r="' + Rp + '" class="fs"/><circle cx="' + cx + '" cy="' + cy + '" r="' + (Rp - 6) + '" class="f"/><path class="fl" d="M' + r1(cx - rp) + " 4V" + r1(yb) + "A" + Rp + " " + Rp + " 0 0 1 " + r1(cx + rp) + " " + r1(yb) + 'V4z"/>' +
        '<path class="cutline draw" pathLength="1" d="M' + r1(cx - rp) + " " + r1(yb) + "A" + Rp + " " + Rp + " 0 0 1 " + r1(cx + rp) + " " + r1(yb) + '"/>' + dim(cx + rp + 18, yb, cx + rp + 18, top) + T(cx + rp + 24, (yb + top) / 2 + 4, fmt(d, 1) + " mm", "ta", "start") + T(cx, cy + 4, c.L("header", "হেডার"), "ts"), 172);
    },
    cone(v, c) {
      if (!(v.d < v.D && v.H > 0)) return svg(T(160, 85, c.L("small < large", "ছোট < বড়"), "ta"));
      const Hf = v.H * v.D / (v.D - v.d), L = Math.hypot(Hf, v.D / 2), l = L * v.d / v.D, th = Math.min(359.9, 360 * (v.D / 2) / L);
      const ke = Math.min(110 / v.D, 110 / v.H), bw = v.D * ke, tw = v.d * ke, h = v.H * ke, ex = 70, ey = 140;
      const k = Math.min(70 / L, th > 180 ? 70 / L : 130 / (2 * L * Math.sin(rad(th / 2)))), cx = 230, cy = th > 180 ? 82 : 20, P = (r, a) => [cx + r * k * Math.sin(rad(a)), cy + r * k * Math.cos(rad(a))].map(r1).join(" ");
      const lg = th > 180 ? 1 : 0, a0 = -th / 2, a1 = th / 2;
      return svg('<path class="fs" d="M' + r1(ex - bw / 2) + " " + ey + "H" + r1(ex + bw / 2) + "L" + r1(ex + tw / 2) + " " + r1(ey - h) + "H" + r1(ex - tw / 2) + 'z"/>' + T(ex, ey + 16, "D " + fmt(v.D, 0), "ts") + T(ex, ey - h - 6, "d " + fmt(v.d, 0), "ts") +
        '<path class="fa pattern" d="M' + P(L, a0) + "A" + r1(L * k) + " " + r1(L * k) + " 0 " + lg + " 0 " + P(L, a1) + "L" + P(l, a1) + "A" + r1(l * k) + " " + r1(l * k) + " 0 " + lg + " 1 " + P(l, a0) + 'z"/>' + T(cx, 166, fmt(th, 1) + "° · R " + fmt(L, 0), "ta"), 172);
    },
    hydro(v, c) {
      const pt = 1.5 * v.p * Math.min(v.st / v.s, 6.5), max = nice.find(x => x >= pt * 1.5) || 1000;
      return svg(gauge(100, 92, 70, pt, max, c, "hy", v.p) + T(250, 70, c.L("test", "টেস্ট"), "ts") + T(250, 96, fmt(pt, 1), "big") + T(250, 116, "bar g", "ts") + T(250, 146, c.L("gauge 0–", "গেজ ০–") + max, "ta"));
    },
    contents(v, c) {
      const lpm = Math.PI * Math.pow(v.id / 1000, 2) / 4 * 1000, id = uid();
      return svg('<defs><clipPath id="' + id + '"><circle cx="80" cy="88" r="56"/></clipPath></defs><circle cx="80" cy="88" r="62" class="fl"/><circle cx="80" cy="88" r="56" class="f"/><g clip-path="url(#' + id + ')"><rect class="water fill" x="20" y="30" width="120" height="120"/></g>' +
        T(80, 92, "ID " + fmt(v.id, 1), "tx") + T(230, 60, fmt(lpm, 2) + " L/m", "tx") + T(230, 92, fmt(lpm * v.l, 0) + " L", "big") + T(230, 118, "× " + fmt(v.l, 0) + " m", "ts"));
    },
    heatin(v, c) {
      const sp = v.len / v.t * 60, ae = v.v * v.a * 60 / (sp * 1000), t = clamp(v.t / 10, 2.5, 9).toFixed(2);
      return svg('<rect x="20" y="104" width="280" height="26" class="fl"/><rect class="bead" style="--t:' + t + 's" x="26" y="97" width="268" height="9" rx="4.5"/>' +
        '<g class="torch" style="--t:' + t + 's"><path class="fs" d="M18 30h14l4 52h-22z"/><path class="tip" d="M20 82h10l-5 10z"/><circle class="arcglow" cx="25" cy="97" r="6"/></g>' +
        T(300, 26, fmt(v.v, 0) + " V × " + fmt(v.a, 0) + " A", "tx", "end") + T(300, 50, fmt(sp, 0) + " mm/min", "tx", "end") + T(300, 80, fmt(ae * v.k, 2) + " kJ/mm", "big", "end") + dim(26, 146, 294, 146) + T(160, 162, fmt(v.len, 0) + " mm / " + fmt(v.t, 0) + " s", "ts"), 170);
    },
    ce(v, c) {
      const ce = v.c + v.mn / 6 + (v.cr + v.mo + v.v) / 5 + (v.ni + v.cu) / 15;
      return svg(scale(ce, .7, [[0, .4, "ok", c.L("low", "কম")], [.4, .5, "warn", c.L("preheat", "প্রি-হিট")], [.5, .7, "bad", c.L("high", "বেশি")]], c, "ce", "CE " + fmt(ce, 3)) + T(160, 140, "C + Mn/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", "ts"));
    },
    rods(v, c) {
      const tn = Math.tan(rad(clamp(v.ang, 10, 120) / 2)), wTop = v.gap + 2 * v.t * tn, k = Math.min(100 / v.t, 240 / (wTop + 4)), cx = 160, yb = 140, h = v.t * k, g2 = v.gap / 2 * k, wt = wTop / 2 * k, id = uid(), n = clamp(Math.round(v.t / 3), 2, 7);
      const groove = "M" + r1(cx - g2) + " " + (yb + 3) + "H" + r1(cx + g2) + "L" + r1(cx + wt) + " " + r1(yb - h) + "Q" + cx + " " + r1(yb - h - 14) + " " + r1(cx - wt) + " " + r1(yb - h) + "z";
      const plate = s => '<path class="fl" d="M' + (cx + s * 150) + " " + yb + "H" + r1(cx + s * g2) + "L" + r1(cx + s * wt) + " " + r1(yb - h) + "H" + (cx + s * 150) + 'z"/>';
      let layers = ""; for (let i = 0; i < n; i++) { const y0 = yb + 4 - (h + 4) * i / n, y1 = i === n - 1 ? yb - h - 14 : yb + 4 - (h + 4) * (i + 1) / n; layers += '<rect class="layer l' + (i % 2) + '" style="--d:' + (i * .45).toFixed(2) + 's" x="' + r1(cx - wt - 8) + '" y="' + r1(y1) + '" width="' + r1(2 * wt + 16) + '" height="' + r1(y0 - y1 + .5) + '"/>'; }
      return svg('<defs><clipPath id="' + id + '"><path d="' + groove + '"/></clipPath></defs>' + plate(-1) + plate(1) + '<g clip-path="url(#' + id + ')">' + layers + "</g>" + T(cx, yb - h - 20, v.ang + "°", "ta") + T(cx, 166, c.L("gap ", "গ্যাপ ") + fmt(v.gap, 1) + " · t " + fmt(v.t, 0), "ts"), 172);
    },
    dft(v, c) {
      const wft = v.dft / (v.vs / 100), k = 90 / Math.max(wft, 1), hw = wft * k, hd = v.dft * k;
      return svg('<rect x="40" y="130" width="240" height="14" class="fl"/><rect class="film wet" x="50" y="' + r1(130 - hw) + '" width="100" height="' + r1(hw) + '"/><rect class="film dry shrink" style="--s:' + (hd / hw).toFixed(3) + '" x="170" y="' + r1(130 - hw) + '" width="100" height="' + r1(hw) + '"/>' +
        T(100, 124 - hw, c.L("wet ", "ভেজা ") + fmt(wft, 0) + " µm", "tx") + T(220, 124 - hd, c.L("dry ", "শুকনো ") + fmt(v.dft, 0) + " µm", "ta") + T(160, 162, c.L("solvent leaves, solids stay: ", "সলভেন্ট উড়ে যায়, সলিড থাকে: ") + v.vs + "%", "ts"));
    },
    cyl(v, c) {
      const A = Math.PI * v.bore ** 2 / 4 / 100, Ar = A - Math.PI * v.rod ** 2 / 4 / 100, ve = v.q / (A * 0.1), t = clamp(3 / ve, .6, 6).toFixed(2), rh = clamp(v.rod / v.bore * 40, 6, 36);
      return svg('<rect x="20" y="50" width="170" height="60" rx="6" class="fs"/><g class="piston" style="--t:' + t + 's"><rect x="40" y="54" width="14" height="52" class="fa"/><rect x="54" y="' + r1(80 - rh / 2) + '" width="200" height="' + r1(rh) + '" class="f"/></g>' +
        T(105, 36, c.L("push ", "পুশ ") + fmt(v.p * A / 100, 1) + " kN", "ta") + T(105, 134, c.L("pull ", "পুল ") + fmt(v.p * Ar / 100, 1) + " kN", "tx") + T(300, 160, fmt(ve, 2) + " m/min", "ts", "end"));
    },
    steam(v, c) {
      const t = [[0, 100], [1, 120.4], [2, 133.7], [3, 143.7], [4, 151.9], [5, 158.9], [7, 170.5], [10, 184.1], [15, 201.4], [20, 214.9], [30, 235.7], [40, 251.8], [60, 276.6], [100, 311.5]];
      const X = p => 40 + 270 * Math.sqrt(p / 100), Y = T_ => 140 - 120 * (T_ - 100) / 215;
      if (v.p < 0 || v.p > 100) return svg(T(160, 85, "0–100 bar g", "ta"));
      let i = 0; while (i < t.length - 2 && v.p > t[i + 1][0]) i++; const Tp = t[i][1] + (t[i + 1][1] - t[i][1]) * (v.p - t[i][0]) / (t[i + 1][0] - t[i][0]);
      return svg('<path class="dm" d="M40 20V140H310"/><path class="curve draw" pathLength="1" d="M' + t.map(p => r1(X(p[0])) + " " + r1(Y(p[1]))).join("L") + '"/><path class="d" d="M' + r1(X(v.p)) + " 140V" + r1(Y(Tp)) + "H40" + '"/><circle class="dot" cx="' + r1(X(v.p)) + '" cy="' + r1(Y(Tp)) + '" r="5"/>' +
        T(r1(X(v.p)), 156, fmt(v.p, 1) + " bar", "ts") + T(44, r1(Y(Tp)) - 6, fmt(Tp, 1) + " °C", "ta", "start"));
    },
    shim(v, c) {
      const fr = -(v.off + v.ang / 100 * v.d1), bk = -(v.off + v.ang / 100 * v.d2), sc = 160 / Math.max(v.d2, 1), x1 = 135 + v.d1 * sc, x2 = 135 + v.d2 * sc;
      const dy = clamp(v.off * 150, -24, 24), da = clamp(v.ang * 100, -8, 8);
      const arrow = (x, m) => { const up = m > 0, y0 = 150, y1 = up ? 128 : 150; return Math.abs(m) < 0.005 ? T(x, 162, "0", "ts") : '<path class="arrow" d="M' + r1(x) + " " + (up ? 156 : 126) + "V" + (up ? 128 : 154) + "M" + r1(x - 5) + " " + (up ? 134 : 148) + "L" + r1(x) + " " + (up ? 128 : 154) + "L" + r1(x + 5) + " " + (up ? 134 : 148) + '"/>' + T(x, 168, (up ? "+" : "−") + fmt(Math.abs(m), 2), "ta"); };
      return svg('<path class="fsoft" d="M10 118H310v6H10z"/><rect x="14" y="50" width="96" height="60" rx="6" class="fs"/>' + T(62, 84, c.L("fixed", "স্থির"), "ts") + '<rect x="112" y="66" width="10" height="28" class="f"/><path class="d" d="M10 80H310"/>' +
        '<g class="sw" transform="translate(0 ' + r1(-dy) + ") rotate(" + r1(-da) + ' 125 80)"><rect x="124" y="66" width="10" height="28" class="f"/><rect x="134" y="52" width="170" height="56" rx="6" class="fs"/>' + T(219, 84, c.L("movable", "চলমান"), "ts") + '<rect x="' + r1(x1 - 8) + '" y="108" width="16" height="8" class="fa"/><rect x="' + r1(x2 - 16) + '" y="108" width="16" height="8" class="fa"/></g>' +
        arrow(x1, fr) + arrow(x2 - 8, bk) + T(160, 22, c.L("arrow up = add shims, down = remove", "উপরে তীর = শিম দিন, নিচে = সরান"), "ts"), 172);
    },
    l10(v, c) {
      const h = Math.pow(v.C / v.P, v.p) * 1e6 / (60 * v.n), X = x => 16 + 288 * clamp((Math.log10(x) - 3) / 3, 0, 1), to = X(h), from = c.prev("l10", to);
      const z = [[1e3, 2e4, "bad"], [2e4, 4e4, "warn"], [4e4, 1e6, "ok"]];
      return svg(z.map(q => '<rect class="z' + q[2] + '" x="' + r1(X(q[0])) + '" y="70" width="' + r1(X(q[1]) - X(q[0])) + '" height="24"/>').join("") + [1e3, 1e4, 2e4, 4e4, 1e5, 1e6].map(x => T(X(x), 64, x >= 1e6 ? "1M" : x / 1000 + "k", "ts")).join("") +
        '<g class="ptr" style="--from:' + r1(from - to) + 'px"><path d="M' + r1(to) + ' 96l-7 -11h14z" class="ndl"/><path d="M' + r1(to) + ' 96V66" class="needleline"/>' + T(clamp(to, 70, 250), 38, fmt(h, 0) + c.L(" h", " ঘণ্টা"), "big") + "</g>" +
        T(160, 118, fmt(h / 8760, 1) + c.L(" years running 24/7", " বছর (২৪/৭ চললে)"), "ta") + T(160, 140, c.L("hours, log scale", "ঘণ্টা, লগ স্কেল"), "ts"));
    },
    tank(v, c) {
      const id = uid(), R = v.D / 2;
      if (v.o === "v") {
        const k = Math.min(130 / v.L, 120 / v.D), w = v.D * k, hgt = v.L * k, x0 = 90 - w / 2, y0 = 150 - hgt, lh = clamp(v.h / v.L, 0, 1) * hgt;
        return svg('<rect x="' + r1(x0) + '" y="' + r1(y0) + '" width="' + r1(w) + '" height="' + r1(hgt) + '" rx="4" class="f"/><rect class="water fill" x="' + r1(x0 + 1) + '" y="' + r1(150 - lh) + '" width="' + r1(w - 2) + '" height="' + r1(Math.max(lh - 1, 0)) + '"/>' + dim(x0 + w + 12, 150, x0 + w + 12, 150 - lh) + T(x0 + w + 18, 150 - lh / 2 + 4, fmt(v.h, 2) + " m", "tx", "start") + tankText(v, c));
      }
      const h = clamp(v.h, 0, v.D), ly = 140 - 110 * h / v.D;
      return svg('<defs><clipPath id="' + id + '"><circle cx="90" cy="85" r="54"/></clipPath></defs><circle cx="90" cy="85" r="55" class="f"/><g clip-path="url(#' + id + ')"><rect class="water fill" x="30" y="' + r1(ly) + '" width="120" height="' + r1(141 - ly) + '"/></g>' + dim(160, 140, 160, ly) + T(166, (140 + ly) / 2 + 4, fmt(h, 2) + " m", "tx", "start") + tankText(v, c));
    },
    expand(v, c) {
      const dl = v.a * 1e-6 * v.L * 1000 * (v.t2 - v.t1), g = clamp(Math.abs(dl) * 1.2, 4, 60) * Math.sign(dl || 1);
      return svg('<path class="fl" d="M14 56h14v58H14z"/><path class="dm" d="M14 60l14 10M14 76l14 10M14 92l14 10"/>' + pipe("M28 85H230", 18) + '<g class="stretch" style="--sx:' + ((202 + g) / 202).toFixed(3) + '">' + pipe("M28 85H230", 18, "y") + '<rect class="fa" x="226" y="72" width="6" height="26"/></g>' +
        [80, 150].map(x => '<path class="fs" d="M' + x + " 108l-8 12h16z" + '"/>').join("") + '<path class="d" d="M230 60V130"/>' + T(230 + g / 2, 56, "+" + fmt(dl, 1) + " mm", "ta") + T(28, 150, c.L("anchor", "অ্যাঙ্কর"), "ts", "start") + T(160, 162, fmt(v.L, 0) + " m · " + fmt(v.t1, 0) + " → " + fmt(v.t2, 0) + " °C", "ts"), 172);
    },
    pcd(v, c) {
      const n = Math.round(v.n); if (n < 2 || n > 72) return svg(T(160, 85, "2–72", "ta"));
      const cx = 100, cy = 98, R = 60, hr = clamp(Math.PI * R / n * .45, 2.5, 9), P = i => { const a = rad(v.a0 + i * 360 / n); return [cx + R * Math.sin(a), cy - R * Math.cos(a)]; };
      let s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + hr + 10) + '" class="fs"/><circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" class="cl"/><path class="d" d="M' + cx + " " + (cy - R - 22) + "V" + (cy + R + 22) + "M" + (cx - R - 22) + " " + cy + "H" + (cx + R + 22) + '"/>';
      for (let i = 0; i < n; i++) { const p = P(i); s += '<circle cx="' + r1(p[0]) + '" cy="' + r1(p[1]) + '" r="' + r1(hr) + '" class="' + (i ? "f" : "fa") + '"/>' + (n <= 16 ? T(cx + (R + hr + 20) * Math.sin(rad(v.a0 + i * 360 / n)), cy - (R + hr + 20) * Math.cos(rad(v.a0 + i * 360 / n)) + 4, i + 1, "ts") : ""); }
      const a = P(0), b = P(1);
      return svg(s + '<path class="arrow" d="M' + a.map(r1).join(" ") + "L" + b.map(r1).join(" ") + '"/>' + T(250, 70, "PCD " + fmt(v.pcd, 1), "tx") + T(250, 96, fmt(v.pcd * Math.sin(Math.PI / n), 1) + " mm", "big") + T(250, 116, c.L("hole to hole", "দুই ছিদ্রের মাঝে"), "ts"), 196);
    },
    pipewt(v, c) {
      const p = (window.FH_PIPE || []).find(x => x[0] === v.nps), w = p && p[2][v.sch];
      if (!w) return svg(T(160, 85, c.L("schedule not made in this size", "এই সাইজে এই শিডিউল নেই"), "ta"));
      const id = p[1] - 2 * w, R = 62, ri = Math.min(R - 3, R * id / p[1]), cid = uid(), kg = Math.PI * (p[1] * p[1] - id * id) / 4 * v.rho / 1000 * v.l;
      return svg('<defs><clipPath id="' + cid + '"><circle cx="78" cy="92" r="' + r1(ri) + '"/></clipPath></defs><circle cx="78" cy="92" r="' + R + '" class="fl"/><circle cx="78" cy="92" r="' + r1(ri) + '" class="f"/><g clip-path="url(#' + cid + ')"><rect class="water fill" x="10" y="25" width="140" height="140"/></g>' +
        dim(16, 22, 140, 22) + T(78, 16, "OD " + fmt(p[1], 1), "ta") + T(78, 96, "ID " + fmt(id, 1), "tx") + T(150, 40, "WT " + fmt(w, 2), "ts", "start") +
        T(240, 70, c.L("total weight", "মোট ওজন"), "ts") + T(240, 98, fmt(kg, 1) + " kg", "big") + T(240, 122, v.nps + '" Sch ' + v.sch + " · " + fmt(v.l, 1) + " m", "ts"));
    },
    mitre(v, c) {
      const W = Math.max(1, Math.round(v.W)), A = rad(v.A), cc = A / (2 * W), Ri = v.R - v.D / 2, Ro = v.R + v.D / 2;
      if (!(v.A > 0 && v.A <= 180 && Ri > 0)) return svg(T(160, 85, c.L("radius must be more than OD/2", "রেডিয়াস OD/২ এর বেশি দিন"), "ta"));
      const E = Math.max(v.D, v.R * .35), P = (r, f) => [r * Math.cos(f), r * Math.sin(f)], k = Math.cos(cc);
      const pieces = [[[Ri, -E], [Ro, -E], P(Ro / k, cc), P(Ri / k, cc)]];
      for (let j = 1; j < W; j++) { const a0 = (2 * j - 1) * cc, a1 = (2 * j + 1) * cc; pieces.push([P(Ri / k, a0), P(Ro / k, a0), P(Ro / k, a1), P(Ri / k, a1)]); }
      const tA = [-Math.sin(A) * E, Math.cos(A) * E], q1 = P(Ro, A), q2 = P(Ri, A);
      pieces.push([P(Ri / k, A - cc), P(Ro / k, A - cc), [q1[0] + tA[0], q1[1] + tA[1]], [q2[0] + tA[0], q2[1] + tA[1]]]);
      const all = pieces.flat().concat([[0, 0]]), xs = all.map(q => q[0]), ys = all.map(q => q[1]);
      const s = Math.min(290 / (Math.max(...xs) - Math.min(...xs) || 1), 150 / (Math.max(...ys) - Math.min(...ys) || 1)), ox = 160 - (Math.min(...xs) + Math.max(...xs)) / 2 * s, oy = 88 + (Math.min(...ys) + Math.max(...ys)) / 2 * s;
      const pt = q => r1(ox + q[0] * s) + " " + r1(oy - q[1] * s), arc = Array.from({ length: 31 }, (_, i) => pt(P(v.R, A * i / 30))).join("L"), j0 = P(Ro / k, cc);
      return svg(pieces.map((q, i) => '<path class="' + (i % 2 ? "fa" : "fs") + ' pop" style="--i:' + i + '" d="M' + q.map(pt).join("L") + 'z"/>').join("") + '<path class="cl" d="M' + arc + '"/>' +
        T(ox + j0[0] * s + 14, oy - j0[1] * s + 4, fmt(cc * 180 / Math.PI, 2) + "°", "ta", "start") + T(10, 164, (W + 1) + c.L(" pieces · ", "টি টুকরো · ") + W + c.L(" welds", "টি জয়েন্ট"), "ts", "start"));
    },
    slope(v, c) {
      const x = Math.max(1, v.x), drop = v.L / x, d = clamp(25 * 300 / x, 10, 100), y0 = 50, y1 = y0 + d, path = "M24 " + y0 + "L296 " + r1(y1);
      return svg('<path class="d" d="M14 ' + y0 + 'H306"/>' + pipe(path, 14, "b") + '<path class="flow" d="' + path + '"/>' + dim(304, y0, 304, y1) + T(300, (y0 + y1) / 2 - 6, "↓ " + fmt(drop, 1), "ta", "end") +
        T(24, y0 - 12, "EL " + fmt(v.E, 0), "tx", "start") + T(296, y1 + 26, "EL " + fmt(v.E - drop, 0), "tx", "end") + T(160, 162, c.L("1 : ", "১ : ") + fmt(x, 0) + c.L(" (drawn steeper)", " (ছবিতে বাড়িয়ে আঁকা)"), "ts"));
    },
    inchdia(v, c) {
      const size = s => { const m = String(s).trim().match(/^(\d+)(?:-(\d+)\/(\d+))?$|^(\d+)\/(\d+)$/); return !m ? NaN : m[4] ? m[4] / m[5] : +m[1] + (m[2] ? m[2] / m[3] : 0); };
      const rows = String(v.j).split(/[,;\n]+/).map(s => s.split(":").map(x => x.trim())).filter(r => r.length === 2 && isFinite(size(r[0])) && isFinite(+r[1])).slice(0, 6);
      if (!rows.length) return svg(T(160, 85, "2:40, 3:12, 6:12", "ta"));
      const ids = rows.map(r => size(r[0]) * +r[1]), mx = Math.max(...ids, 1), tot = ids.reduce((a, b) => a + b, 0), men = Math.min(20, Math.ceil(tot / Math.max(1, v.rate) / Math.max(1, v.days)));
      return svg(rows.map((r, i) => T(40, 26 + i * 20, r[0] + '"', "tx", "end") + '<rect class="bar grow acc" style="--i:' + i + '" x="46" y="' + (15 + i * 20) + '" width="' + r1(Math.max(2, 190 * ids[i] / mx)) + '" height="14" rx="3"/>' + T(50 + 190 * ids[i] / mx, 26 + i * 20, fmt(ids[i], 0), "tx", "start")).join("") +
        Array.from({ length: men }, (_, i) => '<g class="pop" style="--i:' + i + '" transform="translate(' + (14 + i * 12) + ' 140)"><circle cx="4" cy="4" r="3.6" class="cog"/><path d="M0 18v-6a4 4 0 0 1 8 0v6z" class="cog"/></g>').join("") + T(26 + men * 12, 154, men + c.L(" welder(s)", " জন ওয়েল্ডার"), "ta", "start"));
    },
  };
  function tankText(v, c) {
    const R = v.D / 2, full = Math.PI * R * R * v.L; let V;
    if (v.o === "v") V = Math.PI * R * R * clamp(v.h, 0, v.L); else { const h = clamp(v.h, 0, v.D); V = (R * R * Math.acos((R - h) / R) - (R - h) * Math.sqrt(2 * R * h - h * h)) * v.L; }
    return T(250, 72, fmt(V / full * 100, 0) + "%", "big") + T(250, 96, fmt(V, 2) + " m³", "ta") + T(250, 118, c.L("of ", "মোট ") + fmt(full, 2) + " m³", "ts");
  }
  function slingDraw(a, legs, tension, c) {
    const hx = 160, yb = 120, ok = a >= 45 ? "ok" : a >= 30 ? "warn" : "bad";
    let hs = 80, h = hs * Math.tan(rad(clamp(a, 1, 89.9))); if (h > 96) { h = 96; hs = h / Math.tan(rad(a)); }
    const yh = yb - h, legsPath = legs === 1 ? "M" + hx + " " + r1(yh) + "V" + yb : "M" + r1(hx - hs) + " " + yb + "L" + hx + " " + r1(yh) + "L" + r1(hx + hs) + " " + yb;
    return svg('<rect x="' + r1(hx - Math.max(hs, 40) - 14) + '" y="' + yb + '" width="' + r1(2 * Math.max(hs, 40) + 28) + '" height="34" rx="3" class="fs"/><path class="sl ' + ok + '" d="' + legsPath + '"/><circle cx="' + hx + '" cy="' + r1(yh - 6) + '" r="6" class="ring"/>' +
      (legs === 2 ? '<path class="dm" d="M' + r1(hx + hs - 26) + " " + yb + "A26 26 0 0 0 " + r1(hx + hs - 26 * Math.cos(rad(a))) + " " + r1(yb - 26 * Math.sin(rad(a))) + '"/>' + T(hx + hs - 32, yb - 6, fmt(a, 1) + "°", "ta", "end") : "") +
      (tension != null ? T(hx, 166, c.L("each leg ", "প্রতি লেগ ") + fmt(tension, 2) + " t", "ta") : ""), 172);
  }

  const ICON = ['<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.5"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3"/>', '<circle cx="10" cy="13" r="6"/><path d="M16 13h6M10 7V3h6"/>', '<path d="M8 3h8l3 5-3 5H8L5 8z"/><path d="M12 13v8"/>', '<path d="M12 3v5M5 21l7-13 7 13M3 21h18"/>', '<path d="M3 17h6l6-10h6"/>', '<path d="M5 19L17 7M15 5l4 4M19 15l2 1M17 18l1 2"/>', '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 9h8M8 13h5"/>'];
  const ico = i => '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[i] || ICON[6]) + "</svg>";

  const CC = ["#2f7fd0", "#0f9d8a", "#8a5cd6", "#d9822b", "#c2453a", "#d6a100", "#5f7d8c"];
  const HERO = '<svg viewBox="0 0 240 170" aria-hidden="true"><g class="hspin"><circle cx="78" cy="78" r="44" class="hg"/>' +
    Array.from({ length: 10 }, (_, i) => '<rect x="72" y="22" width="12" height="16" rx="2" class="hg" transform="rotate(' + i * 36 + ' 78 78)"/>').join("") +
    '<circle cx="78" cy="78" r="14" class="hh"/></g><circle cx="176" cy="66" r="44" class="hgauge"/><path class="harc" d="M145 97A44 44 0 1 1 207 97"/><g class="hneedle"><path d="M173 66L176 30L179 66z" class="hn"/></g><circle cx="176" cy="66" r="5" class="hh"/>' +
    '<path class="hpipe" d="M10 150H120l20-24H232"/><path class="hflow" d="M10 150H120l20-24H232"/></svg>';

  window.FHTools = { render(tools, o) {
    const lang = o.lang, L = (en, bn) => (lang === "bn" ? bn : en);
    const num = n => (lang === "bn" ? n.toLocaleString("bn-BD") : n);
    const cats = [...new Set(tools.map(t => t.cat))];
    const wrap = document.getElementById("toolsWrap"), nav = document.getElementById("toolnav");
    const store = { get(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
    const saved = store.get("fh-tools") || {}, fav = new Set(store.get("fh-fav") || []);
    const nviz = tools.filter(t => VIZ[t.id]).length;
    document.getElementById("toolCount").textContent = o.count;

    // hero: illustration + quick stats beside the page title
    const head = nav.closest(".sechead");
    if (head) {
      head.classList.add("calchero");
      head.insertAdjacentHTML("afterbegin", '<div class="herofig">' + HERO + "</div>");
      head.querySelector(".lede").insertAdjacentHTML("afterend", '<div class="hstats"><span><b>' + num(tools.length) + "</b>" + L("calculators", "ক্যালকুলেটর") + "</span><span><b>" + num(nviz) + "</b>" + L("live diagrams", "লাইভ ছবি") + "</span><span><b>" + num(cats.length) + "</b>" + L("categories", "বিভাগ") + "</span><span><b>EN</b>" + L("+ বাংলা", "+ English") + "</span></div>");
      nav.remove(); head.after(nav);
    }
    nav.classList.add("tbar");
    const tabs = document.querySelector(".tabs"), setTop = () => { nav.style.top = (tabs ? tabs.offsetHeight : 0) + "px"; };
    setTop(); addEventListener("resize", setTop);
    nav.innerHTML = '<div class="wrapin"><label class="tfind"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><input type="search" id="tfind" placeholder="' + L("Find a calculator: torque, sling, NPSH…", "খুঁজুন: টর্ক, স্লিং, NPSH…") + '" aria-label="' + L("Find a calculator", "ক্যালকুলেটর খুঁজুন") + '"></label><div class="tchips">' +
      '<button type="button" class="tchip" data-c="" aria-pressed="true">' + L("All", "সব") + " <i>" + num(tools.length) + "</i></button>" +
      '<button type="button" class="tchip favchip" data-c="★" aria-pressed="false">★ ' + L("Saved", "সেভ করা") + ' <i id="favN">' + num(fav.size) + "</i></button>" +
      cats.map((c, i) => '<button type="button" class="tchip" data-c="' + c + '" aria-pressed="false" style="--cc:' + CC[i % 7] + '">' + ico(i) + c + " <i>" + num(tools.filter(t => t.cat === c).length) + "</i></button>").join("") + '</div><div class="tshown" id="tshown"></div></div>';

    wrap.innerHTML = cats.map((c, ci) => '<section class="tgroup" id="cat-' + c.toLowerCase() + '" data-c="' + c + '" style="--cc:' + CC[ci % 7] + '"><h2><span class="gico">' + ico(ci) + "</span>" + c + "<small>" + num(tools.filter(t => t.cat === c).length) + '</small></h2><div class="tools">' +
      tools.filter(t => t.cat === c).map(t => '<div class="card tool' + (VIZ[t.id] ? " hasviz" : "") + '" id="' + t.id + '" style="--cc:' + CC[ci % 7] + '"><div class="thead"><span class="tico">' + ico(ci) + '</span><div class="cat">' + t.cat + '</div><button type="button" class="star" data-id="' + t.id + '" aria-pressed="' + fav.has(t.id) + '" title="' + L("Save to your list", "আপনার তালিকায় সেভ করুন") + '">★</button></div><h2>' + t.title + "</h2><p>" + t.desc + "</p>" +
        (VIZ[t.id] ? '<figure class="tviz" id="' + t.id + '-viz"></figure>' : "") + '<div class="fields">' +
        t.fields.map((fl, i) => {
          const id = t.id + "-" + fl.id; const val = saved[id] != null ? saved[id] : fl.value;
          const full = (t.fields.length % 2 === 1 && i === t.fields.length - 1) || fl.type === "text" ? ' class="full"' : "";
          if (fl.type === "select") return "<label" + full + ">" + fl.label + '<select id="' + id + '">' + fl.options.map(op => '<option value="' + op[0] + '"' + (String(op[0]) === String(val ?? fl.options[0][0]) ? " selected" : "") + ">" + op[1] + "</option>").join("") + "</select></label>";
          return "<label" + full + ">" + fl.label + '<input id="' + id + '" type="' + fl.type + '"' + (fl.step ? ' step="' + fl.step + '"' : "") + (fl.type === "number" ? ' inputmode="decimal"' : "") + ' value="' + String(val).replace(/"/g, "&quot;") + '"></label>';
        }).join("") + '</div><div class="res"><div class="rhead">' + L("Result", "ফলাফল") + '</div><div class="out" id="' + t.id + '-out" aria-live="polite"></div></div>' +
        '<div class="tact"><button type="button" class="tbtn" data-act="copy" data-id="' + t.id + '">' + L("Copy result", "ফলাফল কপি") + '</button><button type="button" class="tbtn" data-act="reset" data-id="' + t.id + '">' + L("Reset", "রিসেট") + '</button><button type="button" class="tbtn" data-act="share" data-id="' + t.id + '">' + L("Share link", "লিংক শেয়ার") + '</button><button type="button" class="tbtn" data-act="print" data-id="' + t.id + '">' + L("Print / PDF", "প্রিন্ট / PDF") + "</button></div></div>").join("") + "</div></section>").join("") +
      '<p class="tempty" id="tempty" hidden>' + L("No calculator matches. Try another word.", "কিছু পাওয়া যায়নি। অন্য শব্দে খুঁজুন।") + "</p>";

    const runs = {};
    tools.forEach(t => {
      const fig = document.getElementById(t.id + "-viz"), outEl = document.getElementById(t.id + "-out");
      const ctx = { L, prev(k, val) { const p = fig.dataset[k]; fig.dataset[k] = val; return p == null ? val : +p; } };
      const run = () => {
        const v = {};
        t.fields.forEach(fl => { const el = document.getElementById(t.id + "-" + fl.id); v[fl.id] = fl.type === "number" ? parseFloat(el.value) : el.value; saved[t.id + "-" + fl.id] = el.value; });
        let out;
        try { out = t.calc(v); } catch (e) { out = o.err; }
        if (outEl.innerHTML !== out && outEl.innerHTML) { outEl.classList.remove("bump"); void outEl.offsetWidth; outEl.classList.add("bump"); }
        outEl.innerHTML = out;
        if (fig) { try { fig.innerHTML = VIZ[t.id](v, ctx); } catch (e) { fig.innerHTML = ""; } }
      };
      runs[t.id] = run;
      t.fields.forEach(fl => document.getElementById(t.id + "-" + fl.id).addEventListener("input", () => { run(); store.set("fh-tools", saved); }));
      run();
    });

    const flashBtn = (b, msg) => { const o0 = b.textContent; b.textContent = msg; b.classList.add("ok"); setTimeout(() => { b.textContent = o0; b.classList.remove("ok"); }, 1500); };
    // one-page report: title, date, inputs, diagram and result, then the browser's print / save-as-PDF
    const printCard = t => {
      const card = document.getElementById(t.id), fig = document.getElementById(t.id + "-viz");
      const rows = t.fields.map(fl => { const el = document.getElementById(t.id + "-" + fl.id); return "<tr><th>" + fl.label + "</th><td>" + (el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value) + "</td></tr>"; }).join("");
      const when = new Date().toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", { dateStyle: "medium", timeStyle: "short" });
      let sheet = document.getElementById("printsheet");
      if (!sheet) { sheet = document.createElement("div"); sheet.id = "printsheet"; document.body.appendChild(sheet); }
      sheet.innerHTML = '<div class="ph"><b>' + L("Mechanical Handbook", "মেকানিক্যাল হ্যান্ডবুক") + "</b><span>" + when + "</span></div><h1>" + t.title + "</h1><p>" + t.desc + "</p>" +
        (fig ? '<div class="tviz pfig">' + fig.innerHTML + "</div>" : "") + "<h2>" + L("Inputs", "ইনপুট") + '</h2><table class="pt">' + rows + "</table><h2>" + L("Result", "ফলাফল") + '</h2><div class="pout">' + document.getElementById(t.id + "-out").innerHTML + "</div>" +
        '<div class="psign"><span>' + L("Checked by", "যাচাই করেছেন") + "</span><span>" + L("Signature / date", "স্বাক্ষর / তারিখ") + '</span></div><p class="pnote">' + L("Results are guides. The code, maker's manual and site procedure take priority.", "ফলাফল নির্দেশিকা মাত্র; কোড, নির্মাতার ম্যানুয়াল ও সাইটের নিয়ম চূড়ান্ত।") + " · " + location.host + "</p>";
      document.body.classList.add("printing");
      const done = () => { document.body.classList.remove("printing"); removeEventListener("afterprint", done); };
      addEventListener("afterprint", done);
      setTimeout(() => window.print(), 50);
    };
    // card buttons: save, copy, reset, share, print
    wrap.addEventListener("click", e => {
      const st = e.target.closest(".star");
      if (st) { const id = st.dataset.id; fav.has(id) ? fav.delete(id) : fav.add(id); st.setAttribute("aria-pressed", String(fav.has(id))); store.set("fh-fav", [...fav]); document.getElementById("favN").textContent = num(fav.size); if (cat === "★") apply(); return; }
      const b = e.target.closest(".tbtn"); if (!b) return;
      const t = tools.find(x => x.id === b.dataset.id);
      if (b.dataset.act === "reset") {
        t.fields.forEach(fl => { const el = document.getElementById(t.id + "-" + fl.id); el.value = fl.type === "select" ? (fl.value ?? fl.options[0][0]) : fl.value; delete saved[t.id + "-" + fl.id]; });
        runs[t.id](); store.set("fh-tools", saved);
      } else if (b.dataset.act === "share") {
        const qs = new URLSearchParams({ c: t.id });
        t.fields.forEach(fl => qs.set(fl.id, document.getElementById(t.id + "-" + fl.id).value));
        const url = location.origin + location.pathname + "?" + qs.toString();
        const ok = () => flashBtn(b, L("Link copied ✓", "লিংক কপি হয়েছে ✓"));
        if (navigator.share && matchMedia("(pointer:coarse)").matches) navigator.share({ title: t.title, url }).catch(() => {});
        else if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, () => prompt(L("Copy this link", "লিংকটি কপি করুন"), url));
        else prompt(L("Copy this link", "লিংকটি কপি করুন"), url);
      } else if (b.dataset.act === "print") {
        printCard(t);
      } else {
        const out = document.getElementById(t.id + "-out");
        const txt = t.title + "\n" + t.fields.map(fl => { const el = document.getElementById(t.id + "-" + fl.id); return fl.label + ": " + (el.tagName === "SELECT" ? el.options[el.selectedIndex].text : el.value); }).join("\n") + "\n—\n" + out.innerText;
        const done = () => flashBtn(b, L("Copied ✓", "কপি হয়েছে ✓"));
        if (navigator.clipboard) navigator.clipboard.writeText(txt).then(done, () => {}); else { const ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); done(); } catch (er) {} ta.remove(); }
      }
    });

    // filter by category chip, saved list, and text
    const find = document.getElementById("tfind"), shown = document.getElementById("tshown");
    let cat = "";
    const apply = () => {
      const q = find.value.trim().toLowerCase(); let n = 0;
      document.querySelectorAll(".tgroup").forEach(g => {
        let any = false;
        g.querySelectorAll(".tool").forEach(card => { const show = (!cat || (cat === "★" ? fav.has(card.id) : g.dataset.c === cat)) && (!q || card.textContent.toLowerCase().includes(q)); card.hidden = !show; if (show) { any = true; n++; card.classList.add("in"); } });
        g.hidden = !any;
      });
      document.getElementById("tempty").hidden = n > 0;
      if (cat === "★" && !fav.size) { document.getElementById("tempty").hidden = false; document.getElementById("tempty").textContent = L("Tap ★ on any calculator to save it here.", "যেকোনো ক্যালকুলেটরের ★ চাপলে এখানে সেভ থাকবে।"); }
      else document.getElementById("tempty").textContent = L("No calculator matches. Try another word.", "কিছু পাওয়া যায়নি। অন্য শব্দে খুঁজুন।");
      shown.textContent = n === tools.length ? "" : L("Showing " + n + " of " + tools.length, num(tools.length) + "টির মধ্যে " + num(n) + "টি দেখানো হচ্ছে");
    };
    nav.addEventListener("click", e => { const b = e.target.closest(".tchip"); if (!b) return; cat = b.dataset.c; nav.querySelectorAll(".tchip").forEach(x => x.setAttribute("aria-pressed", String(x === b))); apply(); });
    find.addEventListener("input", apply);

    // cards slide in as they scroll into view
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -40px 0px" });
      document.querySelectorAll(".tool").forEach(el => { el.classList.add("rv"); io.observe(el); });
    }
    // opened from a shared link: ?c=<calculator>&<field>=<value>…
    const qp = new URLSearchParams(location.search), sharedId = qp.get("c"), shared = tools.find(x => x.id === sharedId);
    if (shared) {
      shared.fields.forEach(fl => { if (qp.has(fl.id)) document.getElementById(shared.id + "-" + fl.id).value = qp.get(fl.id); });
      runs[shared.id]();
      const el = document.getElementById(shared.id); el.classList.add("in", "flash");
      requestAnimationFrame(() => el.scrollIntoView({ block: "start" }));
    } else if (location.hash) { const el = document.getElementById(location.hash.slice(1)); if (el) { el.classList.add("in", "flash"); el.scrollIntoView(); } }
  } };
})();
