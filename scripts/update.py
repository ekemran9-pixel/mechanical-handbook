"""Run after changing any page or asset:  python3 scripts/update.py

- bumps the ?v= number on CSS/JS links so browsers fetch the new files
- rebuilds sw.js (offline copy of every page), sitemap.xml and robots.txt
- refreshes the share-preview tags (WhatsApp/Facebook) in every page head
Set SITE to the site's address when the Netlify link changes.
"""
import pathlib, re, html, datetime

SITE = "https://ekemran9-pixel.github.io/foreman-handbook"
ROOT = pathlib.Path(__file__).resolve().parent.parent
pages = sorted(p for p in ROOT.rglob("*.html") if ".git" not in p.parts and "guides-src" not in p.parts)
rel = lambda p: p.relative_to(ROOT).as_posix()

# 1. asset version
cur = max([int(v) for p in pages for v in re.findall(r"\?v=(\d+)\"", p.read_text())] or [0])
ver = cur + 1
for p in pages:
    s = p.read_text()
    p.write_text(re.sub(r'(assets/[\w-]+\.(?:css|js))(\?v=\d+)?"', r'\1?v=%d"' % ver, s))
for js in ("assets/tools.js", "assets/tools-bn.js"):
    f = ROOT / js
    f.write_text(re.sub(r'UI_VER = "\d+"', 'UI_VER = "%d"' % ver, f.read_text()))

# 2. head tags: app manifest, icons and share preview
for p in pages:
    s = p.read_text()
    url = SITE + "/" + ("" if rel(p) == "index.html" else rel(p))
    title = html.unescape(re.search(r"<title>(.*?)</title>", s, re.S).group(1))
    m = re.search(r'<meta name="description" content="([^"]*)"', s)
    desc = html.unescape(m.group(1)) if m else title
    bn = rel(p).startswith("bn/")
    up = "../" * (len(p.relative_to(ROOT).parts) - 1)
    tags = "\n".join([
        '<link rel="manifest" href="%smanifest.webmanifest">' % up,
        '<link rel="apple-touch-icon" href="%sassets/icon-192.png">' % up,
        '<meta property="og:type" content="website">',
        '<meta property="og:site_name" content="%s">' % ("মেকানিক্যাল হ্যান্ডবুক" if bn else "Mechanical Handbook"),
        '<meta property="og:title" content="%s">' % html.escape(title),
        '<meta property="og:description" content="%s">' % html.escape(desc),
        '<meta property="og:url" content="%s">' % url,
        '<meta property="og:image" content="%s/assets/og.png">' % SITE,
        '<meta property="og:locale" content="%s">' % ("bn_BD" if bn else "en_US"),
        '<meta name="twitter:card" content="summary_large_image">',
    ])
    block = "<!--meta-->\n" + tags + "\n<!--/meta-->"
    if "<!--meta-->" in s:
        s = re.sub(r"<!--meta-->.*?<!--/meta-->", lambda _: block, s, flags=re.S)
    else:
        s = s.replace("</head>", block + "\n</head>", 1)
    p.write_text(s)

# 3. offline service worker: precache every page and asset
files = [rel(p) for p in pages if rel(p) != "404.html"]
files += [rel(p) for p in sorted((ROOT / "assets").iterdir()) if p.suffix in (".css", ".js", ".svg", ".png") and p.name != "og.png"]
files += ["search.json", "bn/search.json", "manifest.webmanifest"]
sw = (ROOT / "scripts" / "sw.template.js").read_text()
sw = sw.replace("__VERSION__", "mh-v%d" % ver).replace("__FILES__", ",\n  ".join('"%s"' % f for f in files))
(ROOT / "sw.js").write_text(sw)

# 4. sitemap and robots
today = datetime.date.today().isoformat()
urls = "".join("<url><loc>%s/%s</loc><lastmod>%s</lastmod></url>\n" % (SITE, "" if f == "index.html" else f, today) for f in files if f.endswith(".html"))
(ROOT / "sitemap.xml").write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
(ROOT / "robots.txt").write_text("User-agent: *\nAllow: /\nSitemap: %s/sitemap.xml\n" % SITE)
print("version", ver, "· pages", len(pages), "· offline files", len(files))
