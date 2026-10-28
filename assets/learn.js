// Learning layer for topic pages (English and Bangla).
// Content lives in assets/learn-<section>.js as LEARN["section/page"] = { en: {...}, bn: {...} }:
//   simple   plain-language explanation (one or two paragraphs, \n\n between them)
//   why      why it matters on site
//   like     an everyday comparison
//   terms    [[term, meaning], ...]
//   steps    [[title, detail], ...]  how the job is done, in order (optional)
//   mistakes [text, ...]
//   check    [[question, answer], ...]
(function () {
  const bn = document.documentElement.lang === "bn";
  const T = bn
    ? { badge: "নতুনদের জন্য", simple: "সহজ ভাষায়", why: "কেন জরুরি", like: "সহজ উপমা", terms: "মূল শব্দগুলো", steps: "কাজটা ধাপে ধাপে", mistakes: "সাধারণ ভুল", check: "নিজেকে যাচাই করুন", show: "উত্তর দেখুন", hint: "প্রথমে নিজে উত্তর ভাবুন, তারপর খুলে মিলিয়ে নিন।" }
    : { badge: "For beginners", simple: "In simple words", why: "Why it matters", like: "Think of it like this", terms: "Key words", steps: "The job, step by step", mistakes: "Common mistakes", check: "Test yourself", show: "Show answer", hint: "Think of your answer first, then open it to check." };
  const key = location.pathname.replace(/^.*?\/(bn\/)?([a-z-]+\/[a-z0-9-]+)(\.html)?$/, "$2");
  const all = window.LEARN && window.LEARN[key], d = all && (bn ? all.bn : all.en), art = document.querySelector("article");
  if (!d || !art) return;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  // text may use **bold**; everything else is escaped
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const paras = s => String(s).split(/\n\n+/).map(p => "<p>" + md(p) + "</p>").join("");

  const top = document.createElement("section");
  top.className = "learn";
  top.innerHTML = '<div class="lhead"><span class="lbadge">' + T.badge + "</span><h2>" + T.simple + "</h2></div>" + paras(d.simple) +
    '<div class="lgrid">' + (d.why ? '<div class="lcard lwhy"><h3>' + T.why + "</h3>" + paras(d.why) + "</div>" : "") +
    (d.like ? '<div class="lcard llike"><h3>' + T.like + "</h3>" + paras(d.like) + "</div>" : "") + "</div>" +
    (d.terms && d.terms.length ? '<details class="lterms"><summary>' + T.terms + " (" + (bn ? d.terms.length.toLocaleString("bn-BD") : d.terms.length) + ')</summary><dl>' +
      d.terms.map(([t, m]) => "<div><dt>" + md(t) + "</dt><dd>" + md(m) + "</dd></div>").join("") + "</dl></details>" : "");
  const anchor = art.querySelector(".toc") || art.querySelector(".summary");
  anchor ? anchor.after(top) : art.prepend(top);

  const end = document.createElement("section");
  end.className = "learn-end";
  let h = "";
  if (d.steps && d.steps.length) h += "<h2>" + T.steps + '</h2><ol class="lsteps">' + d.steps.map(([t, x]) => "<li><b>" + md(t) + "</b>" + (x ? "<span>" + md(x) + "</span>" : "") + "</li>").join("") + "</ol>";
  if (d.mistakes && d.mistakes.length) h += "<h2>" + T.mistakes + '</h2><ul class="lmistakes">' + d.mistakes.map(m => "<li>" + md(m) + "</li>").join("") + "</ul>";
  if (d.check && d.check.length) h += "<h2>" + T.check + '</h2><p class="lhint">' + T.hint + '</p><div class="lcheck">' + d.check.map(([q, a], i) => '<details><summary><span class="qn">' + (i + 1) + "</span>" + md(q) + '</summary><p><span class="lshow">' + T.show + "</span>" + md(a) + "</p></details>").join("") + "</div>";
  end.innerHTML = h;
  const pager = art.querySelector(".pager");
  if (h) pager ? pager.before(end) : art.appendChild(end);
})();
