"""Build the plant guides into the handbook:  python3 guides-src/build.py

Each guide's modules live in guides-src/<guide>/src. Modules whose topic already has a handbook
page are left out (REMOVE) and their old links send readers to that page (MOVED). The output is
guides/<guide>/index.html, which shares the handbook's offline copy, manifest and search.
Run scripts/update.py afterwards, as for any other change.
"""
import pathlib, re, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
HB = "../../bn/"  # from guides/<guide>/ to the Bangla handbook

GUIDES = {
    "fabrication": {
        "title": "ফ্যাব্রিকেশন গাইড",
        "js": ["data.js", "viz.js", "app.js"],
        "wrap": ["/* ---------- 05 fittings ---------- */"],
        "moved": {
            "pipe": ("piping/pipe-sizes.html", "পাইপ: সাইজ ও শিডিউল"),
            "grade": ("piping/pipe-materials.html", "পাইপের ম্যাটেরিয়াল গ্রেড"),
            "flange": ("piping/flanges.html", "ফ্ল্যাঞ্জ"),
            "fittings": ("piping/fittings.html", "ফিটিংস"),
            "valve": ("static/valve-types.html", "ভাল্ভের ধরন"),
            "weld": ("fabrication/welding-processes.html", "ওয়েল্ডিং প্রসেস"),
            "metal": ("fabrication/metallurgy.html", "ধাতুবিদ্যা"),
            "drawing": ("piping/isometrics.html", "আইসোমেট্রিক ড্রয়িং"),
            "fab": ("piping/spool-fabrication.html", "স্পুল ফ্যাব্রিকেশন"),
            "inspect": ("inspection/ndt-overview.html", "ইন্সপেকশন ও NDT"),
            "duty": ("leadership/foreman-role.html", "ফোরম্যানের দায়িত্ব"),
            "calc": ("tools.html", "ক্যালকুলেটর"),
            "quiz": ("quiz.html", "কুইজ"),
            "glossary": ("glossary.html", "শব্দকোষ"),
        },
    },
    "phosphate-drum": {
        "title": "ফসফেট প্লান্ট ড্রাম গাইড",
        "js": ["data.js", "viewer3d.js", "app.js"],
        "three": '<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n',
        "moved": {
            "safety": ("safety/index.html", "সেফটি"),
            "quiz": ("quiz.html", "কুইজ"),
            "glossary": ("glossary.html", "শব্দকোষ"),
        },
    },
    "phosphate-safety": {
        "title": "ফসফেট প্লান্ট সেফটি গাইড",
        "js": ["data.js", "app.js"],
        "moved": {
            "risk": ("safety/risk-assessment.html", "ঝুঁকি মূল্যায়ন"),
            "ptw": ("safety/permit-to-work.html", "পারমিট টু ওয়ার্ক"),
            "loto": ("safety/loto.html", "LOTO ও আইসোলেশন"),
            "confined": ("safety/confined-space.html", "কনফাইন্ড স্পেস"),
            "height": ("safety/working-at-height.html", "উচ্চতায় কাজ"),
            "fire": ("safety/hot-work.html", "হট ওয়ার্ক"),
            "elec": ("safety/electrical-safety.html", "বৈদ্যুতিক নিরাপত্তা"),
            "lift": ("rigging/sling-loads.html", "লিফটিং ও স্লিং"),
            "incident": ("safety/incidents.html", "দুর্ঘটনা তদন্ত"),
            "quiz": ("quiz.html", "কুইজ"),
            "glossary": ("glossary.html", "শব্দকোষ"),
        },
    },
}
OTHERS = [("fabrication", "ফ্যাব্রিকেশন গাইড"), ("phosphate-drum", "ফসফেট ড্রাম গাইড"), ("phosphate-safety", "ফসফেট সেফটি গাইড")]

BAR_CSS = """<style>
.hbbar{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:7px max(16px,env(safe-area-inset-left,0px));background:#18222c;color:#eef1f3;font-size:14px}
.hbbar a{color:#f0a32a;text-decoration:none;font-weight:600}
.hbbar a:hover{text-decoration:underline}
.hbbar span{opacity:.7}
.hbmoved a{display:block}
.hbbar .oth{opacity:1}.hbbar .oth a{margin-left:6px}
@media(max-width:640px){.hbbar .oth{display:none}}
</style>
"""


def build(name, conf):
    src = ROOT / "guides-src" / name / "src"
    moved = conf["moved"]
    shell = (src / "shell.html").read_text()
    # handbook bar above the guide's own header
    others = " · ".join('<a href="../%s/">%s</a>' % (k, t) for k, t in OTHERS if k != name)
    bar = ('<div class="hbbar"><a href="%sindex.html">← মেকানিক্যাল হ্যান্ডবুক</a><span>›</span><b>%s</b>'
           '<span class="oth" style="margin-left:auto">অন্য গাইড: %s</span></div>\n') % (HB, conf["title"], others)
    shell = bar + shell
    # drop nav links of removed modules; list them under "now in the handbook"
    for mid in moved:
        shell = re.sub(r'\s*<a href="#%s"[^>]*>.*?</a>' % mid, "", shell)
    links = "".join('<a href="%s%s">%s</a>' % (HB, p, t) for p, t in dict.fromkeys(moved.values()))
    shell = shell.replace('<div class="navfoot">', '<h6>হ্যান্ডবুকে দেখুন</h6><div class="hbmoved">' + links + '</div>\n  <div class="navfoot">', 1)
    shell = re.sub(r"<h6>[^<]*</h6>(\s*)(?=<h6>)", r"\1", shell)  # a group heading left with no links

    mods = "".join((src / p.name).read_text() for p in sorted(src.glob("m*.html")))
    for mid in moved:
        mods, n = re.subn(r'<section class="mod" id="m-%s"[\s\S]*?</section>\s*' % mid, "", mods)
        assert n == 1, (name, mid, n)

    data = (src / "data.js").read_text()
    a = data.index("const MODULES = ["); b = data.index("];", a)
    block = data[a:b]
    for mid in moved:
        block, n = re.subn(r"^\s*\[\s*'%s',.*\n" % mid, "", block, flags=re.M)
        assert n == 1, (name, "MODULES", mid, n)
    data = data[:a] + block + data[b:]

    js = "\n".join(data if f == "data.js" else (src / f).read_text() for f in conf["js"])
    # every init block runs on its own, so a block for a removed module cannot stop the rest
    lines, inside = js.split("\n"), False
    for i, ln in enumerate(lines):
        if ln == "(function () {":
            lines[i], inside = "safe(function () {", True
        elif ln == "})();" and inside:
            lines[i], inside = "});", False
    js = "\n".join(lines)
    for marker in conf.get("wrap", []):  # loose top-level code that belongs to a removed module
        a = js.index(marker) + len(marker); b = js.index("/* ----------", a)
        js = js[:a] + "\nsafe(() => {\n" + js[a:b] + "});\n\n" + js[b:]
    redirect = {k: HB + v[0] for k, v in moved.items()}
    js = ("const safe = fn => { try { fn(); } catch (e) { console.warn(e); } };\n"
          "/* old links to modules that now live in the handbook */\n"
          "(function () { const go = %s, check = () => { const h = location.hash.slice(1); if (go[h]) location.replace(go[h]); }; check(); addEventListener('hashchange', check); })();\n" % json.dumps(redirect, ensure_ascii=False)) + js
    # footer cross-links point inside this site
    foot = '<span class="morelinks">আরও দেখুন: <a href="%sindex.html">মেকানিক্যাল হ্যান্ডবুক</a> · %s</span>' % (HB, others)
    js = re.sub(r'<span class="morelinks">.*?</span>', lambda _: foot, js)

    head = (src / "head.html").read_text()
    body = shell + mods + "</main>\n</div>\n" + conf.get("three", "") + "<script>\n" + js + "\n</script>\n"
    page = ('<!doctype html>\n<html lang="bn">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
            '<link rel="icon" href="../../assets/icon.svg" type="image/svg+xml">\n' + head + BAR_CSS +
            '</head>\n<body>\n' + body +
            '<script>if("serviceWorker" in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("../../sw.js").catch(()=>{})</script>\n'
            '</body>\n</html>\n')
    index_entries(name, conf["title"], mods)
    out = ROOT / "guides" / name / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page)
    print(out.relative_to(ROOT), len(page.encode()), "bytes,", len(moved), "modules moved to the handbook")


ENTRIES = []


def index_entries(name, title, mods):
    """One search entry per guide module, for the handbook's site-wide search."""
    import html as H
    for m in re.finditer(r'<section class="mod" id="m-([a-z]+)"[^>]*data-title="([^"]*)"[^>]*>([\s\S]*?)</section>', mods):
        mid, mt, body = m.groups()
        if mid == "home":
            continue
        text = re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"<(script|svg)[\s\S]*?</\1>", " ", body)))).strip()
        ENTRIES.append({"u": "guides/%s/#%s" % (name, mid), "t": H.unescape(mt), "s": title, "g": "প্ল্যান্ট গাইড", "k": "", "x": text[:700]})


for name, conf in GUIDES.items():
    build(name, conf)

# replace the guide entries in both search indexes (English pages link to the same Bangla guides)
for idx, prefix in (("search.json", ""), ("bn/search.json", "../")):
    f = ROOT / idx
    data = [e for e in json.loads(f.read_text()) if "guides/" not in e["u"]]
    data += [dict(e, u=prefix + e["u"]) for e in ENTRIES]
    f.write_text(json.dumps(data, ensure_ascii=False))
print("search entries:", len(ENTRIES))
