// Field calculators. Each tool: fields (inputs) and calc(values) returning HTML.
(function () {
  const SELF = (document.currentScript && document.currentScript.src) || "", UI_VER = "6";
  const f = (x, dp = 2) => (isFinite(x) ? Number(x).toLocaleString(undefined, { maximumFractionDigits: dp, minimumFractionDigits: 0 }) : "–");
  const pill = (c, t) => '<span class="pill ' + c + '">' + t + "</span>";
  const muted = t => '<br><span style="color:var(--muted)">' + t + "</span>";
  const rad = d => d * Math.PI / 180;
  const N = (id, label, value, step) => ({ id, label, type: "number", value, step });
  const S = (id, label, options, value) => ({ id, label, type: "select", options, value });

  const tools = [
  /* ---------- Rotary ---------- */
  { id: "align", cat: "Rotary", title: "Alignment check", desc: "Short flexible coupling. Compare laser or dial results with typical tolerance for the speed.",
    fields: [N("rpm", "Speed (rpm)", 2950), N("off", "Offset (mm)", 0.05, 0.01), N("ang", "Angularity (mm/100 mm)", 0.03, 0.01)],
    calc(v) {
      const t = [[600, .13, .23, .09, .13], [1000, .07, .13, .06, .10], [1500, .06, .09, .05, .07], [3000, .03, .06, .03, .04], [6000, .02, .03, .02, .03]];
      const r = t.find(x => v.rpm <= x[0]) || t[4];
      const g = (x, e, a) => x <= e ? pill("ok", "Excellent") : x <= a ? pill("warn", "Acceptable") : pill("bad", "Correct it");
      return "Band ≤ " + r[0] + " rpm<br>Offset " + f(Math.abs(v.off)) + " mm " + g(Math.abs(v.off), r[1], r[2]) + "<br>Angular " + f(Math.abs(v.ang)) + " /100 " + g(Math.abs(v.ang), r[3], r[4]) + muted("Limits: offset " + r[1] + " / " + r[2] + " mm, angle " + r[3] + " / " + r[4] + " per 100 mm");
    } },
  { id: "softfoot", cat: "Rotary", title: "Soft foot", desc: "Dial reading when each foot bolt is loosened (others tight).",
    fields: [N("a", "Foot 1 (mm)", 0.02, 0.01), N("b", "Foot 2 (mm)", 0.08, 0.01), N("c", "Foot 3 (mm)", 0.01, 0.01), N("d", "Foot 4 (mm)", 0.03, 0.01)],
    calc(v) {
      return ["a", "b", "c", "d"].map((k, i) => "Foot " + (i + 1) + ": " + f(v[k]) + " mm " + (v[k] > 0.05 ? pill("bad", "Correct") : pill("ok", "OK"))).join("<br>") + muted("Limit 0.05 mm. Fix the worst foot first, then recheck all four.");
    } },
  { id: "thermal", cat: "Rotary", title: "Thermal growth", desc: "Vertical growth of a centreline from cold to running temperature, for cold alignment offsets.",
    fields: [N("l", "Base to shaft centre (mm)", 450), N("t", "Temperature rise (°C)", 60), S("m", "Material", [["11.7", "Carbon steel (11.7)"], ["10.5", "Cast iron (10.5)"], ["17.3", "Stainless 304 (17.3)"], ["23", "Aluminium (23)"]])],
    calc(v) { const g = v.m * v.l / 1000 * v.t / 1000; return "Growth <b>" + f(g, 3) + " mm</b>" + muted("Set this machine " + f(g, 2) + " mm lower than the other when cold, less the other machine's own growth."); } },
  { id: "vib", cat: "Rotary", title: "Vibration severity", desc: "ISO 10816-3 overall velocity on the bearing housing, mm/s RMS.",
    fields: [N("v", "Velocity (mm/s RMS)", 3.2, 0.1), S("g", "Machine group", [["2", "Group 2: 15–300 kW"], ["1", "Group 1: 300 kW–50 MW"]]), S("fd", "Foundation", [["r", "Rigid"], ["f", "Flexible"]])],
    calc(v) {
      const L = { "2r": [1.4, 2.8, 4.5], "2f": [2.3, 4.5, 7.1], "1r": [2.3, 4.5, 7.1], "1f": [3.5, 7.1, 11] }[v.g + v.fd];
      const z = v.v <= L[0] ? ["ok", "Zone A", "New machine condition"] : v.v <= L[1] ? ["ok", "Zone B", "Fine for long-term running"] : v.v <= L[2] ? ["warn", "Zone C", "Plan corrective work"] : ["bad", "Zone D", "Damage likely: act now"];
      return pill(z[0], z[1]) + " <b>" + f(v.v, 1) + " mm/s</b><br>" + z[2] + muted("Boundaries A/B, B/C, C/D: " + L.join(" / "));
    } },
  { id: "vibconv", cat: "Rotary", title: "Vibration units", desc: "Convert between velocity, displacement and acceleration at one frequency (sine wave).",
    fields: [N("v", "Velocity (mm/s RMS)", 4.5, 0.1), N("hz", "Frequency (Hz)", 49.2, 0.1)],
    calc(v) {
      const pk = v.v * Math.SQRT2, w = 2 * Math.PI * v.hz;
      const disp = pk / w * 1000 * 2; // µm pk-pk
      const acc = pk * w / 1000 / 9.81; // g pk
      return "Velocity <b>" + f(pk / 25.4, 3) + " in/s pk</b><br>Displacement <b>" + f(disp, 1) + " µm pk-pk</b> (" + f(disp / 25.4, 2) + " mils)<br>Acceleration <b>" + f(acc, 3) + " g pk</b>" + muted(f(v.hz * 60, 0) + " cpm. Only valid for a single frequency, not overall values.");
    } },
  { id: "balance", cat: "Rotary", title: "Balance tolerance", desc: "ISO 21940-11 (ISO 1940) permissible residual unbalance.",
    fields: [N("m", "Rotor mass (kg)", 120), N("n", "Speed (rpm)", 1480), S("g", "Grade", [["6.3", "G6.3 fans, pumps"], ["2.5", "G2.5 turbines, motors"], ["16", "G16 crushers"], ["1", "G1 precision"]]), N("r", "Correction radius (mm)", 400)],
    calc(v) { const U = 9549 * v.g * v.m / v.n; return "Total U <b>" + f(U, 0) + " g·mm</b><br>At radius: <b>" + f(U / v.r, 1) + " g</b> total" + muted("Two-plane symmetric rotor: about " + f(U / v.r / 2, 1) + " g per plane."); } },
  { id: "bearing", cat: "Rotary", title: "Bearing number decoder", desc: "Basic number to bore size and type, e.g. 6205, 22220, 7312, NU2216.",
    fields: [{ id: "b", label: "Bearing number", type: "text", value: "6310-2Z/C3" }],
    calc(v) {
      const s = String(v.b).toUpperCase().replace(/\s/g, "");
      const m = s.match(/^(NUP|NU|NJ|NN|N|QJ|HK|NA)?(\d{3,5})/);
      if (!m) return "Type a number like 6205, 22220E or NU 2216.";
      const pre = m[1] || "", digits = m[2];
      const code = digits.slice(-2), boreCode = parseInt(code, 10);
      const bore = boreCode === 0 ? 10 : boreCode === 1 ? 12 : boreCode === 2 ? 15 : boreCode === 3 ? 17 : boreCode * 5;
      const series = digits.slice(0, -2);
      let type = "Unknown series";
      if (pre) type = { NU: "Cylindrical roller, no inner ring ribs", NJ: "Cylindrical roller, one inner rib", NUP: "Cylindrical roller, locating", N: "Cylindrical roller, no outer ring ribs", NN: "Double row cylindrical roller", QJ: "Four-point contact ball", NA: "Needle roller", HK: "Drawn cup needle" }[pre];
      else if (/^6/.test(series)) type = "Deep groove ball";
      else if (/^7/.test(series)) type = "Angular contact ball";
      else if (/^(222|223|230|231|232|238|239|240|241)/.test(series)) type = "Spherical roller";
      else if (/^(292|293|294)/.test(series)) type = "Spherical roller thrust";
      else if (/^(302|303|313|320|322|323|329|330|331|332)/.test(series)) type = "Tapered roller (metric)";
      else if (/^(12|13|22|23)$/.test(series)) type = "Self-aligning ball";
      else if (/^(32|33|52|53)$/.test(series)) type = "Double row angular contact ball";
      else if (/^(511|512|513|514)/.test(series)) type = "Thrust ball";
      else if (/^(1|2|3|4)$/.test(series)) type = "Self-aligning ball (short form)";
      const sfx = [];
      if (/2RS|DDU|2RSR|LLU/.test(s)) sfx.push("rubber seals both sides");
      else if (/RS|DU|LU/.test(s)) sfx.push("rubber seal one side");
      if (/2Z|ZZ/.test(s)) sfx.push("metal shields both sides");
      else if (/-Z(?!Z)/.test(s)) sfx.push("metal shield one side");
      if (/C3/.test(s)) sfx.push("C3 clearance (larger than normal)");
      if (/C4/.test(s)) sfx.push("C4 clearance");
      if (/C2/.test(s)) sfx.push("C2 clearance (less than normal)");
      if (/K(?![A-Z]*C)/.test(s.slice(m[0].length))) sfx.push("tapered bore 1:12 (if K is the bore suffix)");
      if (/M(?!O)/.test(s.slice(m[0].length))) sfx.push("brass cage (M)");
      if (/TN9|P(?!6|5)/.test(s.slice(m[0].length))) sfx.push("polyamide cage");
      if (/BE|B(?=E|C|M|G)/.test(s.slice(m[0].length)) && /^7/.test(series)) sfx.push("40° contact angle");
      return "Type: <b>" + type + "</b><br>Bore: <b>" + bore + " mm</b>" + (sfx.length ? "<br>Suffix: " + sfx.join(", ") : "") + muted("Check the maker's catalogue for OD, width and load ratings.");
    } },
  { id: "grease", cat: "Rotary", title: "Grease quantity", desc: "Relubrication quantity for side-greased bearings: G = 0.005 × D × B.",
    fields: [N("D", "Bearing OD (mm)", 110), N("B", "Width (mm)", 27), N("shot", "Grams per gun stroke", 1.2, 0.1)],
    calc(v) { const g = 0.005 * v.D * v.B; return "Quantity <b>" + f(g, 1) + " g</b><br>About <b>" + f(g / v.shot, 0) + " strokes</b>" + muted("Weigh 10 strokes of your gun to find grams per stroke."); } },
  { id: "motortq", cat: "Rotary", title: "Torque from power", desc: "Shaft torque from motor power and speed. Also motor synchronous speed.",
    fields: [N("p", "Power (kW)", 75), N("n", "Speed (rpm)", 1480), S("hz", "Supply", [["50", "50 Hz"], ["60", "60 Hz"]]), N("poles", "Poles", 4)],
    calc(v) { const T = 9549 * v.p / v.n; const ns = 120 * v.hz / v.poles; return "Torque <b>" + f(T, 0) + " N·m</b> (" + f(T * 0.7376, 0) + " ft·lb)<br>Synchronous speed " + f(ns, 0) + " rpm, slip " + f((ns - v.n) / ns * 100, 1) + "%"; } },
  { id: "belt", cat: "Rotary", title: "Pulley speed & belt", desc: "Driven speed, ratio, belt speed and approximate belt length.",
    fields: [N("d1", "Driver pulley (mm)", 200), N("n1", "Driver speed (rpm)", 1460), N("d2", "Driven pulley (mm)", 315), N("c", "Centre distance (mm)", 600)],
    calc(v) { const n2 = v.n1 * v.d1 / v.d2; const vs = Math.PI * v.d1 / 1000 * v.n1 / 60; const L = 2 * v.c + Math.PI / 2 * (v.d1 + v.d2) + Math.pow(v.d2 - v.d1, 2) / (4 * v.c); const defl = Math.sqrt(v.c * v.c - Math.pow((v.d2 - v.d1) / 2, 2)) * 16 / 1000;
      return "Driven speed <b>" + f(n2, 0) + " rpm</b>, ratio " + f(v.d2 / v.d1, 2) + "<br>Belt speed " + f(vs, 1) + " m/s<br>Pitch length ≈ <b>" + f(L, 0) + " mm</b><br>Tension check deflection ≈ " + f(defl, 1) + " mm" + muted("Use pitch diameters. Deflection is 16 mm per metre of span."); } },
  /* ---------- Pumps ---------- */
  { id: "affinity", cat: "Pumps", title: "Pump affinity laws", desc: "Same impeller, new speed (or small trim). Q ∝ N, H ∝ N², P ∝ N³.",
    fields: [N("n1", "Speed now (rpm)", 2950), N("n2", "New speed (rpm)", 2400), N("q", "Flow (m³/h)", 120), N("h", "Head (m)", 65), N("p", "Power (kW)", 30)],
    calc(v) { const r = v.n2 / v.n1; return "Ratio " + f(r, 3) + "<br>Flow <b>" + f(v.q * r, 1) + " m³/h</b><br>Head <b>" + f(v.h * r * r, 1) + " m</b><br>Power <b>" + f(v.p * r ** 3, 1) + " kW</b>"; } },
  { id: "npsh", cat: "Pumps", title: "NPSH available", desc: "NPSHa from suction vessel conditions. Liquid level above pump centreline is positive.",
    fields: [N("ps", "Vessel pressure (bar abs)", 1.013, 0.001), N("pv", "Vapour pressure (bar abs)", 0.074, 0.001), N("sg", "Specific gravity", 0.99, 0.01), N("z", "Liquid level above pump (m)", 2.5, 0.1), N("hf", "Suction line losses (m)", 0.8, 0.1), N("nr", "NPSHr from curve (m)", 4.5, 0.1)],
    calc(v) { const a = (v.ps - v.pv) * 10.197 / v.sg + v.z - v.hf; const m = a - v.nr; const st = m >= 1 && a / v.nr >= 1.1 ? pill("ok", "Margin OK") : m > 0 ? pill("warn", "Thin margin") : pill("bad", "Cavitation risk");
      return "NPSHa <b>" + f(a, 2) + " m</b><br>Margin " + f(m, 2) + " m, ratio " + f(a / v.nr, 2) + " " + st + muted("Water at 40 °C has vapour pressure about 0.074 bar abs; at 80 °C about 0.47 bar abs."); } },
  { id: "pumphead", cat: "Pumps", title: "Pump head from gauges", desc: "Differential head and hydraulic power from suction and discharge gauges.",
    fields: [N("pd", "Discharge (bar g)", 6.2, 0.1), N("ps", "Suction (bar g)", 0.4, 0.1), N("sg", "Specific gravity", 1.0, 0.01), N("dz", "Discharge gauge higher by (m)", 0.5, 0.1), N("q", "Flow (m³/h)", 100), N("eff", "Pump efficiency (%)", 72)],
    calc(v) { const H = (v.pd - v.ps) * 10.197 / v.sg + v.dz; const ph = v.q * H * v.sg / 367; return "Differential head <b>" + f(H, 1) + " m</b><br>Hydraulic power " + f(ph, 2) + " kW<br>Shaft power <b>" + f(ph / (v.eff / 100), 2) + " kW</b>" + muted("Compare head with the curve at this flow. 10% low usually means internal wear."); } },
  { id: "velocity", cat: "Pumps", title: "Pipe velocity", desc: "Flow velocity in a pipe of given inside diameter.",
    fields: [N("q", "Flow (m³/h)", 100), N("id", "Inside diameter (mm)", 154.1, 0.1)],
    calc(v) { const a = Math.PI * Math.pow(v.id / 1000, 2) / 4; const vel = v.q / 3600 / a; return "Velocity <b>" + f(vel, 2) + " m/s</b>" + muted("Typical: pump suction 1–2 m/s, discharge 2–3 m/s."); } },
  /* ---------- Bolting ---------- */
  { id: "torque", cat: "Bolting", title: "Bolt torque (metric)", desc: "T = K × F × d. Enter the clamp load you need.",
    fields: [N("d", "Bolt diameter (mm)", 20), N("f", "Clamp load (kN)", 90), S("k", "Lubrication", [["0.20", "Dry / as received (K 0.20)"], ["0.16", "Light oil (K 0.16)"], ["0.14", "Copper anti-seize (K 0.14)"], ["0.12", "Moly / PTFE paste (K 0.12)"], ["0.10", "PTFE coated stud (K 0.10)"]], "0.16")],
    calc(v) { const T = v.k * v.f * v.d; return "Torque <b>" + f(T, 0) + " N·m</b> (" + f(T * 0.7376, 0) + " ft·lb)" + muted("Use the joint's approved torque table when one exists."); } },
  { id: "flangetq", cat: "Bolting", title: "Flange stud torque (inch)", desc: "Torque for B7/L7 studs from target bolt stress (PCC-1 style).",
    fields: [S("s", "Stud size", [["0.5|0.1419", "1/2\"-13"], ["0.625|0.2260", "5/8\"-11"], ["0.75|0.3345", "3/4\"-10"], ["0.875|0.4617", "7/8\"-9"], ["1|0.6057", "1\"-8"], ["1.125|0.7905", "1-1/8\"-8"], ["1.25|1.0000", "1-1/4\"-8"], ["1.375|1.2333", "1-3/8\"-8"], ["1.5|1.4919", "1-1/2\"-8"], ["1.625|1.7771", "1-5/8\"-8"], ["1.75|2.0876", "1-3/4\"-8"], ["2|2.7665", "2\"-8"]], "0.75|0.3345"), N("st", "Target bolt stress (ksi)", 50), S("k", "Nut factor", [["0.16", "0.16 oiled / moly"], ["0.12", "0.12 PTFE coated"], ["0.20", "0.20 dry"]], "0.16"), N("n", "Number of studs", 8)],
    calc(v) { const [d, a] = String(v.s).split("|").map(Number); const F = v.st * 1000 * a; const T = v.k * F * d / 12; const pass = [0.3, 0.7, 1].map(x => f(T * x, 0)).join(" → ");
      return "Bolt load " + f(F, 0) + " lbf (" + f(F * 4.448 / 1000, 1) + " kN)<br>Torque <b>" + f(T, 0) + " ft·lb</b> (" + f(T * 1.3558, 0) + " N·m)<br>Passes: " + pass + " ft·lb, then 100% circular<br>Total joint load " + f(F * v.n / 1000, 0) + " kips" + muted("Check gasket and flange stress limits with your site's bolting procedure."); } },
  { id: "pattern", cat: "Bolting", title: "Cross bolting pattern", desc: "Star (cross) tightening order for any bolt count.",
    fields: [N("n", "Number of bolts", 12, 4)],
    calc(v) { const n = Math.round(v.n); if (n < 4 || n % 4) return "Use a multiple of 4 (flanges have 4, 8, 12, 16… bolts).";
      // Legacy pattern: tighten opposite pairs, then pairs 90° away, stepping around
      const order = []; const used = new Set(); const q = n / 4;
      const step = [0]; for (let s = 1; s < q; s++) { let best = -1, bd = -1; for (let c = 0; c < q; c++) if (!step.includes(c)) { const dmin = Math.min(...step.map(x => Math.min(Math.abs(x - c), q - Math.abs(x - c)))); if (dmin > bd) { bd = dmin; best = c; } } step.push(best); }
      for (const s of step) { [0, 2, 1, 3].forEach(k => { const b = s + k * q + 1; if (!used.has(b)) { used.add(b); order.push(b); } }); }
      return "Order: <b>" + order.join(" – ") + "</b>" + muted("Number bolts clockwise. Same pattern for each torque pass, then circular passes at 100%."); } },
  /* ---------- Rigging ---------- */
  { id: "sling", cat: "Rigging", title: "Sling leg tension", desc: "Equal legs, angle from horizontal. Three/four-leg slings: assume two legs carry the load.",
    fields: [N("w", "Load incl. rigging (t)", 5, 0.1), N("a", "Sling angle from horizontal (°)", 60), S("legs", "Legs carrying load", [["1", "1 (vertical)"], ["2", "2"]], "2")],
    calc(v) { if (!(v.a > 0 && v.a <= 90)) return "Angle must be between 1° and 90°."; const leg = v.w / v.legs / Math.sin(rad(v.a));
      const st = v.a < 30 ? pill("bad", "Below 30°: not allowed") : v.a < 45 ? pill("warn", "Low angle") : pill("ok", "OK");
      return "Each leg <b>" + f(leg, 2) + " t</b> " + st + "<br>Angle factor " + f(1 / Math.sin(rad(v.a)), 3); } },
  { id: "slinglen", cat: "Rigging", title: "Sling angle from lengths", desc: "Find the angle and factor from sling length and lifting point spacing.",
    fields: [N("l", "Sling leg length (m)", 3), N("s", "Distance between lifting points (m)", 3)],
    calc(v) { const half = v.s / 2; if (half >= v.l) return "Sling too short for that spacing."; const h = Math.sqrt(v.l * v.l - half * half); const a = Math.asin(h / v.l) * 180 / Math.PI;
      return "Height to hook " + f(h, 2) + " m<br>Angle <b>" + f(a, 1) + "°</b> from horizontal<br>Factor (L/H) " + f(v.l / h, 3) + (a < 30 ? " " + pill("bad", "Too flat") : ""); } },
  { id: "cog", cat: "Rigging", title: "Unequal sling loads", desc: "Two lifting points with the centre of gravity off centre.",
    fields: [N("w", "Load (t)", 10, 0.1), N("ab", "Distance A to B (m)", 4, 0.1), N("da", "CoG distance from A (m)", 1, 0.1), N("h", "Hook height above points (m)", 3, 0.1)],
    calc(v) { const va = v.w * (v.ab - v.da) / v.ab, vb = v.w * v.da / v.ab; const la = Math.hypot(v.da, v.h), lb = Math.hypot(v.ab - v.da, v.h);
      return "Vertical at A " + f(va, 2) + " t, at B " + f(vb, 2) + " t<br>Sling A length " + f(la, 2) + " m, tension <b>" + f(va * la / v.h, 2) + " t</b><br>Sling B length " + f(lb, 2) + " m, tension <b>" + f(vb * lb / v.h, 2) + " t</b>" + muted("Hook directly over the CoG. Leg A is the shorter, more heavily loaded leg."); } },
  { id: "crane", cat: "Rigging", title: "Crane chart utilisation", desc: "Percentage of chart capacity including all rigging.",
    fields: [N("load", "Load (t)", 8.2, 0.1), N("rig", "Slings, shackles, spreader (t)", 0.4, 0.1), N("hook", "Hook block (t)", 0.6, 0.1), N("chart", "Chart capacity at radius (t)", 11.5, 0.1)],
    calc(v) { const tot = v.load + v.rig + v.hook; const p = tot / v.chart * 100; const st = p > 100 ? pill("bad", "Overload") : p > 85 ? pill("bad", "Critical lift") : p > 75 ? pill("warn", "Critical lift (many sites)") : pill("ok", "Routine range");
      return "Total <b>" + f(tot, 2) + " t</b><br>Utilisation <b>" + f(p, 0) + "%</b> " + st; } },
  { id: "ground", cat: "Rigging", title: "Outrigger mat size", desc: "Mat area needed so ground pressure stays under the allowable bearing capacity.",
    fields: [N("p", "Outrigger load (t)", 40), N("q", "Allowable ground bearing (kPa)", 200), N("side", "Mat side you have (m)", 1.5, 0.1)],
    calc(v) { const F = v.p * 9.81; const A = F / v.q; const pr = F / (v.side * v.side);
      return "Area needed <b>" + f(A, 2) + " m²</b> (square " + f(Math.sqrt(A), 2) + " m)<br>Your mat: " + f(pr, 0) + " kPa " + (pr <= v.q ? pill("ok", "OK") : pill("bad", "Too small")) + muted("Mat must be stiff enough to spread the load across its full area."); } },
  { id: "plate", cat: "Rigging", title: "Steel weight", desc: "Weight of plate, round bar, or pipe in carbon steel.",
    fields: [S("shape", "Shape", [["plate", "Plate"], ["bar", "Round bar"], ["pipe", "Pipe"]]), N("a", "Plate length (m) / bar or pipe OD (mm)", 2, 0.1), N("b", "Plate width (m) / pipe wall (mm)", 1, 0.1), N("c", "Plate thickness (mm) / bar or pipe length (m)", 20, 0.1)],
    calc(v) { let kg;
      if (v.shape === "plate") kg = v.a * v.b * v.c * 7.85;
      else if (v.shape === "bar") kg = Math.PI * Math.pow(v.a / 1000, 2) / 4 * v.c * 7850;
      else kg = 0.02466 * v.b * (v.a - v.b) * v.c;
      return "Weight <b>" + f(kg, 1) + " kg</b> (" + f(kg / 1000, 3) + " t)" + muted(v.shape === "pipe" ? "Per metre: " + f(0.02466 * v.b * (v.a - v.b), 2) + " kg/m. Stainless about 1–2% heavier." : "Density 7,850 kg/m³."); } },
  /* ---------- Piping ---------- */
  { id: "offset", cat: "Piping", title: "Pipe offset", desc: "Travel and run for an offset, with optional roll for a rolling offset.",
    fields: [N("s", "Set (mm)", 400), N("r", "Roll (mm)", 0), S("a", "Fitting angle", [["45", "45°"], ["22.5", "22.5°"], ["30", "30°"], ["60", "60°"], ["11.25", "11.25°"]])],
    calc(v) { const ts = Math.hypot(v.s, v.r || 0); const a = rad(v.a); return (v.r ? "True set <b>" + f(ts, 0) + " mm</b><br>" : "") + "Travel <b>" + f(ts / Math.sin(a), 0) + " mm</b><br>Run <b>" + f(ts / Math.tan(a), 0) + " mm</b>" + muted("Cut length = travel − 2 × fitting take-out − root gaps."); } },
  { id: "elbow", cat: "Piping", title: "Elbow take-out", desc: "Centre-to-end of a long or short radius elbow at any angle.",
    fields: [N("nps", "NPS (inches)", 6, 0.5), S("r", "Radius", [["1.5", "Long radius (1.5D)"], ["1", "Short radius (1D)"], ["3", "3D bend"], ["5", "5D bend"]]), N("ang", "Angle (°)", 90)],
    calc(v) { const R = v.r * v.nps * 25.4; const t = R * Math.tan(rad(v.ang / 2)); return "Radius " + f(R, 1) + " mm<br>Take-out <b>" + f(t, 1) + " mm</b>" + muted("NPS 1/2–3 standard LR elbows differ slightly from 1.5 × NPS. Check B16.9 for small sizes."); } },
  { id: "cutlen", cat: "Piping", title: "Pipe cut length", desc: "Cut length between two fittings.",
    fields: [N("cc", "Centre-to-centre (mm)", 1500), N("t1", "Take-out fitting 1 (mm)", 229), N("t2", "Take-out fitting 2 (mm)", 229), N("g", "Root gap each weld (mm)", 3, 0.5)],
    calc(v) { return "Cut length <b>" + f(v.cc - v.t1 - v.t2 - 2 * v.g, 1) + " mm</b>"; } },
  { id: "branch", cat: "Piping", title: "Branch saddle template", desc: "Ordinates for cutting a 90° branch onto a header (same centreline).",
    fields: [N("r", "Branch OD (mm)", 114.3), N("R", "Header OD (mm)", 219.1), S("div", "Divisions", [["16", "16"], ["12", "12"], ["24", "24"]])],
    calc(v) { const r = v.r / 2, R = v.R / 2; if (r > R) return "Branch must not be larger than the header."; const n = +v.div; const rows = [];
      for (let i = 0; i <= n / 4; i++) { const th = i * 360 / n; const h = R - Math.sqrt(R * R - Math.pow(r * Math.sin(rad(th)), 2)); rows.push(f(th, 1) + "°: <b>" + f(h, 1) + " mm</b>"); }
      return "Wrap length " + f(Math.PI * v.r, 0) + " mm, spacing " + f(Math.PI * v.r / n, 1) + " mm<br>" + rows.join("<br>") + muted("Ordinates repeat symmetrically around the circle. Measure down from a square reference line."); } },
  { id: "cone", cat: "Piping", title: "Cone / reducer layout", desc: "Flat pattern for a concentric cone (use mean diameters).",
    fields: [N("D", "Large diameter (mm)", 1000), N("d", "Small diameter (mm)", 500), N("H", "Height (mm)", 400)],
    calc(v) { if (v.d >= v.D) return "Small diameter must be less than large."; const Hf = v.H * v.D / (v.D - v.d); const L = Math.hypot(Hf, v.D / 2); const l = L * v.d / v.D; const th = 360 * (v.D / 2) / L;
      return "Outer radius <b>" + f(L, 1) + " mm</b><br>Inner radius <b>" + f(l, 1) + " mm</b><br>Developed angle <b>" + f(th, 1) + "°</b>" + (th > 360 ? "" : "<br>Chord across ends " + f(2 * L * Math.sin(rad(th / 2)), 0) + " mm"); } },
  { id: "hydro", cat: "Piping", title: "Hydrotest pressure", desc: "ASME B31.3 hydrostatic test pressure: 1.5 × P × St/S.",
    fields: [N("p", "Design pressure (bar g)", 20), N("st", "Allowable stress at test temp (MPa)", 138), N("s", "Allowable stress at design temp (MPa)", 138)],
    calc(v) { const r = Math.min(v.st / v.s, 6.5); const pt = 1.5 * v.p * r; return "Stress ratio " + f(r, 3) + "<br>Hydro test <b>" + f(pt, 1) + " bar g</b><br>Pneumatic (1.1 ×) " + f(1.1 * v.p, 1) + " bar g<br>Gauge range " + f(pt * 1.5, 0) + "–" + f(pt * 4, 0) + " bar" + muted("Check that test stress stays below yield at test temperature."); } },
  { id: "contents", cat: "Piping", title: "Pipe volume & water", desc: "Volume and water weight for filling or hydrotesting a line.",
    fields: [N("id", "Inside diameter (mm)", 154.1, 0.1), N("l", "Length (m)", 120)],
    calc(v) { const lpm = Math.PI * Math.pow(v.id / 1000, 2) / 4 * 1000; const tot = lpm * v.l; return "Per metre " + f(lpm, 2) + " L<br>Total <b>" + f(tot, 0) + " L</b> (" + f(tot / 1000, 2) + " m³, " + f(tot / 1000, 2) + " t of water)"; } },
  /* ---------- Welding ---------- */
  { id: "heatin", cat: "Welding", title: "Heat input", desc: "Arc energy and ISO heat input from volts, amps and travel speed.",
    fields: [N("v", "Volts", 24), N("a", "Amps", 140), N("len", "Weld length (mm)", 150), N("t", "Time (s)", 60), S("k", "Process (ISO k)", [["0.8", "SMAW / GMAW / FCAW (0.8)"], ["0.6", "GTAW (0.6)"], ["1.0", "SAW (1.0)"]])],
    calc(v) { const speed = v.len / v.t * 60; const ae = v.v * v.a * 60 / (speed * 1000); return "Travel speed " + f(speed, 0) + " mm/min<br>Arc energy <b>" + f(ae, 2) + " kJ/mm</b><br>Heat input (ISO) <b>" + f(ae * v.k, 2) + " kJ/mm</b>" + muted("ASME IX uses arc energy (no k factor)."); } },
  { id: "ce", cat: "Welding", title: "Carbon equivalent", desc: "IIW carbon equivalent from the mill certificate, with a preheat hint.",
    fields: [N("c", "C %", 0.18, 0.01), N("mn", "Mn %", 1.2, 0.01), N("cr", "Cr %", 0.05, 0.01), N("mo", "Mo %", 0.02, 0.01), N("v", "V %", 0.01, 0.01), N("ni", "Ni %", 0.05, 0.01), N("cu", "Cu %", 0.1, 0.01), N("t", "Thickness (mm)", 25)],
    calc(v) { const ce = v.c + v.mn / 6 + (v.cr + v.mo + v.v) / 5 + (v.ni + v.cu) / 15;
      const hint = ce < 0.4 ? (v.t > 40 ? pill("warn", "Light preheat on thick section") : pill("ok", "Low risk")) : ce < 0.5 ? pill("warn", "Preheat needed") : pill("bad", "High risk: preheat, low-H, control cooling");
      return "CE (IIW) <b>" + f(ce, 3) + "</b> " + hint + muted("The WPS sets the actual preheat."); } },
  { id: "rods", cat: "Welding", title: "Electrode estimate", desc: "Weld metal needed for a single-V butt joint and number of electrodes.",
    fields: [N("t", "Thickness (mm)", 12), N("ang", "Included angle (°)", 60), N("gap", "Root gap (mm)", 2.5, 0.5), N("len", "Weld length (m)", 5, 0.1), S("rod", "Electrode", [["3.2", "3.2 mm × 350 (≈ 0.022 kg deposit)"], ["4", "4.0 mm × 350 (≈ 0.035 kg deposit)"], ["2.5", "2.5 mm × 350 (≈ 0.013 kg deposit)"]])],
    calc(v) { const area = v.t * v.t * Math.tan(rad(v.ang / 2)) + v.gap * v.t; const area2 = area * 1.15; const kg = area2 * 1e-6 * v.len * 7850; const dep = { "3.2": 0.022, "4": 0.035, "2.5": 0.013 }[v.rod];
      return "Cross-section ≈ " + f(area2, 0) + " mm² (with 15% cap)<br>Weld metal <b>" + f(kg, 2) + " kg</b><br>Electrodes ≈ <b>" + f(Math.ceil(kg / dep), 0) + "</b>" + muted("Deposit per rod after stub loss is approximate. Add 10–20% for waste."); } },
  { id: "dft", cat: "Welding", title: "Paint WFT / DFT", desc: "Dry film from wet film and volume solids; paint needed for an area.",
    fields: [N("dft", "Target DFT (µm)", 125), N("vs", "Volume solids (%)", 65), N("area", "Area (m²)", 50), N("loss", "Loss factor (%)", 30)],
    calc(v) { const wft = v.dft / (v.vs / 100); const lit = v.area * v.dft / (v.vs * 10) / (1 - v.loss / 100); return "Wet film <b>" + f(wft, 0) + " µm</b><br>Theoretical spread " + f(v.vs * 10 / v.dft, 2) + " m²/L<br>Paint needed <b>" + f(lit, 1) + " L</b>"; } },
  /* ---------- General ---------- */
  { id: "cyl", cat: "General", title: "Hydraulic cylinder", desc: "Push and pull force, and speed from pump flow.",
    fields: [N("bore", "Bore (mm)", 100), N("rod", "Rod (mm)", 56), N("p", "Pressure (bar)", 160), N("q", "Pump flow (L/min)", 40)],
    calc(v) { const A = Math.PI * v.bore ** 2 / 4 / 100, Ar = A - Math.PI * v.rod ** 2 / 4 / 100; return "Push <b>" + f(v.p * A / 100, 1) + " kN</b>, pull <b>" + f(v.p * Ar / 100, 1) + " kN</b><br>Extend " + f(v.q / (A * 0.1), 2) + " m/min, retract " + f(v.q / (Ar * 0.1), 2) + " m/min"; } },
  { id: "units", cat: "General", title: "Unit converter", desc: "The conversions that come up every shift.",
    fields: [N("v", "Value", 10, "any"), S("t", "Convert", [["bar-psi", "bar → psi"], ["psi-bar", "psi → bar"], ["nm-ftlb", "N·m → ft·lb"], ["ftlb-nm", "ft·lb → N·m"], ["mm-in", "mm → in"], ["in-mm", "in → mm"], ["c-f", "°C → °F"], ["f-c", "°F → °C"], ["kw-hp", "kW → hp"], ["hp-kw", "hp → kW"], ["m3h-gpm", "m³/h → US gpm"], ["gpm-m3h", "US gpm → m³/h"], ["kg-lb", "kg → lb"], ["lb-kg", "lb → kg"], ["mpa-ksi", "MPa → ksi"], ["ksi-mpa", "ksi → MPa"], ["kn-t", "kN → tonne-force"], ["ins-mms", "in/s pk → mm/s RMS"], ["mms-ins", "mm/s RMS → in/s pk"]])],
    calc(v) { const x = v.v; const m = { "bar-psi": [x * 14.5038, "psi"], "psi-bar": [x / 14.5038, "bar"], "nm-ftlb": [x * 0.73756, "ft·lb"], "ftlb-nm": [x * 1.35582, "N·m"], "mm-in": [x / 25.4, "in"], "in-mm": [x * 25.4, "mm"], "c-f": [x * 1.8 + 32, "°F"], "f-c": [(x - 32) / 1.8, "°C"], "kw-hp": [x * 1.34102, "hp"], "hp-kw": [x * 0.7457, "kW"], "m3h-gpm": [x * 4.40287, "US gpm"], "gpm-m3h": [x * 0.22712, "m³/h"], "kg-lb": [x * 2.20462, "lb"], "lb-kg": [x * 0.453592, "kg"], "mpa-ksi": [x * 0.145038, "ksi"], "ksi-mpa": [x * 6.89476, "MPa"], "kn-t": [x / 9.80665, "t"], "ins-mms": [x * 25.4 / Math.SQRT2, "mm/s RMS"], "mms-ins": [x * Math.SQRT2 / 25.4, "in/s pk"] }[v.t];
      return "<b>" + f(m[0], 4) + " " + m[1] + "</b>"; } },
  { id: "steam", cat: "General", title: "Steam saturation temperature", desc: "Approximate saturation temperature from gauge pressure (0–100 bar g).",
    fields: [N("p", "Pressure (bar g)", 10, 0.1)],
    calc(v) { const t = [[0, 100], [1, 120.4], [2, 133.7], [3, 143.7], [4, 151.9], [5, 158.9], [7, 170.5], [10, 184.1], [15, 201.4], [20, 214.9], [30, 235.7], [40, 251.8], [60, 276.6], [100, 311.5]];
      if (v.p < 0 || v.p > 100) return "Enter 0 to 100 bar g."; let i = 0; while (i < t.length - 2 && v.p > t[i + 1][0]) i++; const [p1, t1] = t[i], [p2, t2] = t[i + 1]; const T = t1 + (t2 - t1) * (v.p - p1) / (p2 - p1);
      return "Saturation ≈ <b>" + f(T, 1) + " °C</b>" + muted("Linear interpolation between table points."); } },
  ];

  // An old cached page may not load tools-ui.js; fetch it next to this file before rendering.
  const go = () => FHTools.render(tools, { lang: "en", count: tools.length + " calculators", err: "Check the inputs." });
  if (window.FHTools) go();
  else { const sc = document.createElement("script"); sc.src = SELF.replace(/[^/]*$/, "tools-ui.js?v=" + UI_VER); sc.onload = go; document.head.appendChild(sc); }
})();
