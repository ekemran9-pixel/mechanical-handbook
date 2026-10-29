// Quiz: pick a subject, answer 10 random questions, see explanations and links.
(function () {
  const BN = document.documentElement.lang === "bn";
  const n = x => BN ? x.toLocaleString("bn-BD") : String(x);
  const T = BN ? {
    all: "সব", qs: c => n(c) + "টি প্রশ্ন", strong: "চমৎকার। আপনি আপনার কাজ জানেন।", good: "ভিত্তি ভালো। যে বিষয়গুলো ভুল হয়েছে সেগুলো পড়ুন।", weak: "নিচের বিষয়গুলো পড়ে আবার চেষ্টা করুন।",
    again: "আবার পড়ুন", newQ: "নতুন কুইজ", q: (i, t) => "প্রশ্ন " + n(i) + " / " + n(t), score: "স্কোর ", ok: "সঠিক", bad: "ঠিক হয়নি", read: "বিষয়টি পড়ুন", next: "পরের প্রশ্ন", see: "স্কোর দেখুন",
  } : {
    all: "All", qs: c => c + " questions", strong: "Strong. You know your trade.", good: "Good base. Read the topics you missed.", weak: "Work through the topics below, then try again.",
    again: "Read again", newQ: "New quiz", q: (i, t) => "Question " + i + " of " + t, score: "Score ", ok: "Correct", bad: "Not quite", read: "Read the topic", next: "Next question", see: "See score",
  };
  const bank = window.QUIZ || [];
  const cats = ["All", ...new Set(bank.map(q => q[0]))];
  const bar = document.getElementById("quizbar"), box = document.getElementById("quiz");
  document.getElementById("qcount").textContent = T.qs(bank.length);
  let cat = "All", st = null;
  const want = new URLSearchParams(location.search).get("s");  // links from the start page pick a subject
  if (want && cats.includes(want)) cat = want;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const pill = (c, t) => '<span class="pill ' + c + '">' + t + "</span>";

  function renderBar() {
    bar.innerHTML = cats.map(c => '<button type="button" aria-pressed="' + (c === cat) + '" data-c="' + esc(c) + '">' + esc(c === "All" ? T.all : c) + " (" + n(c === "All" ? bank.length : bank.filter(q => q[0] === c).length) + ")</button>").join("");
    bar.querySelectorAll("button").forEach(b => b.addEventListener("click", () => { cat = b.dataset.c; renderBar(); start(); }));
  }
  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function start() {
    const pool = bank.filter(q => cat === "All" || q[0] === cat);
    st = { qs: shuffle([...pool]).slice(0, 10).map(q => { const order = shuffle(q[2].map((_, i) => i)); return { q: q[1], opts: order.map(i => q[2][i]), ans: order.indexOf(q[3]), why: q[4], link: q[5], cat: q[0] }; }), i: 0, score: 0, missed: [] };
    render();
  }
  function render() {
    if (st.i >= st.qs.length) {
      const pct = st.score / st.qs.length;
      box.innerHTML = "<h2>" + n(st.score) + " / " + n(st.qs.length) + "</h2><p>" + (pct >= 0.8 ? T.strong : pct >= 0.5 ? T.good : T.weak) + "</p>" +
        (st.missed.length ? "<h3>" + T.again + "</h3><ul>" + st.missed.map(m => '<li><a href="' + m.link + '">' + esc(m.q) + "</a></li>").join("") + "</ul>" : "") +
        '<div class="row"><button class="btn" id="again" type="button">' + T.newQ + '</button></div>';
      document.getElementById("again").addEventListener("click", start);
      return;
    }
    const q = st.qs[st.i];
    box.innerHTML = '<div class="qmeta"><span>' + esc(q.cat) + " · " + T.q(st.i + 1, st.qs.length) + "</span><span>" + T.score + n(st.score) + '</span></div><h2 style="font-size:1.5rem;margin-top:10px">' + esc(q.q) + '</h2><div class="opts">' +
      q.opts.map((o, k) => '<button type="button" data-k="' + k + '">' + esc(o) + "</button>").join("") + '</div><div id="explain"></div>';
    box.querySelectorAll(".opts button").forEach(b => b.addEventListener("click", () => {
      const k = +b.dataset.k;
      box.querySelectorAll(".opts button").forEach(x => { x.disabled = true; if (+x.dataset.k === q.ans) x.classList.add("right"); });
      if (k === q.ans) st.score++; else { b.classList.add("wrong"); st.missed.push(q); }
      document.getElementById("explain").innerHTML = '<p style="margin-top:14px">' + (k === q.ans ? pill("ok", T.ok) : pill("bad", T.bad)) + " " + esc(q.why) + ' <a href="' + q.link + '">' + T.read + '</a></p><div class="row"><button class="btn" id="nextQ" type="button">' + (st.i + 1 < st.qs.length ? T.next : T.see) + "</button></div>";
      const n = document.getElementById("nextQ"); n.addEventListener("click", () => { st.i++; render(); }); n.focus();
    }));
  }
  renderBar(); start();
})();
