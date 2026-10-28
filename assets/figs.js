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
    "piping/pipe-sizes"() {
      // NPS 4 at 1.2 px per mm: same OD, wall from the schedule
      const sec = (cx, t, sch, id) => '<circle cx="' + cx + '" cy="100" r="68.6" class="fs"/><circle cx="' + cx + '" cy="100" r="' + r1(68.6 - t * 1.2) + '" class="hole"/><circle cx="' + cx + '" cy="100" r="' + r1(68.6 - t * 1.2) + '" class="water"/>' +
        T(cx, 190, sch, "ta") + T(cx, 206, L("wall ", "দেয়াল ") + t + " · ID " + id, "ts");
      const stx = (x, s) => T(x, 82, s, "tb");
      return [[svg(480, 215, '<path class="d" d="M10 31.4H470M10 168.6H470"/>' + sec(85, 3.05, "Sch 10", 108.2) + sec(240, 6.02, "Sch 40", 102.3) + sec(395, 13.49, "Sch 160", 87.3) +
          T(240, 20, L("NPS 4 (DN 100): OD 114.3 mm for every schedule", "NPS 4 (DN 100): সব শিডিউলে OD ১১৪.৩ মিমি"), "tx")),
        L("Drawn to scale. The outside never changes, so the same fittings fit; a higher schedule only moves the inside wall inward.", "মাপ অনুযায়ী আঁকা। বাইরের মাপ কখনো বদলায় না, তাই একই ফিটিংস লাগে; বড় শিডিউল শুধু ভেতরের দেয়াল ভেতরে সরায়।"), null, "#s1"],
        [svg(480, 200, '<rect x="10" y="40" width="460" height="56" rx="6" class="fs"/><ellipse cx="470" cy="68" rx="9" ry="28" class="f"/>' +
          stx(45, "ABC") + stx(120, "A106 B") + stx(205, '6" SCH40') + stx(280, "SMLS") + stx(370, "HT 4K1234") +
          lab(45, 88, 45, 130, L("maker", "নির্মাতা"), "middle") + lab(120, 88, 120, 160, L("spec & grade", "স্পেক ও গ্রেড"), "middle") + lab(205, 88, 205, 130, L("size & schedule", "সাইজ ও শিডিউল"), "middle") +
          lab(280, 88, 280, 160, L("seamless", "সিমলেস"), "middle") + lab(370, 88, 370, 130, L("heat number", "হিট নম্বর"), "middle") +
          T(240, 26, L("Reading a pipe stencil", "পাইপের স্টেনসিল পড়া"), "tx") + T(240, 192, L("Copy the heat number onto every piece before you cut.", "কাটার আগে প্রতিটি টুকরায় হিট নম্বর লিখে দিন।"), "ts")),
        L("The stencil runs along the pipe. Check it against the line class before the pipe is used.", "স্টেনসিল পাইপের লম্বা দিকে লেখা থাকে। ব্যবহারের আগে লাইন ক্লাসের সাথে মিলিয়ে নিন।"), null, "#s5"]];
    },
    "piping/fittings"() {
      const run = "M60 30V110Q60 150 100 150H380Q420 150 420 110V30";
      const dim = (x1, x2, y, s, cls = "ta") => '<path class="dm" d="M' + x1 + " " + y + "H" + x2 + "M" + x1 + " " + (y - 5) + "v10M" + x2 + " " + (y - 5) + 'v10"/>' + T((x1 + x2) / 2, y - 6, s, cls);
      const base = pipe(run, 14) + '<path class="dm" d="M100 140v20M380 140v20M50 110h20M410 110h20"/>' + '<path class="cl" d="M60 110V150H100M420 110V150H380"/>' + '<circle cx="60" cy="150" r="4" class="wt"/><circle cx="420" cy="150" r="4" class="wt"/>' +
        T(60, 20, L("elbow", "এলবো"), "ts") + T(420, 20, L("elbow", "এলবো"), "ts");
      const steps = [
        st(1, '<path class="d" d="M60 154V200M420 154V200"/>' + dim(60, 420, 196, L("centre to centre 1500", "সেন্টার-টু-সেন্টার ১৫০০"))),
        st(2, '<path class="zone" d="M60 110Q60 150 100 150M420 110Q420 150 380 150"/>' + dim(60, 100, 178, "229") + dim(380, 420, 178, "229")),
        st(3, '<path class="hot" d="M103 136v28M377 136v28"/>' + T(240, 128, L("3 mm root gap at each weld", "প্রতিটি ওয়েল্ডে ৩ মিমি রুট গ্যাপ"), "ta")),
        st(4, '<rect x="104" y="143" width="272" height="14" class="fa" style="opacity:.75"/>' + T(240, 236, L("cut = 1500 − 229 − 229 − 3 − 3 = 1036 mm", "কাট = ১৫০০ − ২২৯ − ২২৯ − ৩ − ৩ = ১০৩৬ মিমি"), "ta"))
      ].join("");
      return [[svg(480, 250, base + steps), L("Working out a cut length between two 6\" long radius elbows.", "দুটো ৬\" লং রেডিয়াস এলবোর মাঝের পাইপের কাট লেংথ বের করা।"), [
        L("The isometric gives the centre-to-centre distance: where the two elbow centrelines cross.", "আইসোমেট্রিক দেয় সেন্টার-টু-সেন্টার দূরত্ব: যেখানে দুই এলবোর কেন্দ্ররেখা মেলে।"),
        L("Each elbow already uses its take-out: 229 mm for a 6\" LR 90° elbow.", "প্রতিটি এলবো নিজের টেক-আউট নেয়: ৬\" LR 90° এলবোতে ২২৯ মিমি।"),
        L("Each weld needs a root gap, usually about 3 mm.", "প্রতিটি ওয়েল্ডে রুট গ্যাপ লাগে, সাধারণত প্রায় ৩ মিমি।"),
        L("What is left is the pipe to cut: 1036 mm.", "যা থাকে সেটাই কাটার মতো পাইপ: ১০৩৬ মিমি।")], "#s2"]];
    },
    "piping/gaskets"() {
      let wind = ""; for (let r = 53; r <= 76; r += 3) wind += '<circle cx="120" cy="115" r="' + r + '" fill="none" stroke="' + (r % 2 ? "var(--ink)" : "var(--muted)") + '" stroke-width="1.6"/>';
      return [[svg(480, 250, '<circle cx="120" cy="115" r="100" class="f" style="fill:#e3c23a"/><circle cx="120" cy="115" r="78" class="f"/>' + wind + '<circle cx="120" cy="115" r="50" class="fs"/><circle cx="120" cy="115" r="42" class="hole"/>' +
        '<rect x="114" y="15" width="12" height="22" style="fill:var(--muted)" transform="rotate(30 120 115)"/>' +
        lab(165, 38, 262, 22, L("stripe: filler (grey = graphite)", "দাগ: ফিলার (ধূসর = গ্রাফাইট)")) + lab(208, 80, 262, 62, L("outer ring: colour = winding metal", "আউটার রিং: রঙ = প্যাঁচের ধাতু")) +
        lab(184, 110, 262, 106, L("windings: metal strip + filler", "প্যাঁচ: ধাতুর ফিতা + ফিলার")) + lab(166, 125, 262, 150, L("inner ring: stops buckling", "ইনার রিং: বেঁকে যাওয়া আটকায়")) + lab(120, 115, 262, 194, L("bore", "বোর")) +
        T(240, 240, L("Yellow ring + grey stripe = 304 stainless with graphite filler", "হলুদ রিং + ধূসর দাগ = গ্রাফাইট ফিলারসহ ৩০৪ স্টেইনলেস"), "ts")),
        L("A spiral wound gasket seen from the front. Only the windings seal; the rings centre it and stop it being crushed.", "সামনে থেকে স্পাইরাল উন্ড গ্যাসকেট। সিল করে শুধু প্যাঁচগুলো; রিং দুটো কেন্দ্রে রাখে ও থেঁতলে যাওয়া আটকায়।"), null, "#s1"]];
    },
    "piping/flange-bolting"() {
      const N = n => (bn ? n.toLocaleString("bn-BD") : n);
      // rounds as bars: each step adds one round
      const rounds = [[L("snug", "স্নাগ"), 20, L("≤ 20%", "≤ ২০%")], [L("round 1", "রাউন্ড ১"), 30, "20–30%"], [L("round 2", "রাউন্ড ২"), 70, "50–70%"], [L("round 3", "রাউন্ড ৩"), 100, "100%"], [L("round 4", "রাউন্ড ৪"), 100, "100% ↻"]];
      const bars = rounds.map(([n, p, s], i) => { const x = 40 + i * 86, h = p * 1.3; return st(i + 1, '<rect x="' + x + '" y="' + (180 - h) + '" width="60" height="' + h + '" class="bar ' + (i === 4 ? "acc" : "") + '"/>' + T(x + 30, 172 - h, s, "ta")) + T(x + 30, 198, n, "tx"); }).join("");
      const chart = svg(480, 230, '<path class="dm" d="M30 180H460"/><path class="limit" d="M30 50H460"/>' + T(34, 44, L("target", "লক্ষ্য"), "ts", "start") + bars +
        T(170, 220, L("cross pattern", "ক্রস প্যাটার্ন"), "ts") + T(384, 220, L("circular", "গোল করে"), "ts") + '<path class="d" d="M371 204v18"/>');
      // 8-bolt cross pattern, built one bolt at a time
      const cx = 140, cy = 125, seq = [1, 5, 3, 7, 2, 6, 4, 8], at = k => { const a = (-90 + (k - 1) * 45) * Math.PI / 180; return [r1(cx + 82 * Math.cos(a)), r1(cy + 82 * Math.sin(a))]; };
      let boltsBase = ""; for (let k = 1; k <= 8; k++) { const [x, y] = at(k); boltsBase += '<circle cx="' + x + '" cy="' + y + '" r="12" class="f"/>' + T(x, y + 4, N(k), "tb"); }
      const star = seq.map((k, j) => { const [x, y] = at(k), [px, py] = j ? at(seq[j - 1]) : [x, y]; return st(j + 1, (j ? '<path class="arrow" style="stroke-width:1.6;opacity:.7" d="M' + px + " " + py + "L" + x + " " + y + '"/>' : "") + '<circle cx="' + x + '" cy="' + y + '" r="12" class="fa"/>' + T(x, y + 4, N(k), "tb") + T(300 + (j % 4) * 40, j < 4 ? 120 : 160, N(k), "big")); }).join("");
      const pattern = svg(480, 250, '<circle cx="' + cx + '" cy="' + cy + '" r="108" class="fs"/><circle cx="' + cx + '" cy="' + cy + '" r="58" class="d"/><circle cx="' + cx + '" cy="' + cy + '" r="44" class="hole"/>' + boltsBase + star +
        T(370, 70, L("order", "ক্রম"), "tx") + '<path class="dm" d="M285 132H455"/>' + T(370, 200, L("same order every cross round", "প্রতি ক্রস রাউন্ডে একই ক্রম"), "ts"));
      return [[chart, L("Tightening in rounds. Each round raises every bolt a little, so the gasket closes evenly.", "রাউন্ডে রাউন্ডে টাইট। প্রতি রাউন্ডে সব বোল্ট একটু করে বাড়ে, তাই গ্যাসকেট সমানভাবে বসে।"), [
          L("Snug every bolt by hand, then lightly, no more than 20% of target. Check the gap is even.", "প্রতিটি বোল্ট হাতে টাইট, তারপর হালকা করে, লক্ষ্যের ২০%-এর বেশি নয়। ফাঁক সমান কিনা দেখুন।"),
          L("Round 1: 20–30% of target torque, in cross pattern. Measure the gap at 4 or 8 places.", "রাউন্ড ১: লক্ষ্য টর্কের ২০–৩০%, ক্রস প্যাটার্নে। ৪ বা ৮ জায়গায় ফাঁক মাপুন।"),
          L("Round 2: 50–70%, cross pattern. Correct any uneven gap now.", "রাউন্ড ২: ৫০–৭০%, ক্রস প্যাটার্নে। অসমান ফাঁক এখনই ঠিক করুন।"),
          L("Round 3: 100%, cross pattern.", "রাউন্ড ৩: ১০০%, ক্রস প্যাটার্নে।"),
          L("Round 4: 100% going round clockwise, again and again, until no nut turns.", "রাউন্ড ৪: ঘড়ির কাঁটার দিকে ঘুরে ঘুরে ১০০%, যতক্ষণ না কোনো নাট আর ঘোরে।")], "#s2"],
        [pattern, L("The cross pattern for 8 bolts: 1-5-3-7, then 2-6-4-8.", "৮ বোল্টের ক্রস প্যাটার্ন: 1-5-3-7, তারপর 2-6-4-8।"), [
          L("Start with bolt 1 at the top.", "ওপরের ১ নম্বর বোল্ট দিয়ে শুরু।"),
          L("Bolt 5: straight across from 1.", "বোল্ট ৫: ১-এর ঠিক উল্টো দিকে।"),
          L("Bolt 3: a quarter turn round.", "বোল্ট ৩: এক-চতুর্থাংশ ঘুরে।"),
          L("Bolt 7: across from 3. The first cross is done; the flange is pulled down at four even points.", "বোল্ট ৭: ৩-এর উল্টো দিকে। প্রথম ক্রস শেষ; ফ্ল্যাঞ্জ চার সমান জায়গায় নেমেছে।"),
          L("Bolt 2: next to bolt 1.", "বোল্ট ২: ১-এর পাশে।"),
          L("Bolt 6: across from 2.", "বোল্ট ৬: ২-এর উল্টো দিকে।"),
          L("Bolt 4.", "বোল্ট ৪।"),
          L("Bolt 8. One round is finished. The next round uses the same order at a higher torque.", "বোল্ট ৮। এক রাউন্ড শেষ। পরের রাউন্ডে একই ক্রমে, বেশি টর্কে।")], "#s3"]];
    },
    "piping/pressure-testing"() {
      const run = "M90 210H380V60H140";
      const gauge = (x, y) => '<path class="dm" d="M' + x + " " + (y + 14) + "v" + 12 + '"/><circle cx="' + x + '" cy="' + y + '" r="14" class="f"/>';
      const base = pipe(run, 12) + '<rect x="134" y="46" width="8" height="28" class="fl"/>' + T(150, 40, L("blind", "ব্লাইন্ড"), "ts", "start") +
        '<rect x="20" y="194" width="62" height="32" rx="4" class="fs"/>' + T(51, 244, L("test pump", "টেস্ট পাম্প"), "ts") + pipe("M82 210H92", 8);
      const steps = [
        st(1, '<rect x="400" y="124" width="40" height="22" rx="3" class="f"/><path class="hot" d="M402 122l36 26M438 122l-36 26"/>' + T(368, 150, L("PSV, instruments out", "PSV, ইন্সট্রুমেন্ট খোলা"), "ta", "end")),
        st(2, gauge(120, 170) + '<path class="dm" d="M386 56l10-10"/><circle cx="404" cy="36" r="14" class="f"/>' + '<path class="fl" d="M160 196l10-12 10 12z"/>' + T(170, 180, L("relief", "রিলিফ"), "ts", "middle") + T(422, 40, L("gauge 2", "গেজ ২"), "ts", "start") + T(100, 166, L("gauge 1", "গেজ ১"), "ts", "end")),
        st(3, '<path fill="none" stroke-width="8" style="stroke:color-mix(in srgb,var(--steel) 60%,var(--panel))" d="' + run + '"/><path class="flow" d="' + run + '"/>' + T(210, 234, L("fill from the low point", "নিচু জায়গা থেকে ভরুন"), "ta")),
        st(4, pipe("M230 54V30", 6) + '<path class="arrow" d="M230 26v-14"/>' + T(240, 18, L("vent air at the high point", "উঁচু জায়গায় বাতাস বের"), "ta", "start")),
        st(5, '<g class="needle" style="transform-origin:120px 170px;--from:-80deg;--to:30deg"><path class="ndl" d="M118 170l2-11 2 11z"/></g>' + T(240, 110, L("50% → check → +10% steps", "৫০% → দেখুন → ১০% করে"), "ta")),
        st(6, '<circle cx="250" cy="182" r="16" class="f"/><path class="needleline" d="M250 182v-11M250 182l8 4"/>' + T(272, 180, L("hold ≥ 10 min", "≥ ১০ মিনিট রাখুন"), "ta", "start") + T(272, 196, L("check joints", "জয়েন্ট দেখুন"), "ta", "start")),
        st(7, '<path class="arrow" d="M380 222v20"/>' + T(380, 262, L("vent open, then drain", "ভেন্ট খুলে, তারপর ড্রেন"), "ta"))
      ].join("");
      return [[svg(480, 270, base + steps), L("A hydrotest, step by step.", "ধাপে ধাপে হাইড্রোটেস্ট।"), [
        L("Remove or isolate everything that can't take the test: PSVs, instruments, control valves. Fit rated test blinds.", "যা টেস্ট নিতে পারে না তা খুলুন বা আলাদা করুন: PSV, ইন্সট্রুমেন্ট, কন্ট্রোল ভাল্ভ। রেটেড টেস্ট ব্লাইন্ড লাগান।"),
        L("Fit two calibrated gauges, one at the pump and one at the far or high point, and a relief valve set a little above test pressure.", "দুটো ক্যালিব্রেটেড গেজ লাগান, একটা পাম্পে আর একটা দূরে বা উঁচুতে, আর টেস্ট চাপের একটু ওপরে সেট করা রিলিফ ভাল্ভ।"),
        L("Fill with clean water from the lowest point, so air is pushed up ahead of the water.", "সবচেয়ে নিচু জায়গা থেকে পরিষ্কার পানি দিয়ে ভরুন, যেন বাতাস পানির আগে ওপরে উঠে যায়।"),
        L("Vent every high point until water comes out with no air. Trapped air stores energy.", "বাতাস ছাড়া পানি না আসা পর্যন্ত প্রতিটি উঁচু জায়গা ভেন্ট করুন। আটকে থাকা বাতাস শক্তি জমায়।"),
        L("Raise the pressure slowly: to 50%, stop and check, then in 10% steps to test pressure.", "ধীরে চাপ বাড়ান: ৫০% পর্যন্ত, থেমে দেখুন, তারপর ১০% করে টেস্ট চাপ পর্যন্ত।"),
        L("Hold at least 10 minutes (or as the spec says), then examine every joint.", "কমপক্ষে ১০ মিনিট (বা স্পেক অনুযায়ী) ধরে রাখুন, তারপর প্রতিটি জয়েন্ট দেখুন।"),
        L("Release the pressure slowly, open the vents, then drain so the line can't pull a vacuum.", "ধীরে চাপ ছাড়ুন, ভেন্ট খুলুন, তারপর ড্রেন করুন যেন লাইনে ভ্যাকুয়াম না হয়।")], "#s3"]];
    },
    "safety/permit-to-work"() {
      const box = (i, x, y, t, who) => '<rect x="' + x + '" y="' + y + '" width="136" height="66" rx="10" class="fsoft"/>' + T(x + 18, y + 24, bn ? (i).toLocaleString("bn-BD") : i, "big") + T(x + 74, y + 30, t, "tx") + T(x + 74, y + 50, who, "ts");
      const B = [[12, 26], [172, 26], [332, 26], [332, 140], [172, 140], [12, 140]];
      const D = [[L("Request", "অনুরোধ"), L("supervisor", "সুপারভাইজার")], [L("Prepare plant", "প্ল্যান্ট প্রস্তুত"), L("operations", "অপারেশন")], [L("Site visit", "সাইট পরিদর্শন"), L("both together", "দুজন একসাথে")],
        [L("Brief & sign on", "ব্রিফ ও সই"), L("supervisor + crew", "সুপারভাইজার + ক্রু")], [L("Work", "কাজ"), L("permit on show", "পারমিট টাঙানো")], [L("Close out", "ক্লোজ আউট"), L("both together", "দুজন একসাথে")]];
      const arrows = ["M148 59h22", "M308 59h22", "M400 92v46", "M330 173h-24", "M170 173h-24"];
      const base = B.map(([x, y], i) => box(i + 1, x, y, D[i][0], D[i][1])).join("");
      const steps = B.map(([x, y], i) => st(i + 1, '<rect x="' + x + '" y="' + y + '" width="136" height="66" rx="10" class="zone" style="stroke-width:3"/>' + (i ? '<path class="arrow" d="' + arrows[i - 1] + '"/>' : ""))).join("");
      return [[svg(480, 220, base + steps), L("The life of a permit, from request to close-out.", "অনুরোধ থেকে ক্লোজ আউট: একটা পারমিটের পুরো পথ।"), [
        L("The supervisor requests the permit: what job, where, which tools, when.", "সুপারভাইজার পারমিট চান: কী কাজ, কোথায়, কোন যন্ত্র, কখন।"),
        L("Operations prepare the plant: drain, isolate, purge, gas test, and attach the certificates.", "অপারেশন প্ল্যান্ট প্রস্তুত করে: ড্রেন, আইসোলেট, পার্জ, গ্যাস টেস্ট, আর সার্টিফিকেট সংযুক্ত।"),
        L("Issuer and supervisor walk the job together. The supervisor checks every isolation and applies their own lock.", "ইস্যুয়ার ও সুপারভাইজার একসাথে কাজের জায়গা হাঁটেন। সুপারভাইজার প্রতিটি আইসোলেশন দেখে নিজের তালা দেন।"),
        L("The supervisor briefs every crew member on hazards and controls; each one signs on.", "সুপারভাইজার প্রত্যেক কর্মীকে ঝুঁকি ও নিয়ন্ত্রণ বুঝিয়ে দেন; প্রত্যেকে সই করেন।"),
        L("Work goes ahead with the permit displayed, inside its scope. Anything changes: stop.", "পারমিট টাঙিয়ে, পরিধির ভেতরে কাজ চলে। কিছু বদলালে: থামুন।"),
        L("At the end: site left safe, locks off, permit signed off and returned to operations.", "শেষে: জায়গা নিরাপদ, তালা খোলা, পারমিট সই করে অপারেশনে ফেরত।")], "#s2"]];
    },
    "safety/loto"() {
      const lock = (x, y) => '<path class="ring" d="M' + (x - 5) + " " + y + "v-6a5 5 0 0 1 10 0v6" + '"/><rect x="' + (x - 8) + '" y="' + y + '" width="16" height="13" rx="2" class="fa"/>';
      const valve = (x, y, cls = "fl") => '<path class="' + cls + '" d="M' + (x - 12) + " " + (y - 9) + "l12 9-12 9zM" + (x + 12) + " " + (y - 9) + "l-12 9 12 9z" + '"/>';
      const base = '<rect x="20" y="50" width="86" height="150" rx="6" class="fs"/>' + T(63, 44, "MCC", "tx") + '<rect x="44" y="80" width="38" height="50" rx="4" class="f"/><path class="needleline" d="M63 105V86"/>' + T(63, 146, L("breaker", "ব্রেকার"), "ts") +
        '<path class="dm" d="M106 120H170V170H200"/><rect x="200" y="140" width="110" height="60" rx="8" class="fs"/>' + T(255, 176, L("MOTOR", "মোটর"), "ts") + pipe("M310 170H330", 10) +
        '<circle cx="360" cy="170" r="30" class="fs"/>' + T(360, 174, L("pump", "পাম্প"), "ts") + pipe("M360 140V70H470", 10, "b") + pipe("M390 170H470", 10, "b") + valve(420, 70) + valve(440, 170) + '<rect x="0" y="214" width="480" height="8" class="fl"/>';
      const steps = [
        st(1, '<rect x="140" y="14" width="40" height="50" rx="4" class="f"/><path class="dm" d="M148 30h24M148 40h24M148 50h16"/>' + T(188, 34, L("find every energy:", "সব শক্তি খুঁজুন:"), "ta", "start") + T(188, 52, L("power, pressure, heat, springs", "বিদ্যুৎ, চাপ, তাপ, স্প্রিং"), "ts", "start")),
        st(2, '<path class="f" d="M118 64h80v26h-58l-10 10v-10h-12z"/>' + T(158, 82, L("ops told", "অপারেশন জানে"), "ta")),
        st(3, '<circle cx="290" cy="128" r="9" style="fill:var(--bad)"/>' + T(304, 132, L("stop", "স্টপ"), "ta", "start")),
        st(4, '<rect x="45" y="81" width="36" height="48" rx="4" class="f"/><path class="needleline" style="stroke:var(--bad)" d="M63 105V124"/>' + T(63, 96, "OFF", "tb") + valve(420, 70, "zbad") + valve(440, 170, "zbad")),
        st(5, lock(63, 186) + lock(420, 94) + lock(440, 194) + '<rect x="76" y="176" width="24" height="16" rx="2" class="zok"/>' + T(88, 188, "TAG", "tb")),
        st(6, '<path class="arrow" d="M360 200v12"/>' + T(360, 240, L("drain, vent, bleed to zero", "ড্রেন, ভেন্ট, ব্লিড করে শূন্য"), "ta")),
        st(7, '<rect x="196" y="100" width="66" height="26" rx="6" class="f"/>' + T(229, 118, "START", "tb") + '<path class="hot" d="M266 104l14 18M280 104l-14 18"/>' + T(150, 264, L("try to start: nothing moves", "চালুর চেষ্টা: কিছুই নড়ে না"), "ta"))
      ].join("");
      return [[svg(480, 274, base + steps), L("The seven LOTO steps on a motor-driven pump.", "মোটর চালিত পাম্পে LOTO-র সাতটি ধাপ।"), [
        L("Prepare: list every energy source from the drawings and on the plant.", "প্রস্তুতি: ড্রয়িং ও প্ল্যান্ট দেখে সব শক্তির উৎসের তালিকা।"),
        L("Notify operations and everyone affected.", "অপারেশন ও সংশ্লিষ্ট সবাইকে জানান।"),
        L("Shut the equipment down with its normal stop.", "স্বাভাবিক স্টপ দিয়ে যন্ত্র বন্ধ করুন।"),
        L("Isolate: breaker open (racked out), suction and discharge valves closed.", "আইসোলেট: ব্রেকার খোলা (র‍্যাক আউট), সাকশন ও ডিসচার্জ ভাল্ভ বন্ধ।"),
        L("Lock and tag every isolation point. Every worker fits a personal lock.", "প্রতিটি আইসোলেশন পয়েন্টে তালা ও ট্যাগ। প্রত্যেক কর্মী নিজের তালা দেন।"),
        L("Release stored energy: drain, vent and bleed until the gauge reads zero; let it cool.", "জমা শক্তি ছাড়ুন: গেজ শূন্য না হওয়া পর্যন্ত ড্রেন, ভেন্ট ও ব্লিড; ঠান্ডা হতে দিন।"),
        L("Verify: press start, nothing moves. Put the switch back to OFF. Now work can begin.", "যাচাই: স্টার্ট চাপুন, কিছুই নড়ে না। সুইচ আবার OFF-এ দিন। এখন কাজ শুরু।")], "#s1"]];
    },
    "safety/confined-space"() {
      const man = (x, y) => '<circle cx="' + x + '" cy="' + (y - 34) + '" r="7" class="f"/><path class="sl" d="M' + x + " " + (y - 27) + "v18M" + (x - 10) + " " + (y - 20) + "h20M" + x + " " + (y - 9) + "l-7 10M" + x + " " + (y - 9) + "l7 10" + '"/>';
      const base = '<rect x="170" y="50" width="120" height="180" rx="40" class="fs"/><rect x="206" y="38" width="48" height="14" class="fl"/>' + pipe("M290 190H400", 10, "b") + pipe("M230 230V250", 8) +
        '<rect x="0" y="252" width="480" height="8" class="fl"/>' + T(260, 178, L("vessel", "ভেসেল"), "ts");
      const steps = [
        st(1, '<rect x="330" y="176" width="8" height="28" class="fa"/>' + T(334, 168, L("blind", "ব্লাইন্ড"), "ta")),
        st(2, '<path class="arrow" d="M244 238h22"/>' + T(272, 244, L("drain + purge", "ড্রেন + পার্জ"), "ta", "start")),
        st(3, '<rect x="40" y="100" width="56" height="40" rx="8" class="f"/><circle cx="68" cy="120" r="14" class="fl"/>' + pipe("M96 120H170", 8) + '<path class="flowfast" style="--t:.5s;stroke:var(--steel)" d="M100 120H200"/>' + T(68, 160, L("air mover", "এয়ার মুভার"), "ta") + T(68, 176, L("never oxygen", "কখনো অক্সিজেন নয়"), "ts")),
        st(4, '<path class="probe" d="M230 26V210"/>' + [70, 140, 205].map(y => '<circle cx="230" cy="' + y + '" r="6" class="wt"/>').join("") + T(298, 72, L("top", "ওপরে"), "ta", "start") + T(298, 142, L("middle", "মাঝে"), "ta", "start") + T(298, 214, L("bottom", "নিচে"), "ta", "start")),
        st(5, '<path class="sl" d="M200 38L230 4L260 38M230 4V20"/><rect x="250" y="12" width="14" height="12" class="fa"/>' + T(274, 22, L("tripod + winch", "ট্রাইপড + উইঞ্চ"), "ta", "start")),
        st(6, man(50, 250) + T(66, 226, L("attendant", "অ্যাটেন্ড্যান্ট"), "ta", "start") + T(66, 242, L("never goes in", "কখনো ঢোকেন না"), "ts", "start"))
      ].join("");
      return [[svg(480, 262, base + steps), L("Getting a vessel ready for entry.", "ভেসেলে ঢোকার প্রস্তুতি।"), [
        L("Positive isolation: a blind (or a removed spool) on every line. Agitators and heaters locked out.", "পজিটিভ আইসোলেশন: প্রতিটি লাইনে ব্লাইন্ড (বা খোলা স্পুল)। অ্যাজিটেটর ও হিটার লক আউট।"),
        L("Drain, depressurise and purge with steam, water or nitrogen, then air.", "ড্রেন, চাপ কমানো, স্টিম, পানি বা নাইট্রোজেন দিয়ে পার্জ, তারপর বাতাস।"),
        L("Ventilate with an air mover. Never use oxygen.", "এয়ার মুভার দিয়ে বাতাস চলাচল। কখনো অক্সিজেন নয়।"),
        L("Gas test from outside at the top, middle and bottom.", "বাইরে থেকে ওপরে, মাঝে ও নিচে গ্যাস টেস্ট।"),
        L("Rescue gear at the entrance: tripod, winch, breathing apparatus, stretcher.", "প্রবেশপথে উদ্ধার সরঞ্জাম: ট্রাইপড, উইঞ্চ, শ্বাসযন্ত্র, স্ট্রেচার।"),
        L("The attendant stays outside the whole time, keeps the log and contact, and never goes in.", "অ্যাটেন্ড্যান্ট পুরো সময় বাইরে থাকেন, লগ ও যোগাযোগ রাখেন, কখনো ভেতরে যান না।")], "#s2"]];
    },
    "safety/working-at-height"() {
      const seg = (y, h, cls, t, m) => '<rect x="200" y="' + y + '" width="40" height="' + h + '" class="' + cls + '"/>' + '<path class="dm" d="M244 ' + (y + h) + 'h8"/>' + T(258, y + h / 2, t, "tx", "start") + T(258, y + h / 2 + 15, m, "ta", "start");
      return [[svg(480, 300, '<rect x="60" y="14" width="200" height="12" class="fl"/><circle cx="120" cy="30" r="5" class="wt"/>' + T(56, 24, L("anchor", "অ্যাংকর"), "ts", "end") +
        seg(30, 72, "fs", L("lanyard", "ল্যানইয়ার্ড"), "1.8 m") + seg(102, 70, "fa", L("shock absorber opens", "শক অ্যাবজর্বার খোলে"), "≤ 1.75 m") + seg(172, 60, "fl", L("D-ring to feet, stretch", "D-রিং থেকে পা, টান"), "≈ 1.5 m") + seg(232, 40, "zok", L("safety margin", "নিরাপত্তা ফাঁক"), "1 m") +
        '<path class="d" d="M120 35V172"/><circle cx="120" cy="164" r="8" class="f"/><path class="sl" d="M120 172v34M104 184h32M120 206l-9 24M120 206l9 24"/>' +
        '<rect x="20" y="272" width="440" height="8" class="fl"/>' + T(24, 266, L("ground / next level", "মাটি / নিচের তলা"), "ts", "start") +
        '<path class="dm" d="M176 30V272"/>' + T(170, 150, L("≈ 6 m", "≈ ৬ মি"), "ta", "end") + T(240, 296, L("Less room than this? Use a self-retracting lifeline.", "এর চেয়ে কম জায়গা? সেলফ-রিট্র্যাক্টিং লাইফলাইন ব্যবহার করুন।"), "ts")),
        L("Fall clearance for a 1.8 m shock-absorbing lanyard: about 6 m below the anchor.", "১.৮ মিটার শক-অ্যাবজর্বিং ল্যানইয়ার্ডে পড়ার ক্লিয়ারেন্স: অ্যাংকরের নিচে প্রায় ৬ মিটার।"), null, "#s2"]];
    },
    "safety/hot-work"() {
      const leg = (i, y, t) => st(i, '<circle cx="278" cy="' + (y - 4) + '" r="9" class="fa"/>' + T(278, y, bn ? i.toLocaleString("bn-BD") : i, "tb") + T(293, y, t, "tx", "start"));
      const num = (i, x, y) => '<circle cx="' + x + '" cy="' + y + '" r="9" class="fa"/>' + T(x, y + 4, bn ? i.toLocaleString("bn-BD") : i, "tb");
      const base = '<g transform="translate(-35 0)"><circle cx="160" cy="130" r="110" class="zwarn" style="stroke-dasharray:8 5"/>' + '<path class="dm" d="M160 130H270"/>' + T(215, 124, L("11 m", "১১ মি"), "ta") +
        '<circle cx="160" cy="130" r="10" class="fa"/><path class="hot" d="M152 122l-8-8M168 122l8-8M160 118v-12"/>' + T(160, 158, L("welding", "ওয়েল্ডিং"), "ts") + "</g>";
      const steps = [
        st(1, '<g transform="translate(-35 0)"><rect x="200" y="40" width="22" height="28" rx="3" class="fl"/><path class="arrow" d="M226 50l42-26"/><rect x="272" y="8" width="22" height="28" rx="3" class="fl"/>' + num(1, 210, 82) + "</g>") + leg(1, 48, L("combustibles out or covered", "দাহ্য জিনিস সরান / ঢাকুন")),
        st(2, '<g transform="translate(-35 0)"><rect x="80" y="70" width="40" height="22" class="fs"/><path class="dm" d="M80 74l40 14M80 88l40-14"/>' + num(2, 100, 104) + "</g>") + leg(2, 88, L("drains, openings covered", "ড্রেন ও খোলা জায়গা ঢাকা")),
        st(3, '<g transform="translate(-35 0)"><circle cx="110" cy="190" r="8" class="f"/><rect x="120" y="186" width="10" height="20" rx="3" style="fill:var(--bad)"/><path class="sl" d="M110 198v20"/>' + num(3, 90, 214) + "</g>") + leg(3, 128, L("fire watch + extinguisher", "ফায়ার ওয়াচ + এক্সটিংগুইশার")),
        st(4, '<g transform="translate(-35 0)"><rect x="196" y="170" width="20" height="30" rx="4" class="f"/><path class="needleline" d="M200 180h12"/>' + num(4, 228, 208) + "</g>") + leg(4, 168, L("gas test, keep testing", "গ্যাস টেস্ট, চালিয়ে যান")),
        st(5, '<circle cx="452" cy="230" r="16" class="f"/><path class="needleline" d="M452 230v-11M452 230l8 4"/>') + leg(5, 208, L("watch 30–60 min after", "পরে ৩০–৬০ মিনিট নজর"))
      ].join("");
      return [[svg(480, 250, base + steps), L("Setting up for hot work: the 11 m spark zone.", "হট ওয়ার্কের প্রস্তুতি: ১১ মিটার স্ফুলিঙ্গ এলাকা।"), [
        L("Move combustibles more than 11 m away, or cover what can't move with fire blankets.", "দাহ্য জিনিস ১১ মিটারের বাইরে সরান, যা সরানো যায় না তা ফায়ার ব্ল্যাংকেটে ঢাকুন।"),
        L("Cover drains, cable trenches and openings in the spark zone.", "স্ফুলিঙ্গ এলাকার ড্রেন, কেবল ট্রেঞ্চ ও খোলা জায়গা ঢাকুন।"),
        L("A trained fire watch with an extinguisher and radio, doing nothing else.", "এক্সটিংগুইশার ও রেডিওসহ প্রশিক্ষিত ফায়ার ওয়াচ, অন্য কোনো কাজ নয়।"),
        L("Gas test before starting, then repeat or monitor continuously.", "শুরুর আগে গ্যাস টেস্ট, তারপর বারবার বা অবিরাম মনিটর।"),
        L("After the work stops, the fire watch stays at least 30 minutes (often 60) for smouldering.", "কাজ থামার পর ফায়ার ওয়াচ কমপক্ষে ৩০ মিনিট (প্রায়ই ৬০) ধিকিধিকি আগুনের জন্য থাকেন।")], "#s1"]];
    },
    "safety/ppe"() {
      const R = (y, t) => T(330, y, t, "tx", "start"), Lf = (y, t) => T(150, y, t, "tx", "end");
      return [[svg(480, 300, '<path class="fa" d="M214 52a26 22 0 0 1 52 0h8v6h-68v-6z"/><circle cx="240" cy="70" r="20" class="f"/><rect x="226" y="64" width="28" height="7" rx="3" class="fs"/>' +
        '<rect x="212" y="64" width="6" height="14" rx="2" class="fa"/><rect x="262" y="64" width="6" height="14" rx="2" class="fa"/><rect x="232" y="78" width="16" height="9" rx="3" class="fl"/>' +
        '<rect x="208" y="94" width="64" height="88" rx="10" class="fs"/><path class="sl" style="stroke:var(--accent)" d="M216 96l48 70M264 96l-48 70"/>' +
        '<rect x="186" y="98" width="18" height="78" rx="8" class="fs"/><rect x="276" y="98" width="18" height="78" rx="8" class="fs"/><rect x="184" y="174" width="22" height="18" rx="5" class="fa"/><rect x="274" y="174" width="22" height="18" rx="5" class="fa"/>' +
        '<rect x="212" y="182" width="24" height="80" rx="6" class="fs"/><rect x="244" y="182" width="24" height="80" rx="6" class="fs"/><path class="fl" d="M206 262h32v14h-32zM242 262h32v14h-32z"/>' +
        lab(226, 46, 156, 40, "", "end") + Lf(44, L("hard hat", "হার্ড হ্যাট")) + lab(213, 72, 156, 80, "", "end") + Lf(84, L("ear plugs / muffs", "ইয়ার প্লাগ / মাফ")) + lab(186, 182, 156, 182, "", "end") + Lf(186, L("gloves for the hazard", "ঝুঁকি অনুযায়ী গ্লাভস")) +
        lab(220, 270, 156, 268, "", "end") + Lf(272, L("S3 safety boots", "S3 সেফটি বুট")) +
        lab(250, 67, 324, 56, "") + R(60, L("safety glasses", "সেফটি চশমা")) + lab(248, 84, 324, 96, "") + R(100, L("respirator if needed", "দরকারে রেসপিরেটর")) + lab(262, 150, 324, 140, "") + R(144, L("harness at height", "উচ্চতায় হারনেস")) +
        lab(268, 230, 324, 220, "") + R(224, L("FR coverall", "FR কভারঅল")) + T(240, 296, L("Choose by the job's hazards. PPE is the last line of defence.", "কাজের ঝুঁকি দেখে বাছুন। PPE শেষ প্রতিরক্ষা।"), "ts")),
        L("Head to toe: what to wear for typical mechanical work.", "মাথা থেকে পা: সাধারণ মেকানিক্যাল কাজে কী পরবেন।"), null, ".tbl"]];
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
    const target = (at && (/^[#.]/.test(at) ? art.querySelector(at) : heads.find(h => h.textContent.toLowerCase().includes(at)))) || heads[n] || null;
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
