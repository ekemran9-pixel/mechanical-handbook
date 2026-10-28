// Site-wide search and theme toggle. Loaded on every page.
(function () {
  const root = document.body.dataset.root || "";
  const q = document.getElementById("q"), box = document.getElementById("results");
  let index = null, sel = -1;
  const bn = document.documentElement.lang === "bn";
  const T = bn ? { none: q => "“" + q + "” দিয়ে কিছু পাওয়া যায়নি। একটি শব্দ দিয়ে চেষ্টা করুন, যেমন “seal” বা “পাম্প”।", http: "সার্চ কাজ করতে সাইটটি ওয়েব ঠিকানা থেকে খুলুন, ফাইল হিসেবে নয়।" }
                : { none: q => "Nothing found for “" + q + "”. Try one word, like “seal” or “torque”.", http: "Search needs the site to be served over http. Open it from the web address, not from a file." };

  const load = () => index ? Promise.resolve(index) :
    fetch(root + "search.json").then(r => r.json()).then(d => (index = d.map(e => ({ ...e, hay: (e.t + " " + e.k + " " + e.x).toLowerCase() }))));

  const escHtml = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const hl = (s, words) => { let h = escHtml(s); words.forEach(w => { if (w.length > 1) h = h.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return h; };

  function snippet(x, words) {
    const lx = x.toLowerCase(); let i = -1;
    for (const w of words) { i = lx.indexOf(w); if (i >= 0) break; }
    if (i < 0) return x.slice(0, 110);
    const a = Math.max(0, i - 45);
    return (a ? "…" : "") + x.slice(a, a + 130) + "…";
  }

  function run() {
    const s = q.value.trim().toLowerCase();
    if (s.length < 2) { box.hidden = true; return; }
    load().then(idx => {
      const words = s.split(/\s+/).filter(Boolean);
      const hits = [];
      for (const e of idx) {
        if (!words.every(w => e.hay.includes(w))) continue;
        let sc = 0;
        const tl = e.t.toLowerCase();
        for (const w of words) { if (tl.includes(w)) sc += 10; if (e.k.toLowerCase().includes(w)) sc += 5; if (tl.startsWith(w)) sc += 5; }
        if (!e.u.includes("#")) sc += 2;
        hits.push([sc, e]);
      }
      hits.sort((a, b) => b[0] - a[0]);
      sel = -1;
      box.innerHTML = hits.length
        ? hits.slice(0, 14).map(([, e]) => `<a href="${root + e.u}"><span class="cat">${escHtml(e.s)} · ${escHtml(e.g)}</span>${hl(e.t, words)}<span class="snip">${hl(snippet(e.x, words), words)}</span></a>`).join("")
        : `<div class="none">${T.none(escHtml(q.value))}</div>`;
      box.hidden = false;
    }).catch(() => { box.innerHTML = '<div class="none">' + T.http + "</div>"; box.hidden = false; });
  }

  if (q) {
    let t; q.addEventListener("input", () => { clearTimeout(t); t = setTimeout(run, 90); });
    q.addEventListener("focus", () => { load().catch(() => {}); if (q.value.trim().length > 1) run(); });
    q.addEventListener("keydown", e => {
      const items = [...box.querySelectorAll("a")];
      if (e.key === "Escape") { box.hidden = true; q.blur(); }
      else if (e.key === "ArrowDown" && items.length) { e.preventDefault(); sel = Math.min(sel + 1, items.length - 1); }
      else if (e.key === "ArrowUp" && items.length) { e.preventDefault(); sel = Math.max(sel - 1, 0); }
      else if (e.key === "Enter") { const a = items[Math.max(sel, 0)]; if (a) location.href = a.href; return; }
      else return;
      items.forEach((a, i) => a.classList.toggle("on", i === sel));
      if (items[sel]) items[sel].scrollIntoView({ block: "nearest" });
    });
    document.addEventListener("click", e => { if (!e.target.closest(".search")) box.hidden = true; });
    document.addEventListener("keydown", e => { if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); q.focus(); } });
  }

  const tb = document.getElementById("theme");
  if (tb) tb.addEventListener("click", () => {
    const cur = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("fh-theme", next); } catch (e) {}
  });
})();

// Offline support: keep a copy of the handbook on the phone (only over http/https).
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("/sw.js").catch(() => {});
