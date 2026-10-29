// Read counts shown in the footer: this page, all pages, and visitors (one per browser).
// Uses a free public counter service; if it can't be reached (offline, blocked) nothing is shown.
(function () {
  const NS = "emran-mechanical-handbook";
  // first service is used; the second only if the first does not answer
  const API = [
    { hit: k => "https://api.counterapi.dev/v1/" + NS + "/" + k + "/up", get: k => "https://api.counterapi.dev/v1/" + NS + "/" + k, n: j => j.count },
    { hit: k => "https://abacus.jasoncameron.dev/hit/" + NS + "/" + k, get: k => "https://abacus.jasoncameron.dev/get/" + NS + "/" + k, n: j => j.value }
  ];
  if (!location.protocol.startsWith("http") || !window.fetch) return;
  const bn = document.documentElement.lang === "bn";
  // the same topic in English and Bangla counts as one page
  const path = location.pathname.replace(/^.*?\/(?:mechanical-handbook\/)?/, "/").replace(/^\/bn\//, "/").replace(/(index)?\.html$/, "").replace(/\/$/, "");
  const page = ("p-" + (path.replace(/^\//, "").replace(/[^a-z0-9]+/gi, "-") || "home")).slice(0, 60).toLowerCase();
  const store = (s, k, v) => { try { return v === undefined ? s.getItem(k) : s.setItem(k, v); } catch (e) { return null; } };
  // a reload in the same visit is not counted again
  const fresh = !store(sessionStorage, "seen:" + page), newVisitor = !store(localStorage, "mh-visitor");

  const num = v => (bn ? Number(v).toLocaleString("bn-BD") : Number(v).toLocaleString("en-US"));
  const call = (api, url) => fetch(url, { cache: "no-store" }).then(r => { if (!r.ok) throw r.status; return r.json(); }).then(j => { const v = api.n(j); if (typeof v !== "number") throw "bad"; return v; });
  const count = (api, key, up) => call(api, up ? api.hit(key) : api.get(key)).catch(e => (up || typeof e !== "number" ? Promise.reject(e) : 0));  // a counter not made yet reads 0

  function run(api) {
    return Promise.all([count(api, page, fresh), count(api, "site", fresh), count(api, "visitors", newVisitor)]);
  }
  run(API[0]).catch(() => run(API[1])).then(([p, s, v]) => {
    if (fresh) store(sessionStorage, "seen:" + page, "1");
    if (newVisitor) store(localStorage, "mh-visitor", "1");
    const el = document.createElement("p");
    el.className = "reads";
    el.innerHTML = bn
      ? "<span>এই পাতা পড়া হয়েছে <b>" + num(p) + "</b> বার</span><span>সাইটে মোট পড়া <b>" + num(s) + "</b> বার</span><span>মোট পাঠক <b>" + num(v) + "</b> জন</span>"
      : "<span>This page read <b>" + num(p) + "</b> time" + (p === 1 ? "" : "s") + "</span><span>Site reads <b>" + num(s) + "</b></span><span>Visitors <b>" + num(v) + "</b></span>";
    const foot = document.querySelector("footer.foot .wrap");
    if (foot) foot.appendChild(el);
    else { el.style.cssText = "display:flex;flex-wrap:wrap;gap:4px 16px;justify-content:center;margin:0;padding:10px 16px 14px;font-size:13px;opacity:.75"; document.body.appendChild(el); }
  }).catch(() => {});
})();
