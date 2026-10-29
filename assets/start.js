// Start page: 30-day plan progress (saved on this device), offline status and the install button.
(function () {
  const bn = document.documentElement.lang === "bn";
  const n = x => (bn ? x.toLocaleString("bn-BD") : String(x));
  const KEY = "mh-plan";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const boxes = [...document.querySelectorAll(".stday input[type=checkbox]")], total = boxes.length;
  const bar = document.getElementById("stbar"), count = document.getElementById("stcount"), next = document.getElementById("stnext");

  function show() {
    const done = load();
    let k = 0, first = 0;
    boxes.forEach(b => {
      const d = +b.dataset.day, on = !!done[d];
      b.checked = on; b.closest(".stday").classList.toggle("done", on);
      if (on) k++; else if (!first) first = d;
    });
    bar.style.width = (100 * k / total) + "%";
    count.textContent = bn ? n(total) + " দিনের " + n(k) + " দিন শেষ" : k + " of " + total + " days done";
    if (!first) { next.textContent = bn ? "পরের ৩০ দিন দেখুন" : "See the next 30 days"; next.href = "#next"; }
    else { next.textContent = k ? (bn ? n(first) + " নম্বর দিন চালিয়ে যান" : "Continue: day " + first) : (bn ? "১ম দিন শুরু করুন" : "Start day 1"); next.href = "#day-" + first; }
    document.querySelectorAll(".stday").forEach(li => li.classList.toggle("cur", +li.dataset.day === first));
  }
  boxes.forEach(b => b.addEventListener("change", () => { const d = load(); if (b.checked) d[b.dataset.day] = Date.now(); else delete d[b.dataset.day]; save(d); show(); }));
  document.getElementById("streset").addEventListener("click", () => {
    if (confirm(bn ? "সব টিক মুছে আবার ১ম দিন থেকে শুরু করবেন?" : "Clear all ticks and start again from day 1?")) { save({}); show(); }
  });
  show();

  // offline status: is the offline copy on this device yet?
  const off = document.getElementById("stoffline");
  const say = (cls, t) => { off.className = "stoff " + cls; off.textContent = t; };
  const standalone = matchMedia("(display-mode: standalone)").matches || navigator.standalone;
  if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) say("no", bn ? "এই ব্রাউজারে অফলাইন সুবিধা নেই। Chrome বা Safari ব্যবহার করুন।" : "This browser can't keep an offline copy. Use Chrome or Safari.");
  else navigator.serviceWorker.ready.then(() => caches.keys()).then(ks => Promise.all(ks.map(k => caches.open(k).then(c => c.keys())))).then(ls => {
    const files = ls.reduce((a, l) => a + l.length, 0);
    if (files > 100) say("ok", (standalone ? (bn ? "✓ হোম স্ক্রিন থেকে চলছে। " : "✓ Running from your home screen. ") : "") + (bn ? "✓ অফলাইন কপি তৈরি: এই ডিভাইসে " + n(files) + "টি ফাইল রাখা আছে, ইন্টারনেট ছাড়াই চলবে।" : "✓ Offline copy ready: " + files + " files are saved on this device, so it works without internet."));
    else say("wait", bn ? "অফলাইন কপি নামছে… ইন্টারনেট চালু রেখে এক মিনিট পর আবার দেখুন।" : "Offline copy is downloading… keep the internet on and look again in a minute.");
  }).catch(() => say("wait", bn ? "অফলাইন কপি এখনো তৈরি হয়নি।" : "Offline copy not ready yet."));
  setTimeout(() => { if (/যাচাই|Checking/.test(off.textContent)) say("wait", bn ? "অফলাইন কপি নামছে… একটু পরে আবার দেখুন।" : "Offline copy is downloading… look again shortly."); }, 4000);

  // install button where the browser offers it (Chrome, Edge, Samsung Internet)
  let prompt = null;
  const btn = document.getElementById("stinstall");
  addEventListener("beforeinstallprompt", e => { e.preventDefault(); prompt = e; if (!standalone) btn.hidden = false; });
  btn.addEventListener("click", () => { if (!prompt) return; prompt.prompt(); prompt.userChoice.finally(() => { prompt = null; btn.hidden = true; }); });
  addEventListener("appinstalled", () => { btn.hidden = true; });
})();
