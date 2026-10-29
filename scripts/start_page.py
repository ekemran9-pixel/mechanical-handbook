"""Build the "Start here" guide and 30-day plan:  python3 scripts/start_page.py

Writes start.html (English) and bn/start.html (Bangla) from the data below, using quiz.html as the
page shell. Topic titles are read from the section index pages, so renamed topics stay in step.
Run scripts/update.py afterwards, as for any other change.
"""
import pathlib, re, html, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
SECTIONS = ["rotary", "static", "fabrication", "piping", "workshop", "inspection", "rigging", "safety", "leadership", "reference"]


def titles(prefix):
    t = {}
    for sec in SECTIONS:
        s = (ROOT / prefix / sec / "index.html").read_text()
        for h, n in re.findall(r'<a class="tile" href="([^"]+)"><strong>(.*?)</strong>', s):
            t[sec + "/" + h[:-5]] = html.unescape(n)
    return t


TITLE = {"en": titles(""), "bn": titles("bn")}
# pages outside the sections: (href, English, Bangla)
APP = {
    "today": ("today.html", "Today's shift planner", "আজকের শিফট প্ল্যানার"),
    "tools": ("tools.html", "Field calculators", "ফিল্ড ক্যালকুলেটর"),
    "quiz": ("quiz.html", "Training quiz", "প্রশিক্ষণ কুইজ"),
    "glossary": ("glossary.html", "Glossary", "শব্দকোষ"),
    "guides": ("guides/index.html", "Plant guides", "প্ল্যান্ট গাইড"),
}
CALC = {  # calculator id: (English, Bangla)
    "align": ("Alignment calculator", "অ্যালাইনমেন্ট ক্যালকুলেটর"), "softfoot": ("Soft foot calculator", "সফট ফুট ক্যালকুলেটর"),
    "npsh": ("NPSH calculator", "NPSH ক্যালকুলেটর"), "flangetq": ("Flange torque calculator", "ফ্ল্যাঞ্জ টর্ক ক্যালকুলেটর"),
    "pattern": ("Bolt tightening pattern", "বোল্ট টাইট দেওয়ার ক্রম"), "cutlen": ("Cut length calculator", "কাট লেংথ ক্যালকুলেটর"),
    "sling": ("Sling load calculator", "স্লিং লোড ক্যালকুলেটর"), "hydro": ("Hydrotest calculator", "হাইড্রোটেস্ট ক্যালকুলেটর"),
    "units": ("Unit converter", "একক রূপান্তর"), "torque": ("Bolt torque calculator", "বোল্ট টর্ক ক্যালকুলেটর"),
    "vib": ("Vibration severity check", "ভাইব্রেশন মাত্রা যাচাই"), "bearing": ("Bearing number decoder", "বেয়ারিং নম্বর পড়া"),
    "pipewt": ("Pipe weight calculator", "পাইপের ওজন ক্যালকুলেটর"), "crane": ("Crane capacity check", "ক্রেন ক্ষমতা যাচাই"),
    "ce": ("Carbon equivalent / preheat", "কার্বন ইকুইভ্যালেন্ট / প্রিহিট"),
}
QUIZ = {  # quiz subject: (English name, Bangla name)
    "safety": ("Safety", "সেফটি"), "rotary": ("Rotary", "রোটারি"), "seals": ("Seals & bearings", "সিল ও বিয়ারিং"), "piping": ("Piping", "পাইপিং"),
    "welding": ("Welding", "ওয়েল্ডিং"), "inspection": ("Inspection", "ইন্সপেকশন"), "rigging": ("Rigging", "রিগিং"), "workshop": ("Workshop", "ওয়ার্কশপ"),
    "leadership": ("Leadership", "নেতৃত্ব"), "all": ("All", "সব"),
}

# 30-day plan. Each day: (English title, Bangla title, [links], (English task, Bangla task))
# a link is a topic path, "app:<key>", "calc:<id>" or "quiz:<subject>"
WEEKS = [
    (("Week 1 · Safety first and the basics", "সপ্তাহ ১ · আগে সেফটি, তারপর মূল বিষয়"), [
        ("Get to know the handbook", "হ্যান্ডবুকের সাথে পরিচয়", ["safety/ppe", "app:glossary", "app:today"],
         ("Read this page to the end, install the handbook on your phone, then read PPE.", "এই পাতা শেষ পর্যন্ত পড়ুন, ফোনে হ্যান্ডবুক ইনস্টল করুন, তারপর PPE পড়ুন।")),
        ("Permit to work", "পারমিট টু ওয়ার্ক", ["safety/permit-to-work", "safety/risk-assessment"],
         ("Find the permit types used on your site and who signs them.", "আপনার সাইটে কোন কোন পারমিট চলে আর কে সই করেন খুঁজে বের করুন।")),
        ("Isolation and LOTO", "আইসোলেশন ও LOTO", ["safety/loto", "safety/line-breaking"],
         ("Watch the LOTO step player, then say the seven steps without looking.", "LOTO-র ধাপে ধাপে ছবিটা চালিয়ে দেখুন, তারপর না দেখে সাতটা ধাপ বলুন।")),
        ("Gas and confined spaces", "গ্যাস ও কনফাইন্ড স্পেস", ["safety/gas-testing", "safety/confined-space"],
         ("Learn the oxygen, LEL and H₂S limits by heart.", "অক্সিজেন, LEL ও H₂S-এর সীমা মুখস্থ করুন।")),
        ("Height and hot work", "উচ্চতা ও হট ওয়ার্ক", ["safety/working-at-height", "safety/hot-work"],
         ("Check your own harness the way the page shows.", "পাতায় যেভাবে দেখানো আছে সেভাবে নিজের হারনেস পরীক্ষা করুন।")),
        ("Measuring and units", "মাপজোখ ও একক", ["workshop/measuring-tools", "reference/fractions", "reference/conversions", "calc:units"],
         ("Measure three parts with a vernier and convert the readings to inches.", "ভার্নিয়ার দিয়ে তিনটা জিনিস মাপুন, রিডিং ইঞ্চিতে রূপান্তর করুন।")),
        ("Bolts and threads, then a quiz", "বোল্ট ও থ্রেড, তারপর কুইজ", ["workshop/fasteners", "workshop/threads", "reference/spanner-sizes", "quiz:safety"],
         ("Take the safety quiz. Read again any topic you got wrong.", "সেফটি কুইজ দিন। যেটা ভুল হয়েছে সেই বিষয় আবার পড়ুন।")),
    ]),
    (("Week 2 · Rotary equipment", "সপ্তাহ ২ · রোটারি যন্ত্রপাতি"), [
        ("How a pump works", "পাম্প কীভাবে কাজ করে", ["rotary/centrifugal-pumps", "rotary/pump-types"],
         ("Find a running pump and name its parts: suction, discharge, casing, motor, coupling.", "একটা চালু পাম্প খুঁজে অংশগুলোর নাম বলুন: সাকশন, ডিসচার্জ, কেসিং, মোটর, কাপলিং।")),
        ("Seals and packing", "সিল ও প্যাকিং", ["rotary/mechanical-seals", "rotary/gland-packing"],
         ("Learn the difference between a leaking seal and normal packing drip.", "লিক করা সিল আর প্যাকিং-এর স্বাভাবিক ফোঁটার পার্থক্য শিখুন।")),
        ("Bearings", "বেয়ারিং", ["rotary/rolling-bearings", "rotary/bearing-mounting", "calc:bearing"],
         ("Read the number on three bearings in the store and decode them.", "স্টোরের তিনটা বেয়ারিং-এর নম্বর পড়ে মানে বের করুন।")),
        ("Lubrication", "লুব্রিকেশন", ["rotary/lubrication", "rotary/oil-analysis"],
         ("Check the oil level on two machines the right way.", "দুটো মেশিনের অয়েল লেভেল সঠিক নিয়মে দেখুন।")),
        ("Couplings and alignment", "কাপলিং ও অ্যালাইনমেন্ট", ["rotary/couplings", "rotary/alignment", "calc:softfoot"],
         ("Watch the 8-step alignment player twice.", "৮ ধাপের অ্যালাইনমেন্ট ছবিটা দুবার দেখুন।")),
        ("Alignment with dial indicators", "ডায়াল ইন্ডিকেটরে অ্যালাইনমেন্ট", ["rotary/dial-alignment", "calc:align"],
         ("Put a set of real readings into the alignment calculator.", "আসল কিছু রিডিং অ্যালাইনমেন্ট ক্যালকুলেটরে বসিয়ে দেখুন।")),
        ("Vibration and troubleshooting, then a quiz", "ভাইব্রেশন ও সমস্যা খোঁজা, তারপর কুইজ", ["rotary/vibration", "rotary/pump-troubleshooting", "calc:vib", "quiz:rotary"],
         ("Take the rotary quiz.", "রোটারি কুইজ দিন।")),
    ]),
    (("Week 3 · Piping and static equipment", "সপ্তাহ ৩ · পাইপিং ও স্ট্যাটিক যন্ত্রপাতি"), [
        ("Pipe sizes and materials", "পাইপের সাইজ ও ম্যাটেরিয়াল", ["piping/pipe-sizes", "piping/pipe-materials", "calc:pipewt"],
         ("Read the stencil on a pipe in the yard.", "ইয়ার্ডে একটা পাইপের স্টেনসিল পড়ুন।")),
        ("Fittings and drawings", "ফিটিংস ও ড্রয়িং", ["piping/fittings", "piping/isometrics", "calc:cutlen"],
         ("Work out one cut length from a real isometric.", "একটা আসল আইসোমেট্রিক থেকে একটা কাট লেংথ বের করুন।")),
        ("Flanges and gaskets", "ফ্ল্যাঞ্জ ও গ্যাসকেট", ["piping/flanges", "piping/gaskets"],
         ("Read the stamp on a flange and the colours on a gasket.", "একটা ফ্ল্যাঞ্জের স্ট্যাম্প আর গ্যাসকেটের রঙ পড়ুন।")),
        ("Flange bolting", "ফ্ল্যাঞ্জ বোল্টিং", ["piping/flange-bolting", "calc:flangetq", "calc:pattern"],
         ("Write out the cross pattern for 8 and 12 bolts.", "৮ ও ১২ বোল্টের ক্রস প্যাটার্ন লিখে ফেলুন।")),
        ("Valves", "ভাল্ভ", ["static/valve-types", "static/safety-valves"],
         ("Name five valves in your unit and what each one does.", "আপনার ইউনিটের পাঁচটা ভাল্ভের নাম ও কাজ বলুন।")),
        ("Exchangers and vessels", "এক্সচেঞ্জার ও ভেসেল", ["static/shell-tube", "static/pressure-vessels"],
         ("Find the nameplate on a vessel and read the design pressure.", "একটা ভেসেলের নেমপ্লেট খুঁজে ডিজাইন চাপ পড়ুন।")),
        ("Pressure testing, then a quiz", "প্রেশার টেস্ট, তারপর কুইজ", ["piping/pressure-testing", "calc:hydro", "quiz:piping"],
         ("Take the piping quiz.", "পাইপিং কুইজ দিন।")),
    ]),
    (("Week 4 · Fabrication, inspection, rigging and leading", "সপ্তাহ ৪ · ফ্যাব্রিকেশন, ইন্সপেকশন, রিগিং ও নেতৃত্ব"), [
        ("Welding processes", "ওয়েল্ডিং প্রসেস", ["fabrication/welding-processes", "fabrication/joint-design"],
         ("Watch a welder and name the process they use.", "একজন ওয়েল্ডারের কাজ দেখে প্রসেসটার নাম বলুন।")),
        ("Weld symbols and defects", "ওয়েল্ড সিম্বল ও ত্রুটি", ["fabrication/weld-symbols", "fabrication/weld-defects"],
         ("Read three weld symbols on a drawing.", "একটা ড্রয়িং-এ তিনটা ওয়েল্ড সিম্বল পড়ুন।")),
        ("WPS and heat treatment", "WPS ও তাপ নিয়ন্ত্রণ", ["fabrication/wps-pqr", "fabrication/preheat-pwht", "calc:ce"],
         ("Ask to see the WPS for a job on your site.", "আপনার সাইটের একটা কাজের WPS দেখতে চান।")),
        ("Inspection", "ইন্সপেকশন", ["inspection/ndt-overview", "inspection/visual-inspection", "quiz:welding"],
         ("Take the welding quiz.", "ওয়েল্ডিং কুইজ দিন।")),
        ("Rigging gear and slings", "রিগিং সরঞ্জাম ও স্লিং", ["rigging/rigging-gear", "rigging/sling-loads", "calc:sling"],
         ("Check the tag on three slings and shackles.", "তিনটা স্লিং ও শ্যাকলের ট্যাগ দেখুন।")),
        ("Cranes and lift plans", "ক্রেন ও লিফট প্ল্যান", ["rigging/cranes", "rigging/lift-planning", "rigging/hand-signals"],
         ("Practise the crane hand signals with a partner.", "একজন সঙ্গীর সাথে ক্রেনের হাতের সংকেত অনুশীলন করুন।")),
        ("The supervisor's job", "সুপারভাইজারের কাজ", ["leadership/supervisor-role", "leadership/daily-routine", "app:today"],
         ("Plan tomorrow's shift in the Today planner.", "আজকের শিফট প্ল্যানারে কালকের শিফট সাজান।")),
    ]),
    (("Days 29–30 · Put it together", "দিন ২৯–৩০ · সব একসাথে"), [
        ("Reports and communication", "রিপোর্ট ও যোগাযোগ", ["leadership/reports", "leadership/communication", "rotary/rca"],
         ("Write a short shift report with the Today planner.", "আজকের শিফট প্ল্যানার দিয়ে একটা ছোট শিফট রিপোর্ট লিখুন।")),
        ("Final review", "শেষ পুনরালোচনা", ["reference/formulas", "app:glossary", "quiz:all"],
         ("Take the full quiz. Aim for 8 out of 10, then start the next 30 days.", "পুরো কুইজ দিন। ১০-এ ৮ পাওয়ার চেষ্টা করুন, তারপর পরের ৩০ দিন শুরু করুন।")),
    ]),
]
# days 31-60: one week per block, topics only
NEXT = [
    (("Days 31–37 · More rotary", "দিন ৩১–৩৭ · আরও রোটারি"), ["rotary/pump-curves", "rotary/pump-overhaul", "rotary/seal-plans", "rotary/plain-bearings", "rotary/balancing", "rotary/gearboxes", "rotary/belts-chains", "rotary/electric-motors"]),
    (("Days 38–44 · Machines and systems", "দিন ৩৮–৪৪ · মেশিন ও সিস্টেম"), ["rotary/hydraulics", "rotary/pneumatics", "rotary/recip-compressors", "rotary/centrifugal-compressors", "rotary/fans-blowers", "rotary/conveyors", "rotary/condition-monitoring", "rotary/maintenance-strategy"]),
    (("Days 45–51 · Static equipment and piping", "দিন ৪৫–৫১ · স্ট্যাটিক যন্ত্রপাতি ও পাইপিং"), ["static/exchanger-maintenance", "static/storage-tanks", "static/valve-maintenance", "static/steam-traps", "piping/spool-fabrication", "piping/pipe-supports", "piping/flushing", "piping/small-bore"]),
    (("Days 52–56 · Fabrication and workshop", "দিন ৫২–৫৬ · ফ্যাব্রিকেশন ও ওয়ার্কশপ"), ["fabrication/smaw", "fabrication/gtaw", "fabrication/distortion", "fabrication/stainless-welding", "workshop/torque", "workshop/limits-fits", "workshop/lathe"]),
    (("Days 57–60 · Leading a crew", "দিন ৫৭–৬০ · দল পরিচালনা"), ["leadership/planning-scheduling", "leadership/estimating", "leadership/shutdowns", "leadership/crew-leadership", "safety/safety-leadership", "safety/incidents"]),
]
ROLES = [
    (("Helper or apprentice", "হেল্পার বা শিক্ষানবিশ"), ("Learn the safety rules and the tools first.", "আগে সেফটির নিয়ম আর যন্ত্রপাতি শিখুন।"), ["safety/ppe", "safety/loto", "workshop/measuring-tools", "workshop/hand-power-tools"]),
    (("Fitter or technician", "ফিটার বা টেকনিশিয়ান"), ("Pumps, bearings, alignment and bolting.", "পাম্প, বেয়ারিং, অ্যালাইনমেন্ট ও বোল্টিং।"), ["rotary/centrifugal-pumps", "rotary/rolling-bearings", "rotary/alignment", "piping/flange-bolting"]),
    (("Welder or fabricator", "ওয়েল্ডার বা ফ্যাব্রিকেটর"), ("Processes, fit-up, symbols and defects.", "প্রসেস, ফিট-আপ, সিম্বল ও ত্রুটি।"), ["fabrication/welding-processes", "fabrication/joint-design", "fabrication/weld-symbols", "fabrication/weld-defects"]),
    (("Pipe fitter", "পাইপ ফিটার"), ("Sizes, fittings, drawings and testing.", "সাইজ, ফিটিংস, ড্রয়িং ও টেস্টিং।"), ["piping/pipe-sizes", "piping/fittings", "piping/isometrics", "piping/pressure-testing"]),
    (("Rigger", "রিগার"), ("Gear, sling angles, cranes and signals.", "সরঞ্জাম, স্লিং কোণ, ক্রেন ও সংকেত।"), ["rigging/rigging-gear", "rigging/sling-loads", "rigging/lift-planning", "rigging/hand-signals"]),
    (("Supervisor", "সুপারভাইজার"), ("Your day, the permit, the crew and the report.", "আপনার দিন, পারমিট, ক্রু আর রিপোর্ট।"), ["leadership/supervisor-role", "leadership/daily-routine", "safety/permit-to-work", "app:today"]),
]

L = lambda lang, en, bn: bn if lang == "bn" else en
NUM = lambda lang, n: "".join("০১২৩৪৫৬৭৮৯"[int(c)] if c.isdigit() else c for c in str(n)) if lang == "bn" else str(n)


def link(lang, key, up):
    """(href, text, kind) for a plan link."""
    if key.startswith("app:"):
        h, en, bn = APP[key[4:]]
        return up + h, L(lang, en, bn), "app"
    if key.startswith("calc:"):
        en, bn = CALC[key[5:]]
        return up + "tools.html?c=" + key[5:], L(lang, en, bn), "calc"
    if key.startswith("quiz:"):
        en, bn = QUIZ[key[5:]]
        name = L(lang, en, bn)
        q = "" if key == "quiz:all" else "?s=" + name
        return up + "quiz.html" + q, L(lang, "Quiz: ", "কুইজ: ") + name, "quiz"
    return up + key + ".html", TITLE[lang][key], "topic"


def links(lang, keys, up=""):
    out = []
    for k in keys:
        h, t, kind = link(lang, k, up)
        out.append('<a class="pl %s" href="%s">%s</a>' % (kind, html.escape(h, quote=True), html.escape(t)))
    return "".join(out)


TXT = {
    "en": {
        "title": "Start here: guide and 30-day plan",
        "desc": "New to the Mechanical Handbook? What is in it, how to use it, how to install it on your phone for offline use, where to start and a 30-day learning plan with links.",
        "eyebrow": "Start here", "h1": "New here? Start with this page.",
        "lede": "The handbook has 148 topics, 46 calculators, a quiz, a glossary and plant guides. This page shows you what each part does, how to put it on your phone so it works without internet, and gives you a day-by-day plan so you always know what to read next.",
    },
    "bn": {
        "title": "এখান থেকে শুরু: গাইড ও ৩০ দিনের পরিকল্পনা",
        "desc": "মেকানিক্যাল হ্যান্ডবুকে নতুন? এতে কী আছে, কীভাবে ব্যবহার করবেন, ইন্টারনেট ছাড়া চালাতে ফোনে কীভাবে ইনস্টল করবেন, কোথা থেকে শুরু করবেন, আর লিংকসহ ৩০ দিনের শেখার পরিকল্পনা।",
        "eyebrow": "এখান থেকে শুরু", "h1": "নতুন? এই পাতা দিয়ে শুরু করুন।",
        "lede": "এই হ্যান্ডবুকে ১৪৮টি বিষয়, ৪৬টি ক্যালকুলেটর, কুইজ, শব্দকোষ আর প্ল্যান্ট গাইড আছে। এই পাতায় দেখবেন কোন অংশ কী কাজে লাগে, ইন্টারনেট ছাড়া চালাতে ফোনে কীভাবে রাখবেন, আর দিন ধরে ধরে একটা পরিকল্পনা, যাতে সবসময় জানেন এরপর কী পড়বেন।",
    },
}


def main_html(lang):
    b = lang == "bn"
    T = TXT[lang]
    h = []
    h.append('<div class="sechead"><div class="eyebrow">%s</div><h1>%s</h1><p class="lede">%s</p></div>' % (T["eyebrow"], T["h1"], T["lede"]))

    # quick paths
    paths = [
        ("#plan", L(lang, "I'm new", "আমি নতুন"), L(lang, "Follow the 30-day plan from day 1.", "১ম দিন থেকে ৩০ দিনের পরিকল্পনা মেনে চলুন।")),
        ("#roles", L(lang, "I know my trade", "আমি কাজ জানি"), L(lang, "Pick your job and jump to its key topics.", "আপনার কাজ বেছে নিয়ে মূল বিষয়ে চলে যান।")),
        ("#find", L(lang, "I need an answer now", "এখনই উত্তর দরকার"), L(lang, "Use the search box at the top of every page.", "প্রতিটি পাতার ওপরের সার্চ বক্স ব্যবহার করুন।")),
        ("today.html", L(lang, "I'm on shift today", "আজ শিফটে আছি"), L(lang, "Open the Today planner and write your report.", "আজকের প্ল্যানার খুলে রিপোর্ট লিখুন।")),
    ]
    h.append('<div class="stpaths">' + "".join('<a class="stpath" href="%s"><b>%s</b><span>%s</span></a>' % p for p in paths) + "</div>")

    # contents
    toc = [("inside", L(lang, "What's inside", "কী কী আছে")), ("page", L(lang, "How a topic page works", "একটা বিষয়ের পাতা কীভাবে পড়বেন")),
           ("find", L(lang, "Finding things", "কীভাবে খুঁজবেন")), ("offline", L(lang, "Install and use offline", "ইনস্টল ও অফলাইনে ব্যবহার")),
           ("roles", L(lang, "Where to start for your job", "আপনার কাজ অনুযায়ী শুরু")), ("plan", L(lang, "30-day plan", "৩০ দিনের পরিকল্পনা")),
           ("next", L(lang, "Days 31–60", "দিন ৩১–৬০")), ("faq", L(lang, "Questions", "প্রশ্ন ও উত্তর"))]
    h.append('<nav class="sttoc" aria-label="%s">%s</nav>' % (L(lang, "On this page", "এই পাতায়"), "".join('<a href="#%s">%s</a>' % t for t in toc)))

    # what's inside
    up = ""
    feats = [
        ("rotary/index.html", L(lang, "Handbook: 148 topics", "হ্যান্ডবুক: ১৪৮টি বিষয়"), L(lang, "Ten sections from rotary equipment to safety and leadership. Tables, limits, procedures and checklists for the job.", "রোটারি যন্ত্র থেকে সেফটি ও নেতৃত্ব পর্যন্ত দশটি সেকশন। কাজের জন্য টেবিল, সীমা, পদ্ধতি ও চেকলিস্ট।")),
        ("safety/loto.html", L(lang, "For beginners boxes", "নতুনদের জন্য বক্স"), L(lang, "Many topics open with the idea in simple words, why it matters, an everyday comparison and key words, and end with the job step by step, common mistakes and test questions. More are added every week.", "অনেক বিষয়ের শুরুতে সহজ ভাষায় ব্যাখ্যা, কেন জরুরি, সহজ উপমা ও মূল শব্দ; শেষে কাজটা ধাপে ধাপে, সাধারণ ভুল ও যাচাইয়ের প্রশ্ন। প্রতি সপ্তাহে আরও যোগ হচ্ছে।")),
        ("rotary/alignment.html", L(lang, "Diagrams and step players", "ছবি ও ধাপে ধাপে অ্যানিমেশন"), L(lang, "Labelled drawings, and short animated players: press ▶ Play to watch a job step by step, or use the arrows.", "লেবেলসহ ছবি, আর ছোট অ্যানিমেশন: ▶ চালু চাপলে কাজটা ধাপে ধাপে দেখাবে, বা তীর দিয়ে এক এক ধাপ দেখুন।")),
        ("tools.html", L(lang, "46 field calculators", "৪৬টি ফিল্ড ক্যালকুলেটর"), L(lang, "Alignment, torque, slings, cut lengths, NPSH, units and more. Save favourites with ★, copy or share a result, print a report.", "অ্যালাইনমেন্ট, টর্ক, স্লিং, কাট লেংথ, NPSH, একক রূপান্তর ও আরও। ★ দিয়ে প্রিয়গুলো রাখুন, ফলাফল কপি বা শেয়ার করুন, রিপোর্ট প্রিন্ট করুন।")),
        ("today.html", L(lang, "Today's shift planner", "আজকের শিফট প্ল্যানার"), L(lang, "Plan the shift, pick a toolbox talk and get a ready-made shift report to send on WhatsApp.", "শিফট সাজান, টুলবক্স টক বাছুন, আর WhatsApp-এ পাঠানোর মতো তৈরি শিফট রিপোর্ট নিন।")),
        ("quiz.html", L(lang, "Training quiz", "প্রশিক্ষণ কুইজ"), L(lang, "Ten random questions by subject, each with the reason and a link to the topic. Good for apprentices and interviews.", "বিষয় ধরে দশটি এলোমেলো প্রশ্ন, প্রতিটির কারণ ও বিষয়ের লিংকসহ। শিক্ষানবিশ ও ইন্টারভিউয়ের জন্য ভালো।")),
        ("glossary.html", L(lang, "Glossary", "শব্দকোষ"), L(lang, "Trade words explained in plain language.", "কাজের শব্দগুলো সহজ ভাষায় ব্যাখ্যা।")),
        ("guides/index.html", L(lang, "Plant guides", "প্ল্যান্ট গাইড"), L(lang, "Fabrication guide, phosphate plant drum guide and phosphate plant safety guide (in Bangla).", "ফ্যাব্রিকেশন গাইড, ফসফেট প্লান্ট ড্রাম গাইড ও ফসফেট প্লান্ট সেফটি গাইড (বাংলায়)।")),
        ("#offline", L(lang, "Works offline", "অফলাইনে চলে"), L(lang, "Install it once and every page, calculator and quiz opens without internet.", "একবার ইনস্টল করলে প্রতিটি পাতা, ক্যালকুলেটর ও কুইজ ইন্টারনেট ছাড়াই খোলে।")),
        ("#find", L(lang, "English and বাংলা", "বাংলা ও English"), L(lang, "Every page in both languages. The button at the top switches to the same page in the other language.", "প্রতিটি পাতা দুই ভাষায়। ওপরের বোতাম একই পাতার অন্য ভাষায় নিয়ে যায়।")),
    ]
    h.append('<section class="stsec" id="inside"><h2>%s</h2><div class="stfeat">%s</div></section>' % (toc[0][1], "".join(
        '<a class="stcard" href="%s"><b>%s</b><span>%s</span></a>' % (up + a if not a.startswith("#") else a, t, d) for a, t, d in feats)))

    # anatomy of a topic page
    parts = [
        (L(lang, "Title and summary", "শিরোনাম ও সারাংশ"), L(lang, "What the topic covers, in one line.", "বিষয়টা কী নিয়ে, এক লাইনে।")),
        (L(lang, "For beginners box", "নতুনদের জন্য বক্স"), L(lang, "The idea in simple words, why it matters, an everyday comparison and key words. Read this first if the topic is new to you.", "সহজ ভাষায় ব্যাখ্যা, কেন জরুরি, সহজ উপমা ও মূল শব্দ। বিষয়টা নতুন হলে আগে এটা পড়ুন।")),
        (L(lang, "On this page", "এই পাতায়"), L(lang, "Jump straight to the part you need.", "যে অংশ দরকার সেখানে সরাসরি যান।")),
        (L(lang, "Tables, limits and procedures", "টেবিল, সীমা ও পদ্ধতি"), L(lang, "The field facts. Your site standard and the maker's manual always come first.", "মাঠের তথ্য। আপনার সাইটের স্ট্যান্ডার্ড ও নির্মাতার ম্যানুয়াল সবসময় আগে।")),
        (L(lang, "Diagrams and ▶ Play", "ছবি ও ▶ চালু"), L(lang, "Press Play to watch a job step by step; the dots show where you are.", "চালু চাপলে কাজটা ধাপে ধাপে দেখাবে; বিন্দুগুলো দেখায় আপনি কোন ধাপে।")),
        (L(lang, "Step by step, mistakes, test yourself", "ধাপে ধাপে, ভুল, নিজেকে যাচাই"), L(lang, "At the end: the job in order, what people get wrong, and questions. Think of the answer first, then open it.", "শেষে: কাজের ক্রম, মানুষ কোথায় ভুল করে, আর প্রশ্ন। আগে উত্তর ভাবুন, তারপর খুলুন।")),
        (L(lang, "Previous / Next", "আগের / পরের"), L(lang, "Read a whole section in order, one page after another.", "পুরো সেকশন ক্রমানুসারে, এক পাতার পর এক পাতা পড়ুন।")),
    ]
    h.append('<section class="stsec" id="page"><h2>%s</h2><ol class="stanat">%s</ol><p>%s</p></section>' % (
        toc[1][1], "".join("<li><b>%s</b><span>%s</span></li>" % p for p in parts),
        L(lang, 'Try it on <a href="safety/loto.html">Lockout / tagout</a>: it has every part.', 'চেষ্টা করুন <a href="safety/loto.html">LOTO</a> পাতায়: সব অংশ আছে।')))

    # finding things
    find = [
        (L(lang, "Search", "সার্চ"), L(lang, "Type a word in the box at the top: NPSH, soft foot, 6205, E7018, hydrotest. Results come from every topic, in both languages.", "ওপরের বক্সে একটা শব্দ লিখুন: NPSH, সফট ফুট, 6205, E7018, হাইড্রোটেস্ট। সব বিষয় থেকে ফল আসে।")),
        (L(lang, "Section tabs", "সেকশন ট্যাব"), L(lang, "The row under the header: Rotary, Static, Fabrication, Piping and the rest. Each opens a list of its topics.", "হেডারের নিচের সারি: রোটারি, স্ট্যাটিক, ফ্যাব্রিকেশন, পাইপিং ইত্যাদি। প্রতিটিতে তার বিষয়ের তালিকা।")),
        (L(lang, "Tool buttons", "টুল বোতাম"), L(lang, "Start, Today, Calcs, Quiz and Glossary sit at the top of every page.", "শুরু, আজ, ক্যালকুলেটর, কুইজ ও শব্দকোষ প্রতিটি পাতার ওপরে।")),
        (L(lang, "Language and dark mode", "ভাষা ও ডার্ক মোড"), L(lang, "বাংলা / English switches language; the round button switches light and dark.", "বাংলা / English বোতাম ভাষা বদলায়; গোল বোতাম আলো ও অন্ধকার মোড বদলায়।")),
        (L(lang, "Print or save as PDF", "প্রিন্ট বা PDF"), L(lang, "Use your browser's Print on any topic; menus are left out of the printout.", "যেকোনো বিষয়ে ব্রাউজারের Print ব্যবহার করুন; মেনু প্রিন্টে আসে না।")),
    ]
    h.append('<section class="stsec" id="find"><h2>%s</h2><dl class="stdl">%s</dl></section>' % (toc[2][1], "".join("<div><dt>%s</dt><dd>%s</dd></div>" % f for f in find)))

    # offline
    andr = [L(lang, "Open the handbook in <b>Chrome</b>.", "<b>Chrome</b>-এ হ্যান্ডবুক খুলুন।"), L(lang, "Tap the <b>⋮</b> menu at the top right.", "ওপরে ডানে <b>⋮</b> মেনুতে চাপুন।"),
            L(lang, "Tap <b>Add to Home screen</b> or <b>Install app</b>.", "<b>Add to Home screen</b> বা <b>Install app</b> চাপুন।"), L(lang, "Open it once from the new icon while you have internet. Done.", "ইন্টারনেট থাকা অবস্থায় নতুন আইকন থেকে একবার খুলুন। হয়ে গেল।")]
    ios = [L(lang, "Open the handbook in <b>Safari</b>.", "<b>Safari</b>-তে হ্যান্ডবুক খুলুন।"), L(lang, "Tap the <b>Share</b> button (square with an arrow).", "<b>Share</b> বোতামে চাপুন (তীরসহ চৌকো)।"),
           L(lang, "Scroll down and tap <b>Add to Home Screen</b>.", "নিচে নেমে <b>Add to Home Screen</b> চাপুন।"), L(lang, "Tap <b>Add</b>, then open it once from the icon.", "<b>Add</b> চাপুন, তারপর আইকন থেকে একবার খুলুন।")]
    perks = [L(lang, "Opens like an app, full screen, from your home screen.", "হোম স্ক্রিন থেকে অ্যাপের মতো পুরো স্ক্রিনে খোলে।"),
             L(lang, "Every page, calculator, quiz and plant guide works with no internet: in the plant, underground or on the road.", "প্রতিটি পাতা, ক্যালকুলেটর, কুইজ ও প্ল্যান্ট গাইড ইন্টারনেট ছাড়াই চলে: প্ল্যান্টে, নিচতলায় বা পথে।"),
             L(lang, "Uses no mobile data after the first visit; updates come in by themselves when you are online.", "প্রথমবারের পর মোবাইল ডেটা লাগে না; অনলাইনে থাকলে আপডেট নিজে থেকেই আসে।"),
             L(lang, "Your saved calculators, plan progress and shift notes stay on your phone.", "সেভ করা ক্যালকুলেটর, পরিকল্পনার অগ্রগতি ও শিফট নোট আপনার ফোনেই থাকে।")]
    h.append('<section class="stsec" id="offline"><h2>%s</h2><p id="stoffline" class="stoff">%s</p><button type="button" class="btn" id="stinstall" hidden>%s</button>'
             '<div class="stcols"><div class="stcol"><h3>Android</h3><ol>%s</ol></div><div class="stcol"><h3>iPhone</h3><ol>%s</ol></div></div><h3>%s</h3><ul class="stperks">%s</ul></section>' % (
                 toc[3][1], L(lang, "Checking this device…", "এই ডিভাইস যাচাই হচ্ছে…"), L(lang, "Install on this device", "এই ডিভাইসে ইনস্টল করুন"),
                 "".join("<li>%s</li>" % x for x in andr), "".join("<li>%s</li>" % x for x in ios), L(lang, "What you get", "কী সুবিধা পাবেন"), "".join("<li>%s</li>" % x for x in perks)))

    # roles
    h.append('<section class="stsec" id="roles"><h2>%s</h2><p>%s</p><div class="stroles">%s</div></section>' % (
        toc[4][1], L(lang, "Already working? Start with the four topics for your job, then use the plan to fill the gaps.", "আগে থেকেই কাজ করছেন? আপনার কাজের চারটি বিষয় দিয়ে শুরু করুন, তারপর পরিকল্পনা দিয়ে ফাঁকগুলো পূরণ করুন।"),
        "".join('<div class="strole"><h3>%s</h3><p>%s</p><div class="pls">%s</div></div>' % (L(lang, *n), L(lang, *d), links(lang, k)) for n, d, k in ROLES)))

    # plan
    day, cards = 0, []
    for (wt, days) in WEEKS:
        items = []
        for en, bn, ks, task in days:
            day += 1
            items.append('<li class="stday" data-day="%d" id="day-%d"><label class="stchk"><input type="checkbox" data-day="%d"><span>%s</span></label>'
                         '<div class="stdbody"><div class="stdnum">%s %s</div><h4>%s</h4><div class="pls">%s</div><p class="sttask">%s</p></div></li>' % (
                             day, day, day, L(lang, "Done", "শেষ"), L(lang, "Day", "দিন"), NUM(lang, day), L(lang, en, bn), links(lang, ks), L(lang, *task)))
        cards.append('<div class="stweek"><h3>%s</h3><ol class="stdays">%s</ol></div>' % (L(lang, *wt), "".join(items)))
    assert day == 30, day
    h.append('<section class="stsec" id="plan"><h2>%s</h2><p>%s</p><div class="stprog"><div class="stbar"><i id="stbar"></i></div><span id="stcount"></span>'
             '<a class="btn" id="stnext" href="#day-1">%s</a><button type="button" class="btn ghost" id="streset">%s</button></div>%s</section>' % (
                 toc[5][1], L(lang, "About 30–45 minutes a day. Open the links in order, do the small task, then tick <b>Done</b>. Your progress is saved on this device, so the button below always takes you to the next day.",
                              "দিনে প্রায় ৩০–৪৫ মিনিট। লিংকগুলো ক্রমানুসারে খুলুন, ছোট কাজটা করুন, তারপর <b>শেষ</b>-এ টিক দিন। অগ্রগতি এই ডিভাইসে সেভ থাকে, তাই নিচের বোতাম সবসময় পরের দিনে নিয়ে যায়।"),
                 L(lang, "Start day 1", "১ম দিন শুরু করুন"), L(lang, "Start again", "আবার শুরু"), "".join(cards)))

    # next 30 days
    h.append('<section class="stsec" id="next"><h2>%s</h2><p>%s</p>%s</section>' % (
        toc[6][1], L(lang, "Finished the plan? Read about one or two of these a day, in order.", "পরিকল্পনা শেষ? প্রতিদিন এগুলোর একটা বা দুটো ক্রমানুসারে পড়ুন।"),
        "".join('<div class="stnext"><h3>%s</h3><div class="pls">%s</div></div>' % (L(lang, *t), links(lang, k)) for t, k in NEXT)))

    # faq
    faq = [
        (L(lang, "Is it free?", "এটা কি ফ্রি?"), L(lang, "Yes. No sign-up, no adverts.", "হ্যাঁ। কোনো রেজিস্ট্রেশন বা বিজ্ঞাপন নেই।")),
        (L(lang, "Do I need internet?", "ইন্টারনেট লাগবে?"), L(lang, "Only the first time. After that it works offline (see above).", "শুধু প্রথমবার। এরপর অফলাইনে চলে (ওপরে দেখুন)।")),
        (L(lang, "Can I trust the numbers?", "সংখ্যাগুলো কি নির্ভরযোগ্য?"), L(lang, "They are typical field values for training. On the job, your site standard, the approved procedure and the maker's manual always take priority.", "এগুলো প্রশিক্ষণের জন্য সাধারণ মাঠের মান। কাজে আপনার সাইটের স্ট্যান্ডার্ড, অনুমোদিত পদ্ধতি ও নির্মাতার ম্যানুয়াল সবসময় আগে।")),
        (L(lang, "Where is my progress saved?", "আমার অগ্রগতি কোথায় সেভ থাকে?"), L(lang, "In this browser on this device. Clearing the browser data clears it.", "এই ডিভাইসের এই ব্রাউজারে। ব্রাউজারের ডেটা মুছলে এটাও মুছে যাবে।")),
        (L(lang, "How do I share a page or result?", "পাতা বা ফলাফল কীভাবে শেয়ার করব?"), L(lang, "Copy the page address. In a calculator, the share button makes a link that opens with your numbers filled in.", "পাতার ঠিকানা কপি করুন। ক্যালকুলেটরে শেয়ার বোতাম এমন লিংক দেয় যা আপনার সংখ্যাসহ খোলে।")),
        (L(lang, "Found a mistake or want a topic?", "ভুল পেয়েছেন বা নতুন বিষয় চান?"), L(lang, 'Write to Emran Mia: <a href="mailto:ekemran9@gmail.com">ekemran9@gmail.com</a> or <a href="https://wa.me/8801756069944">WhatsApp</a>.', 'Emran Mia-কে লিখুন: <a href="mailto:ekemran9@gmail.com">ekemran9@gmail.com</a> বা <a href="https://wa.me/8801756069944">WhatsApp</a>।')),
    ]
    h.append('<section class="stsec" id="faq"><h2>%s</h2><div class="lcheck">%s</div></section>' % (toc[7][1], "".join("<details><summary>%s</summary><p>%s</p></details>" % f for f in faq)))
    return "\n".join(h)


def build(lang):
    out = ROOT / ("bn/start.html" if lang == "bn" else "start.html")
    shell = (ROOT / ("bn/quiz.html" if lang == "bn" else "quiz.html")).read_text()
    T = TXT[lang]
    site = "মেকানিক্যাল হ্যান্ডবুক" if lang == "bn" else "Mechanical Handbook"
    s = re.sub(r"<title>.*?</title>", "<title>%s · %s</title>" % (html.escape(T["title"]), site), shell, count=1)
    s = re.sub(r'<meta name="description" content="[^"]*">', '<meta name="description" content="%s">' % html.escape(T["desc"], quote=True), s, count=1)
    s = s.replace('quiz.html" aria-current="page"', 'quiz.html"').replace('href="start.html"', 'href="start.html" aria-current="page"', 1)
    s = s.replace('hreflang="bn" href="bn/quiz.html"', 'hreflang="bn" href="bn/start.html"').replace('href="bn/quiz.html" hreflang="bn"', 'href="bn/start.html" hreflang="bn"')
    s = s.replace('hreflang="en" href="../quiz.html"', 'hreflang="en" href="../start.html"').replace('href="../quiz.html" hreflang="en"', 'href="../start.html" hreflang="en"')
    s = re.sub(r'<main id="main" class="wrap">[\s\S]*?</main>', lambda _: '<main id="main" class="wrap start">\n' + main_html(lang) + "\n</main>", s, count=1)
    s = re.sub(r'<script src="assets/quizbank[^\n]*\n', '<script src="assets/start.js" defer></script>\n', s)
    s = re.sub(r'<script src="../assets/quizbank[^\n]*\n', '<script src="../assets/start.js" defer></script>\n', s)
    out.write_text(s)
    print(out.relative_to(ROOT), len(s.encode()), "bytes")


build("en")
build("bn")

# search entries for the start page (both indexes)
for idx, prefix, lang in (("search.json", "", "en"), ("bn/search.json", "", "bn")):
    f = ROOT / idx
    data = [e for e in json.loads(f.read_text()) if not e["u"].startswith("start.html")]
    T = TXT[lang]
    data.insert(0, {"u": "start.html", "t": T["title"], "s": L(lang, "Start here", "এখান থেকে শুরু"), "g": L(lang, "Guide", "গাইড"),
                    "k": "start begin new beginner plan 30 day install offline home screen help guide শুরু নতুন পরিকল্পনা ৩০ দিন ইনস্টল অফলাইন সাহায্য", "x": T["desc"]})
    f.write_text(json.dumps(data, ensure_ascii=False))
