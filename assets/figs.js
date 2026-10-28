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


  // further figures and step players; each returns a list of [svg, caption, stepCaptions?, beforeHeadingText?]
  const st = (n, body) => '<g data-s="' + n + '">' + body + "</g>";
  const MORE = {
    "rotary/alignment"() {
      const base = '<rect x="20" y="196" width="440" height="14" class="fl"/><rect x="40" y="120" width="150" height="76" rx="8" class="fs"/>' + T(115, 162, L("PUMP (fixed)", "পাম্প (স্থির)"), "ts") +
        pipe("M190 152H232", 12) + '<rect x="230" y="134" width="10" height="36" class="f"/><rect x="242" y="134" width="10" height="36" class="f"/>' + pipe("M252 152H290", 12, "b") +
        '<rect x="290" y="112" width="160" height="84" rx="8" class="fs"/>' + T(370, 158, L("MOTOR (movable)", "মোটর (চলমান)"), "ts") + '<rect x="300" y="190" width="24" height="8" class="f"/><rect x="420" y="190" width="24" height="8" class="f"/>';
      const steps = [
        st(1, '<rect x="380" y="28" width="56" height="44" rx="6" class="f"/><path class="ring" d="M396 30v-10a12 12 0 0 1 24 0v10"/>' + T(408, 56, "LOTO", "ta")),
        st(2, '<path class="flow" d="M300 204h24M420 204h24"/>' + T(410, 240, L("clean feet & base", "পা ও বেস পরিষ্কার"), "ts")),
        st(3, '<path class="arrow" d="M200 140H286"/>' + T(241, 188, L("straight edge", "স্ট্রেইট এজ"), "ts")),
        st(4, '<circle cx="312" cy="178" r="12" class="f"/><path class="dm" d="M312 178l6-5"/>' + T(240, 240, L("soft foot ≤ 0.05", "সফট ফুট ≤ ০.০৫"), "ta")),
        st(5, '<rect x="212" y="100" width="16" height="30" class="fa"/><rect x="256" y="100" width="16" height="30" class="fa"/><path class="flowfast" style="--t:.6s;stroke:var(--bad)" d="M228 112H256"/>' + T(242, 88, L("laser / dials", "লেজার / ডায়াল"), "ta")),
        st(6, '<rect x="300" y="198" width="24" height="5" class="fa"/><rect x="420" y="198" width="24" height="5" class="fa"/><path class="arrow" d="M312 226v-14M432 226v-14"/>' + T(372, 270, L("shims: vertical", "শিম: উল্লম্ব"), "ta")),
        st(7, '<path class="arrow" d="M470 150h-14M470 150l-5-5M470 150l-5 5"/>' + T(462, 100, L("jack bolts", "জ্যাক বোল্ট"), "ta", "end")),
        st(8, '<rect x="40" y="24" width="64" height="76" rx="4" class="f"/><path class="dm" d="M50 44h44M50 58h44M50 72h30"/><path class="arrow" style="stroke:var(--ok)" d="M60 86l8 8 18-20"/>' + T(72, 116, L("record", "লিখে রাখুন"), "ta"))
      ].join("");
      return [[svg(480, 280, base + steps), L("The alignment job in eight steps. Press Play, or step through with the arrows.", "আট ধাপে অ্যালাইনমেন্টের কাজ। ▶ চালু চাপুন, অথবা তীর দিয়ে এক এক ধাপ দেখুন।"), [
        L("Lock out the motor and check both shafts turn by hand.", "মোটর লক আউট করুন, দুই শ্যাফট হাতে ঘোরে কিনা দেখুন।"),
        L("Clean the baseplate and the feet; dirt under a foot is a false reading.", "বেসপ্লেট ও পা পরিষ্কার করুন; পায়ের নিচে ময়লা মানে ভুল রিডিং।"),
        L("Rough align with a straight edge across the coupling, to about 0.5 mm.", "কাপলিং-এর ওপর স্ট্রেইট এজ রেখে মোটামুটি ০.৫ মিমির মধ্যে আনুন।"),
        L("Check soft foot one foot at a time. More than 0.05 mm: correct it now.", "একবারে এক পায়ের সফট ফুট দেখুন। ০.০৫ মিমির বেশি হলে এখনই ঠিক করুন।"),
        L("Fit the laser or dials and record the as-found offset and angle.", "লেজার বা ডায়াল লাগিয়ে শুরুর অফসেট ও কোণ লিখে রাখুন।"),
        L("Correct the vertical: add or remove shims under the front and back feet.", "উল্লম্ব ঠিক করুন: সামনের ও পেছনের পায়ে শিম দিন বা সরান।"),
        L("Correct the horizontal with the jack bolts while watching the dials.", "ডায়াল দেখতে দেখতে জ্যাক বোল্ট দিয়ে আনুভূমিক ঠিক করুন।"),
        L("Tighten the bolts in sequence, measure again, record the final values.", "ক্রম মেনে বোল্ট টাইট দিন, আবার মাপুন, শেষ মান লিখে রাখুন।")], "#s2"]];
    },
    "rotary/centrifugal-pumps"() {
      const base = '<rect x="20" y="214" width="440" height="12" class="fl"/>' + pipe("M20 178H120", 14, "b") + '<circle cx="150" cy="170" r="40" class="fs"/>' + pipe("M150 130V40H300", 14, "b") +
        '<rect x="200" y="148" width="70" height="44" rx="6" class="fl"/>' + pipe("M270 170H300", 10) + '<rect x="300" y="138" width="140" height="64" rx="8" class="fs"/>' + T(370, 175, L("MOTOR", "মোটর"), "ts") +
        '<path class="fl" d="M60 168l14 10-14 10zM88 168l-14 10 14 10z"/><path class="fl" d="M210 30l10 14-10 14zM238 30l-10 14 10 14z"/>' + T(74, 204, L("suction valve", "সাকশন ভাল্ভ"), "ts") + T(224, 22, L("discharge valve", "ডিসচার্জ ভাল্ভ"), "ts") +
        '<rect x="226" y="186" width="16" height="22" rx="3" class="f"/><circle cx="330" cy="70" r="20" class="f"/><path class="dm" d="M330 70l-12 -6"/>';
      const steps = [
        st(1, '<rect x="380" y="20" width="80" height="34" rx="6" class="f"/>' + T(420, 42, L("permit ✓", "পারমিট ✓"), "ta")),
        st(2, '<rect x="228" y="196" width="12" height="10" class="water"/>' + T(234, 252, L("oil level", "অয়েল লেভেল"), "ta")),
        st(3, '<path d="M60 168l14 10-14 10zM88 168l-14 10 14 10z" style="fill:var(--ok)"/><path class="flow" d="M20 178H120"/>' + T(74, 150, L("FULL open", "পুরো খোলা"), "ta")),
        st(4, '<path class="arrow" d="M150 128v-14"/><circle cx="150" cy="104" r="4" class="wt"/>' + T(160, 106, L("vent", "ভেন্ট"), "ta", "start")),
        st(5, '<g class="spin" style="--t:.8s"><path class="vane" d="M150 150v40M130 170h40"/></g><path d="M210 30l10 14-10 14zM238 30l-10 14 10 14z" style="fill:var(--ok)"/><path class="flow" d="M150 130V40H300"/>' + T(370, 126, L("start, open slowly", "চালু, ধীরে খুলুন"), "ta")),
        st(6, '<g class="needle" style="transform-origin:330px 70px;--from:-60deg;--to:40deg"><path class="ndl" d="M328 70l2-16 2 16z"/></g>' + T(330, 108, L("pressure, amps, noise, leaks", "চাপ, অ্যাম্পিয়ার, শব্দ, লিক"), "ts"))
      ].join("");
      return [[svg(480, 260, base + steps), L("Starting a centrifugal pump safely, step by step.", "নিরাপদে সেন্ট্রিফিউগাল পাম্প চালুর ধাপগুলো।"), [
        L("Permit closed, LOTO removed, guard fitted, people clear.", "পারমিট বন্ধ, LOTO খোলা, গার্ড লাগানো, আশেপাশে কেউ নেই।"),
        L("Oil in the middle of the sight glass; cooling and seal flush open.", "সাইট গ্লাসের মাঝামাঝি তেল; কুলিং ও সিল ফ্লাশ খোলা।"),
        L("Open the suction valve fully. Never throttle the suction.", "সাকশন ভাল্ভ পুরো খুলুন। সাকশন কখনো কমাবেন না।"),
        L("Vent the casing until liquid comes out with no bubbles (priming).", "বুদবুদ ছাড়া তরল না আসা পর্যন্ত কেসিং ভেন্ট করুন (প্রাইমিং)।"),
        L("Start the motor, then open the discharge valve slowly within about 30 s.", "মোটর চালু করুন, তারপর প্রায় ৩০ সেকেন্ডের মধ্যে ধীরে ধীরে ডিসচার্জ ভাল্ভ খুলুন।"),
        L("Check discharge pressure, motor amps, noise, seal leakage and bearing temperature.", "ডিসচার্জ চাপ, মোটরের অ্যাম্পিয়ার, শব্দ, সিল লিক ও বেয়ারিং-এর তাপ দেখুন।")], "#s8"]];
    },
    "rotary/couplings"() {
      const card = (x, title, body) => '<g transform="translate(' + x + ' 0)"><rect x="4" y="30" width="104" height="120" rx="8" class="fsoft"/>' + body + T(56, 172, title, "tx") + "</g>";
      const hubs = '<rect x="14" y="60" width="30" height="60" rx="3" class="fs"/><rect x="68" y="60" width="30" height="60" rx="3" class="fs"/>' + pipe("M4 90H14", 10) + pipe("M98 90H108", 10);
      return [[svg(580, 200, card(0, L("Jaw (spider)", "জ (স্পাইডার)"), hubs + '<path class="fa" d="M44 64h24v12h-24zM44 84h24v12h-24zM44 104h24v12h-24z"/>') +
        card(116, L("Tyre", "টায়ার"), hubs + '<path class="fa" d="M44 62q12 28 0 56h24q-12-28 0-56z"/>') +
        card(232, L("Grid", "গ্রিড"), hubs + '<path class="spring" d="M44 66l6 8 6-8 6 8 6-8M44 86l6 8 6-8 6 8 6-8M44 106l6 8 6-8 6 8 6-8"/>') +
        card(348, L("Gear", "গিয়ার"), hubs + '<rect x="36" y="56" width="40" height="68" rx="4" class="fl"/><path class="dm" d="M40 66h32M40 74h32M40 82h32M40 90h32M40 98h32M40 106h32M40 114h32"/>') +
        card(464, L("Disc pack", "ডিস্ক প্যাক"), hubs.replace('x="68"', 'x="74"') + '<path class="dm" d="M48 58v64M52 58v64M56 58v64M60 58v64M64 58v64"/><rect x="44" y="58" width="26" height="64" class="fa" style="opacity:.35"/>') +
        T(290, 18, L("The middle part flexes so small misalignment doesn't overload the bearings", "মাঝের অংশ সামান্য বাঁকে, তাই ছোট মিসঅ্যালাইনমেন্টে বেয়ারিং-এ বাড়তি চাপ পড়ে না"), "ts") +
        '<path class="d" d="M290 186h0"/>'), L("Common flexible couplings. Orange is the flexing part: rubber, spring-steel grid, gear teeth or thin steel discs.", "প্রচলিত ফ্লেক্সিবল কাপলিং। কমলা অংশটা বাঁকে: রাবার, স্প্রিং-স্টিলের গ্রিড, গিয়ারের দাঁত বা পাতলা স্টিলের ডিস্ক।")],
        [svg(480, 170, pipe("M20 85H170", 18) + '<rect x="170" y="55" width="40" height="60" rx="4" class="fs"/><rect x="210" y="70" width="60" height="30" class="fa"/><rect x="270" y="55" width="40" height="60" rx="4" class="fs"/>' + pipe("M310 85H460", 18, "b") +
          '<path class="d" d="M188 40v100M292 40v100"/>' + '<path class="dm" d="M188 140H292"/><path class="arrow" d="M188 140l8-5M188 140l8 5M292 140l-8-5M292 140l-8 5"/>' + T(240, 160, "DBSE", "ta") + T(240, 50, L("spacer", "স্পেসার"), "tx") +
          T(90, 60, L("pump shaft", "পাম্প শ্যাফট"), "ts") + T(390, 60, L("motor shaft", "মোটর শ্যাফট"), "ts")), L("DBSE is the gap between the shaft ends. With a spacer coupling, the spacer comes out and the seal can be changed without moving the motor.", "DBSE হলো দুই শ্যাফটের মাথার মাঝের ফাঁক। স্পেসার কাপলিং-এ স্পেসার খুললেই মোটর না সরিয়ে সিল বদলানো যায়।"), null, "#s2"]];
    },
    "rotary/rolling-bearings"() {
      let balls = ""; for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5; balls += '<circle cx="' + r1(130 + 62 * Math.cos(a)) + '" cy="' + r1(120 + 62 * Math.sin(a)) + '" r="14" class="fa"/>'; }
      const dig = (x, ch, lab, col) => '<rect x="' + x + '" y="70" width="44" height="54" rx="6" class="' + col + '"/>' + T(x + 22, 106, ch, "big") + T(x + 22, 146, lab, "ts");
      return [[svg(480, 240, '<circle cx="130" cy="120" r="92" class="fl"/><circle cx="130" cy="120" r="78" class="f"/><g class="spin" style="--t:6s">' + balls + '<circle cx="130" cy="120" r="62" fill="none" stroke="var(--muted)" stroke-dasharray="3 4"/></g><circle cx="130" cy="120" r="48" class="fs"/><circle cx="130" cy="120" r="32" class="f"/>' +
        lab(214, 70, 260, 50, L("outer ring (in housing)", "আউটার রিং (হাউজিং-এ)")) + lab(178, 112, 260, 100, L("ball (rolling element)", "বল (রোলিং এলিমেন্ট)")) + lab(130, 60, 260, 150, L("cage keeps balls apart", "কেজ বলগুলো আলাদা রাখে")) + lab(152, 150, 260, 200, L("inner ring (on shaft)", "ইনার রিং (শ্যাফটে)"))),
        L("Inside a deep groove ball bearing.", "ডিপ গ্রুভ বল বেয়ারিং-এর ভেতর।")],
        [svg(480, 180, dig(40, "6", L("type: deep groove ball", "ধরন: ডিপ গ্রুভ বল"), "fs") + dig(150, "2", L("series: light", "সিরিজ: হালকা"), "fs") + dig(260, "0", "", "fa") + dig(306, "5", "", "fa") +
          T(328, 146, L("bore code 05 × 5 = 25 mm", "বোর কোড ০৫ × ৫ = ২৫ মিমি"), "ta") + T(240, 36, L("How to read 6205", "6205 কীভাবে পড়বেন"), "tx")), L("For bore codes 04 and up, bore = code × 5 mm. Codes 00, 01, 02, 03 are 10, 12, 15 and 17 mm.", "বোর কোড ০৪ থেকে উপরে, বোর = কোড × ৫ মিমি। ০০, ০১, ০২, ০৩ মানে ১০, ১২, ১৫ ও ১৭ মিমি।"), null, "#s2"]];
    },
    "rotary/lubrication"() {
      const box = (x, lvl, title, cls) => '<g transform="translate(' + x + ' 0)"><rect x="10" y="40" width="130" height="120" rx="10" class="f"/><rect x="11" y="' + (160 - lvl) + '" width="128" height="' + (lvl - 1) + '" class="water"/>' +
        '<circle cx="75" cy="118" r="26" class="fl"/><circle cx="75" cy="144" r="10" class="fa"/><path class="d" d="M10 144h130"/>' + T(75, 186, title, "tx") + '<rect x="40" y="196" width="70" height="18" rx="9" class="tag ' + cls + '"/>' + T(75, 209, cls === "ok" ? L("correct", "সঠিক") : L("wrong", "ভুল"), "tb") + "</g>";
      return [[svg(480, 230, box(0, 6, L("Too low: dry ball", "খুব কম: বল শুকনো"), "bad") + box(160, 16, L("Centre of lowest ball", "নিচের বলের মাঝ বরাবর"), "ok") + box(320, 70, L("Too high: churning, heat", "খুব বেশি: ঘুরপাক, তাপ"), "bad") +
        T(240, 22, L("Oil bath level, machine stopped", "অয়েল বাথ লেভেল, মেশিন বন্ধ অবস্থায়"), "tx")), L("The oil should reach about the middle of the lowest ball or roller when the machine is stopped.", "মেশিন বন্ধ অবস্থায় তেল সবচেয়ে নিচের বল বা রোলারের প্রায় মাঝ বরাবর থাকা উচিত।"), null, "#s8"]];
    },
    "rotary/vibration"() {
      const pt = (x, y, l, dx, dy) => '<path class="arrow" d="M' + x + " " + y + "l" + dx + " " + dy + '"/>' + T(x + dx * 1.35, y + dy * 1.35 + 4, l, "ta");
      return [[svg(480, 230, '<rect x="20" y="190" width="440" height="12" class="fl"/><rect x="40" y="100" width="150" height="90" rx="8" class="fs"/>' + T(115, 150, L("PUMP", "পাম্প"), "ts") + pipe("M190 140H290", 12) + '<rect x="290" y="96" width="160" height="94" rx="8" class="fs"/>' + T(370, 150, L("MOTOR", "মোটর"), "ts") +
        [[70, 100], [170, 100], [310, 96], [430, 96]].map(([x, y]) => '<circle cx="' + x + '" cy="' + (y + 18) + '" r="7" class="wt"/>').join("") +
        pt(430, 114, "H", 26, 0) + pt(430, 114, "V", 0, -34) + pt(430, 114, "A", -26, -22) + T(240, 30, L("Every bearing: Horizontal, Vertical, Axial", "প্রতিটি বেয়ারিং-এ: আনুভূমিক, উল্লম্ব, অক্ষীয়"), "tx") + T(240, 220, L("orange dots = bearing housings, the measuring points", "কমলা বিন্দু = বেয়ারিং হাউজিং, মাপার জায়গা"), "ts")),
        L("Measure on solid metal at each bearing housing, in the same three directions, at the same spot every time.", "প্রতিটি বেয়ারিং হাউজিং-এর শক্ত ধাতুর ওপর একই তিন দিকে, প্রতিবার একই জায়গায় মাপুন।"), null, "#s2"]];
    },
  };

  const path = location.pathname.replace(/^.*?\/(bn\/)?([a-z-]+\/[a-z0-9-]+)(\.html)?$/, "$2");
  const make = FIG[path], more = MORE[path], art = document.querySelector("article");
  if (!(make || more) || !art) return;
  // a page can have one figure ([svg, caption]) or several; a figure with a third item (step captions)
  // becomes a player: parts marked data-s="n" appear at step n, like a short video
  let figs = make ? make() : [];
  if (typeof figs[0] === "string") figs = [figs];
  if (more) figs = figs.concat(more());
  const heads = [...art.querySelectorAll("h3[id]")];  // section headings only, not the beginner box
  figs.forEach(([s, cap, steps, at], n) => {
    const fig = document.createElement("figure");
    fig.className = "tviz tfig" + (steps ? " player" : "");
    fig.innerHTML = s + (steps ? '<div class="pctl"><button type="button" class="pbtn" data-a="prev" aria-label="' + L("Previous step", "আগের ধাপ") + '">◀</button><button type="button" class="pbtn play" data-a="play">' + L("▶ Play", "▶ চালু") + '</button><button type="button" class="pbtn" data-a="next" aria-label="' + L("Next step", "পরের ধাপ") + '">▶</button><span class="pdots">' + steps.map(() => "<i></i>").join("") + '</span></div><p class="pcap" aria-live="polite"></p>' : "") + "<figcaption>" + cap + "</figcaption>";
    // where: before a heading containing the given text, else before the n-th section heading
    const target = (at && (at[0] === "#" ? art.querySelector(at) : heads.find(h => h.textContent.toLowerCase().includes(at)))) || heads[n] || null;
    target ? target.before(fig) : art.querySelector(".pager") ? art.querySelector(".pager").before(fig) : art.appendChild(fig);
    if (steps) player(fig, steps);
  });

  function player(fig, steps) {
    let i = 0, timer = null;
    const parts = [...fig.querySelectorAll("[data-s]")], dots = [...fig.querySelectorAll(".pdots i")], cap = fig.querySelector(".pcap"), play = fig.querySelector(".play");
    const show = k => {
      i = Math.max(0, Math.min(steps.length - 1, k));
      parts.forEach(el => { const s = +el.dataset.s; el.classList.toggle("fut", s > i + 1); el.classList.toggle("now", s === i + 1); });
      dots.forEach((d, j) => { d.className = j < i ? "done" : j === i ? "on" : ""; });
      cap.innerHTML = "<b>" + (bn ? (i + 1).toLocaleString("bn-BD") : i + 1) + " / " + (bn ? steps.length.toLocaleString("bn-BD") : steps.length) + "</b> " + steps[i];
    };
    const stop = () => { clearInterval(timer); timer = null; play.textContent = L("▶ Play", "▶ চালু"); };
    fig.querySelector(".pctl").addEventListener("click", e => {
      const a = e.target.dataset.a; if (!a) return;
      if (a === "play") {
        if (timer) return stop();
        if (i >= steps.length - 1) show(0);
        play.textContent = L("❚❚ Pause", "❚❚ থামান");
        timer = setInterval(() => { if (i >= steps.length - 1) stop(); else show(i + 1); }, 3200);
      } else { stop(); show(a === "next" ? i + 1 : i - 1); }
    });
    dots.forEach((d, j) => d.addEventListener("click", () => { stop(); show(j); }));
    show(0);
  }
})();
