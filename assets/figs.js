// Labelled diagrams for topic pages (English and Bangla). Each page that has a figure loads this file;
// the figure is chosen by the page path and inserted before the first section heading.
(function () {
  const bn = document.documentElement.lang === "bn", L = (en, b) => (bn ? b : en);
  const r1 = v => Math.round(v * 10) / 10;
  const T = (x, y, s, cls = "tx", a = "middle") => '<text x="' + r1(x) + '" y="' + r1(y) + '" class="' + cls + '" text-anchor="' + a + '">' + s + "</text>";
  // callout: dot on the part, leader line, label
  const lab = (px, py, tx, ty, s, a = "start") => '<circle cx="' + px + '" cy="' + py + '" r="2.5" class="hubdot"/><path class="dm" d="M' + px + " " + py + "L" + tx + " " + ty + '"/>' + T(tx + (a === "start" ? 4 : a === "end" ? -4 : 0), ty + 4, s, "tx", a);
  const svg = (w, h, body) => '<svg viewBox="0 0 ' + w + " " + h + '" role="img" aria-hidden="true">' + body + "</svg>";
  const pipe = (d, w, tone = "") => '<path class="po" d="' + d + '" stroke-width="' + (w + 3) + '"/><path class="pi ' + tone + '" d="' + d + '" stroke-width="' + w + '"/>';

  const FIG = {
    "rotary/centrifugal-pumps"() {
      // volute: spiral from the cutwater (r 78) round to r 104, then a tangential discharge to the right
      const cx = 150, cy = 160; let vol = "M" + cx + " " + (cy - 78);
      for (let i = 1; i <= 60; i++) { const a = -Math.PI / 2 - i / 60 * 2 * Math.PI, r = 78 + 26 * i / 60; vol += "L" + r1(cx + r * Math.cos(a)) + " " + r1(cy + r * Math.sin(a)); }
      vol += "L" + (cx + 120) + " " + (cy - 104) + "V" + (cy - 78) + "z";
      let vanes = ""; for (let i = 0; i < 6; i++) vanes += '<path class="vane" d="M' + cx + " " + (cy - 18) + "q-26 -10 -40 -42" + '" transform="rotate(' + i * 60 + " " + cx + " " + cy + ')"/>';
      return [svg(480, 320, '<path class="fs" d="' + vol + '"/><circle cx="' + cx + '" cy="' + cy + '" r="76" class="water"/>' +
        '<g class="spin" style="--t:1.6s"><circle cx="' + cx + '" cy="' + cy + '" r="64" class="f"/>' + vanes + '<circle cx="' + cx + '" cy="' + cy + '" r="18" class="fa"/></g>' +
        '<path class="flow" d="M' + (cx + 91) + " " + cy + "A91 91 0 0 1 " + cx + " " + (cy + 91) + "A91 91 0 0 1 " + (cx - 91) + " " + cy + "A91 91 0 0 1 " + cx + " " + (cy - 91) + "H" + (cx + 120) + '"/>' +
        lab(cx + 115, cy - 91, 305, 30, L("Discharge", "ডিসচার্জ")) + lab(cx - 70, cy + 70, 305, 280, L("Casing (volute)", "কেসিং (ভলিউট)")) + lab(cx + 30, cy - 40, 305, 120, L("Impeller", "ইমপেলার")) +
        lab(cx, cy, 305, 170, L("Eye: suction enters here", "আই: সাকশন এখানে ঢোকে")) + lab(cx + 2, cy - 79, 305, 75, L("Cutwater", "কাটওয়াটার")) +
        ""),
        L("End view of a single-stage end-suction pump. The impeller turns, liquid follows the dashed path to the discharge.", "এক-স্টেজ এন্ড-সাকশন পাম্প, সামনে থেকে। ইমপেলার ঘোরে, তরল ড্যাশ দাগ ধরে ডিসচার্জে যায়।")];
    },
    "rotary/mechanical-seals"() {
      return [svg(480, 300, '<rect x="20" y="40" width="160" height="200" class="water"/>' + T(100, 30, L("Process liquid", "প্রসেস তরল"), "ts") + T(400, 30, L("Atmosphere", "বাইরের বাতাস"), "ts") +
        '<rect x="20" y="240" width="440" height="36" class="fl"/>' + T(240, 263, L("Shaft (turns)", "শ্যাফট (ঘোরে)"), "tx") +
        '<rect x="120" y="222" width="230" height="18" class="fs"/>' +
        '<path class="fs" d="M300 40H460V150H330V200H300z"/>' + T(400, 100, L("Gland plate", "গ্ল্যান্ড প্লেট"), "tx") +
        '<rect x="262" y="120" width="34" height="80" class="face st"/><rect x="236" y="120" width="26" height="80" class="face rot"/>' +
        '<path class="spring" d="M150 180l8 -24l8 24l8 -24l8 24l8 -24l8 24l8 -24l8 24"/><rect x="140" y="150" width="12" height="56" class="fs"/><rect x="214" y="150" width="22" height="56" class="fs"/>' +
        '<circle cx="246" cy="214" r="6" class="oring"/><circle cx="296" cy="128" r="6" class="oring"/><circle cx="310" cy="200" r="6" class="oring"/>' +
        '<path class="film" d="M262 122V198"/><path class="leak" d="M262 130V200"/>' +
        lab(249, 140, 150, 80, L("Rotating face", "ঘূর্ণায়মান ফেস"), "end") + lab(282, 150, 350, 175, L("Stationary face", "স্থির ফেস")) + lab(180, 168, 120, 112, L("Springs", "স্প্রিং"), "end") +
        lab(246, 214, 200, 290, L("O-rings (secondary seals)", "ও-রিং (সেকেন্ডারি সিল)"), "middle") + lab(262, 160, 350, 214, L("Liquid film", "তরলের স্তর"))),
        L("Half section of a pusher-type single seal. Sealing happens across the flat faces; the springs and O-rings only hold them in place.", "পুশার-টাইপ সিঙ্গেল সিলের অর্ধেক কাটা ছবি। আসল সিলিং দুই সমতল ফেসের মাঝে; স্প্রিং ও ও-রিং শুধু ধরে রাখে।")];
    },
    "rotary/alignment"() {
      const panel = (x, title, dy, ang) => '<g transform="translate(' + x + ' 0)">' + T(70, 24, title, "ta") + '<path class="d" d="M0 110H150"/>' + pipe("M6 110H70", 14) + '<rect x="66" y="94" width="8" height="32" class="f"/>' +
        '<g transform="translate(0 ' + dy + ") rotate(" + ang + ' 78 110)">' + '<rect x="78" y="94" width="8" height="32" class="f"/>' + pipe("M86 110H146", 14, "b") + '<path class="cl" d="M78 110H150"/></g></g>';
      return [svg(480, 190, panel(10, L("Offset (parallel)", "অফসেট (সমান্তরাল)"), 18, 0) + panel(170, L("Angular", "কৌণিক"), 0, -9) + panel(330, L("Both (usual)", "দুটোই (সাধারণত)"), 12, -7) +
        T(240, 175, L("Dashed = driver centre line. Blue shaft is the movable machine.", "ড্যাশ = ড্রাইভারের সেন্টারলাইন। নীল শ্যাফট = চলমান মেশিন।"), "ts")),
        L("The three kinds of misalignment, exaggerated. Correct vertical first (shims), then horizontal.", "তিন রকম মিসঅ্যালাইনমেন্ট, বাড়িয়ে দেখানো। আগে উল্লম্ব (শিম), তারপর আনুভূমিক ঠিক করুন।")];
    },
    "rotary/rolling-bearings"() {
      const box = (x, title, elem, rad, ax) => '<g transform="translate(' + x + ' 0)"><rect x="10" y="40" width="90" height="22" class="fl"/><rect x="10" y="118" width="90" height="22" class="fl"/>' + elem + T(55, 24, title, "ts") +
        T(55, 162, L("radial ", "রেডিয়াল ") + rad, "ts") + T(55, 178, L("axial ", "অক্ষীয় ") + ax, "ts") + "</g>";
      return [svg(480, 190, box(0, L("Deep groove ball", "ডিপ গ্রুভ বল"), '<circle cx="55" cy="90" r="27" class="fa"/>', "●●", "●") +
        box(120, L("Cylindrical roller", "সিলিন্ড্রিক্যাল রোলার"), '<rect x="30" y="62" width="50" height="56" rx="3" class="fa"/>', "●●●", "–") +
        box(240, L("Tapered roller", "টেপারড রোলার"), '<path class="fa" d="M26 70L82 60L88 112L32 122z"/>', "●●●", "●●") +
        box(360, L("Spherical roller", "স্ফেরিক্যাল রোলার"), '<path class="fa" d="M28 64Q55 54 82 64Q90 90 82 116Q55 126 28 116Q20 90 28 64z"/>', "●●●", "●")),
        L("Four common types, cut through one rolling element. More dots = more load it can take in that direction.", "চার রকম সাধারণ বেয়ারিং, একটি রোলিং এলিমেন্ট বরাবর কাটা। ডট বেশি = ওই দিকে বেশি লোড নিতে পারে।")];
    },
    "rotary/vibration"() {
      const X = o => 50 + o * 80, bars = [[1, 150, "acc", L("1× radial: unbalance", "১× রেডিয়াল: আনব্যালান্স")], [2, 90, "b", L("2× axial: misalignment", "২× অক্ষীয়: মিসঅ্যালাইনমেন্ট")], [3, 40, "o", ""], [4, 30, "o", ""], [4.7, 55, "r", L("non-synchronous: bearing", "নন-সিনক্রোনাস: বেয়ারিং")]];
      return [svg(480, 260, '<path class="dm" d="M40 30V210H460"/>' + T(30, 120, L("mm/s", "mm/s"), "ts", "end") + T(250, 245, L("frequency (orders of running speed)", "ফ্রিকোয়েন্সি (রানিং স্পিডের গুণিতক)"), "ts") +
        [1, 2, 3, 4, 5].map(o => T(X(o), 226, o + "×", "ts")).join("") +
        bars.map(([o, h, c, t], i) => '<rect class="bar grow spk ' + c + '" style="--i:' + i + '" x="' + (X(o) - 7) + '" y="' + (210 - h) + '" width="14" height="' + h + '"/>' + (t ? (o > 4 ? lab(X(o), 210 - h, 470, 96, t, "end") : T(X(o) + 12, 210 - h + 12, t, "tx", "start")) : "")).join("") +
        T(X(3.5), 162, L("many harmonics: looseness", "অনেক হারমোনিক: ঢিলা"), "ts")),
        L("A spectrum splits overall vibration by frequency. Where the peak sits tells you the likely fault.", "স্পেকট্রাম মোট ভাইব্রেশনকে ফ্রিকোয়েন্সি অনুযায়ী ভাগ করে। পিক কোথায়, তা থেকে সম্ভাব্য ত্রুটি বোঝা যায়।")];
    },
    "static/shell-tube"() {
      let tubes = ""; for (let y = 100; y <= 180; y += 16) tubes += '<path class="dm" d="M90 ' + y + 'H390"/>';
      let baf = ""; [140, 200, 260, 320].forEach((x, i) => { baf += '<rect x="' + x + '" y="' + (i % 2 ? 110 : 80) + '" width="6" height="110" class="fa"/>'; });
      return [svg(480, 280, '<rect x="80" y="80" width="320" height="120" rx="10" class="fs"/><rect x="40" y="70" width="44" height="140" rx="16" class="fl"/><rect x="396" y="70" width="44" height="140" rx="16" class="fl"/>' +
        '<rect x="84" y="72" width="8" height="136" class="f"/><rect x="388" y="72" width="8" height="136" class="f"/>' + tubes + baf +
        pipe("M120 30V80", 14, "b") + pipe("M360 200V250", 14, "b") + pipe("M60 30V70", 12) + pipe("M60 210V250", 12) +
        '<path class="flow" d="M120 30V95H170V185H230V95H290V185H350V250"/><path class="flowt" d="M60 30V100H420M420 180H60V250"/>' +
        lab(160, 140, 160, 20, L("Shell side (dashed path)", "শেল সাইড (ড্যাশ পথ)"), "middle") + lab(260, 120, 300, 20, L("Baffles", "ব্যাফল")) + lab(88, 120, 10, 268, L("Tubesheet", "টিউবশিট"), "start") +
        lab(62, 150, 110, 268, L("Channel / head", "চ্যানেল / হেড"), "start") + lab(240, 172, 250, 268, L("Tubes (tube-side flow)", "টিউব (টিউব-সাইড প্রবাহ)"), "start")),
        L("Shell-and-tube exchanger: one fluid zig-zags across the tubes guided by baffles, the other runs inside the tubes.", "শেল-অ্যান্ড-টিউব এক্সচেঞ্জার: একটি তরল ব্যাফলের সাহায্যে টিউবের ওপর দিয়ে এঁকেবেঁকে যায়, অন্যটি টিউবের ভেতর দিয়ে।")];
    },
    "fabrication/weld-defects"() {
      const W = (x, y, title, extra) => '<g transform="translate(' + x + " " + y + ')"><path class="fl" d="M0 60H50L36 20H0z"/><path class="fl" d="M140 60H90L104 20H140z"/><path class="bead" d="M50 60H90L104 20Q70 6 36 20z"/>' + extra + T(70, 84, title, "tx") + "</g>";
      return [svg(480, 300, W(5, 20, L("Porosity", "পোরোসিটি"), '<circle cx="62" cy="36" r="3" class="hole"/><circle cx="76" cy="44" r="2.5" class="hole"/><circle cx="70" cy="28" r="2" class="hole"/>') +
        W(165, 20, L("Slag inclusion", "স্ল্যাগ ইনক্লুশন"), '<path d="M58 40l20 -4 4 5 -20 4z" class="defect"/>') +
        W(325, 20, L("Lack of sidewall fusion", "সাইডওয়াল ফিউশন হয়নি"), '<path d="M39 24L50 56" class="crackl"/>') +
        W(5, 150, L("Undercut", "আন্ডারকাট"), '<path d="M30 20q6 8 10 0" class="defect"/>') +
        W(165, 150, L("Crack", "ক্র্যাক"), '<path d="M64 18l4 8 -5 6 6 8 -4 8" class="crackl"/>') +
        W(325, 150, L("Incomplete root penetration", "রুট পেনিট্রেশন অসম্পূর্ণ"), '<path d="M52 60H88" class="crackl"/>')),
        L("Weld cross-sections with the common defects. Red marks the defect.", "সাধারণ ওয়েল্ড ডিফেক্টসহ ওয়েল্ডের প্রস্থচ্ছেদ। লাল দাগ = ত্রুটি।")];
    },
    "fabrication/joint-design"() {
      return [svg(480, 260, '<path class="fl" d="M30 200H200V172L170 90H30z"/><path class="fl" d="M450 200H280V172L310 90H450z"/>' +
        '<path class="d" d="M240 60V210"/><path class="dm" d="M170 90L240 20M310 90L240 20"/>' +
        '<path class="arrow" d="M240 50A40 40 0 0 1 268 62"/><path class="dm" d="M268 62L326 72"/>' + T(330, 76, L("bevel angle (30–37.5°)", "বেভেল কোণ (৩০–৩৭.৫°)"), "ta", "start") +
        '<path class="dm" d="M170 70A80 80 0 0 1 310 70"/>' + T(240, 14, L("included (groove) angle 60–75°", "মোট (গ্রুভ) কোণ ৬০–৭৫°"), "ta") +
        '<path class="dm" d="M200 214H280"/>' + T(290, 232, L("root gap 2–4 mm", "রুট গ্যাপ ২–৪ mm"), "tx", "start") +
        lab(203, 186, 150, 232, L("root face 1–2 mm", "রুট ফেস ১–২ mm"), "end") +
        '<path class="dm" d="M24 90V200"/>' + T(20, 150, "t", "ta", "end") + T(240, 254, L("Single-V butt joint", "সিঙ্গেল-ভি বাট জয়েন্ট"), "ts")),
        L("Parts of a groove. These four numbers come from the WPS and are checked at fit-up.", "গ্রুভের অংশগুলো। এই চারটি মাপ WPS থেকে আসে এবং ফিট-আপে মিলিয়ে দেখা হয়।")];
    },
    "piping/flanges"() {
      const P = (x, title, body) => '<g transform="translate(' + x + ' 0)">' + body + T(45, 200, title, "tx") + "</g>";
      const pip = '<rect x="40" y="20" width="16" height="150" class="fs"/>';
      return [svg(480, 215, P(0, "WN", '<path class="fl" d="M20 120H80V140H20z"/><path class="fl" d="M30 120L40 60H56L66 120z"/>' + pip.replace('height="150"', 'height="40"') + '<rect class="wd" x="38" y="56" width="20" height="4"/>') +
        P(95, "SO", pip + '<path class="fl" d="M20 120H80V140H20z"/><rect x="56" y="104" width="12" height="16" class="fl"/><rect class="wd" x="54" y="102" width="5" height="5"/>') +
        P(190, "SW", '<rect x="44" y="20" width="12" height="96" class="fs"/><path class="fl" d="M20 120H80V140H20z"/><rect x="34" y="96" width="32" height="24" class="fl"/><rect class="wd" x="40" y="92" width="5" height="5"/>') +
        P(285, "LJ", pip + '<rect x="30" y="140" width="36" height="8" class="fa"/><path class="fl" d="M14 120H82V140H14z"/>') +
        P(380, L("Blind", "ব্লাইন্ড"), '<path class="fl" d="M10 120H80V140H10z"/>')),
        L("Half sections. WN = weld neck (butt weld, best for high duty), SO = slip-on, SW = socket weld, LJ = lap joint with stub end (orange).", "অর্ধেক কাটা ছবি। WN = ওয়েল্ড নেক (বাট ওয়েল্ড, কঠিন কাজে সেরা), SO = স্লিপ-অন, SW = সকেট ওয়েল্ড, LJ = স্টাব এন্ডসহ ল্যাপ জয়েন্ট (কমলা)।")];
    },
    "rigging/sling-loads"() {
      return [svg(480, 230, [90, 60, 45, 30].map((a, i) => {
        const x = 60 + i * 115, hs = a === 90 ? 0 : 34, h = a === 90 ? 80 : Math.min(90, hs * Math.tan(a * Math.PI / 180)), pct = Math.round(50 / Math.sin(a * Math.PI / 180));
        const cls = pct >= 100 ? "bad" : pct > 70 ? "warn" : "ok";
        return '<rect x="' + (x - 40) + '" y="140" width="80" height="24" class="fs"/><path class="sl ' + cls + '" d="M' + (x - hs) + " 140L" + x + " " + (140 - h) + "L" + (x + hs) + ' 140"/>' + T(x, 128 - h, a + "°", "ta") + T(x, 186, pct + "% " + L("per leg", "প্রতি লেগে"), "tx") + T(x, 204, "× " + (1 / Math.sin(a * Math.PI / 180)).toFixed(2), "ts");
      }).join("") + T(240, 224, L("Two legs, load 100%. Below 30° the legs take more than the whole load.", "দুই লেগ, লোড ১০০%। ৩০°-এর নিচে প্রতিটি লেগ পুরো লোডের চেয়েও বেশি নেয়।"), "ts")),
        L("Sling angle from horizontal and the share of the load on each leg.", "আনুভূমিক থেকে স্লিং-এর কোণ এবং প্রতিটি লেগে লোডের অংশ।")];
    },
    "safety/working-at-height"() {
      return [svg(480, 300, '<rect x="300" y="20" width="22" height="250" class="fl"/><path class="fsoft" d="M20 270H460v14H20z"/><path class="fs" d="M300 80H460V96H300z"/>' + T(380, 74, L("landing", "ল্যান্ডিং"), "ts") +
        '<path class="ladder" d="M230 270L300 50M242 270L312 50"/>' + Array.from({ length: 8 }, (_, i) => { const t = (i + 1) / 9; return '<path class="dm" d="M' + r1(230 + 70 * t) + " " + r1(270 - 220 * t) + "L" + r1(242 + 70 * t) + " " + r1(270 - 220 * t) + '"/>'; }).join("") +
        '<path class="dm" d="M230 284H300"/>' + T(265, 298, L("1 out", "১ ভাগ বাইরে"), "ta") + '<path class="dm" d="M340 270V96"/>' + T(346, 190, L("4 up", "৪ ভাগ উপরে"), "ta", "start") +
        '<path class="arrow" d="M286 80V50"/>' + T(240, 40, L("1 m above the landing", "ল্যান্ডিং-এর ১ মিটার উপরে"), "tx", "end") + T(210, 220, "≈ 75°", "ta", "end") +
        lab(236, 262, 215, 252, L("feet on firm level ground", "পা শক্ত সমতল জায়গায়"), "end") + lab(296, 92, 150, 120, L("tie off at the top", "উপরে বেঁধে নিন"), "end")),
        L("The 1-in-4 rule: for every 4 m up, the foot is 1 m out from the wall (about 75°).", "১-এ-৪ নিয়ম: প্রতি ৪ মিটার উচ্চতায় পায়া দেয়াল থেকে ১ মিটার দূরে (প্রায় ৭৫°)।")];
    },
    "safety/gas-testing"() {
      return [svg(480, 300, '<rect x="20" y="40" width="180" height="230" rx="18" class="f"/><rect x="80" y="20" width="60" height="22" class="fl"/>' +
        '<rect x="22" y="42" width="176" height="60" rx="14" class="gtop"/><rect x="22" y="200" width="176" height="68" rx="14" class="gbot"/>' +
        '<path class="probe" d="M110 10V230"/>' + [70, 150, 230].map((y, i) => '<circle cx="110" cy="' + y + '" r="7" class="sample" style="--i:' + i + '"/>').join("") +
        T(215, 66, L("Top: lighter gases (methane, hydrogen)", "উপরে: হালকা গ্যাস (মিথেন, হাইড্রোজেন)"), "tx", "start") +
        T(215, 154, L("Middle: oxygen level", "মাঝে: অক্সিজেনের মাত্রা"), "tx", "start") + T(215, 234, L("Bottom: heavier gases (H₂S, CO₂, vapours)", "নিচে: ভারী গ্যাস (H₂S, CO₂, বাষ্প)"), "tx", "start") +
        T(240, 292, L("Test order: O₂ → flammable (LEL) → toxic", "পরীক্ষার ক্রম: O₂ → দাহ্য (LEL) → বিষাক্ত"), "ta")),
        L("Test at the top, middle and bottom of a confined space before entry and keep testing while people are inside.", "ঢোকার আগে আবদ্ধ জায়গার উপরে, মাঝে ও নিচে পরীক্ষা করুন; ভেতরে লোক থাকাকালীন পরীক্ষা চালিয়ে যান।")];
    },
  };

  const path = location.pathname.replace(/^.*?\/(bn\/)?([a-z-]+\/[a-z0-9-]+)(\.html)?$/, "$2");
  const make = FIG[path], art = document.querySelector("article");
  if (!make || !art) return;
  const [s, cap] = make();
  const fig = document.createElement("figure");
  fig.className = "tviz tfig";
  fig.innerHTML = s + "<figcaption>" + cap + "</figcaption>";
  const at = art.querySelector("h3, h2:not(:first-of-type)");
  at ? at.before(fig) : art.appendChild(fig);
})();
