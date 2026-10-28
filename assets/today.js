// Today page: checklist, job board, toolbox talk and shift report. State lives in localStorage.
(function () {
  const $ = s => document.querySelector(s);
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);
  const BN = document.documentElement.lang === "bn";
  const LOC = BN ? "bn-BD" : undefined;
  const T = BN ? {
    del: "আইটেম মুছুন", done: (d, n) => d.toLocaleString(LOC) + "/" + n.toLocaleString(LOC) + " সম্পন্ন", frac: (a, b) => a.toLocaleString(LOC) + "/" + b.toLocaleString(LOC),
    job: "কাজ", crew: "ক্রু", permit: "পারমিট", status: "অবস্থা", delJob: "কাজ মুছুন", mine: "আমার আইটেম",
    st: { "Not started": "শুরু হয়নি", "Waiting permit": "পারমিটের অপেক্ষা", "Waiting parts": "পার্টসের অপেক্ষা", "In progress": "চলছে", "On hold": "স্থগিত", "Done": "সম্পন্ন" },
    today: "আজকের বিষয়", topic: (i, n) => "বিষয় " + i.toLocaleString(LOC) + " / " + n.toLocaleString(LOC), ask: "ক্রুকে জিজ্ঞাসা করুন: ",
    shift: { Day: "দিন", Night: "রাত", Swing: "সুইং" },
    rTitle: "মেকানিক্যাল শিফট রিপোর্ট", rShift: " শিফট", rForeman: "ফোরম্যান: ", rArea: "এলাকা: ", rCrew: "ক্রু: ", rTalk: "টুলবক্স টক: ",
    rDone: "সম্পন্ন", rProg: "চলমান", rBlocked: "আটকে আছে / স্থগিত", rNot: "শুরু হয়নি", rDelay: "দেরি / সমস্যা", rNone: "নেই", rNext: "পরের শিফট", rSafe: "নিরাপত্তা",
    rCheck: (a, b) => "চেকলিস্ট: " + a.toLocaleString(LOC) + "/" + b.toLocaleString(LOC) + " সম্পন্ন", rOpen: "বাকি আইটেম:",
    copied: "কপি হয়েছে", selected: "সিলেক্ট হয়েছে। কপি করতে Ctrl+C চাপুন।",
  } : {
    del: "Remove item", done: (d, n) => d + " of " + n + " done", frac: (a, b) => a + "/" + b,
    job: "Job", crew: "Crew", permit: "Permit", status: "Status", delJob: "Remove job", mine: "My items",
    st: {}, today: "Today's topic", topic: (i, n) => "Topic " + i + " of " + n, ask: "Ask the crew: ", shift: {},
    rTitle: "MECHANICAL SHIFT REPORT", rShift: " shift", rForeman: "Foreman: ", rArea: "Area: ", rCrew: "Crew: ", rTalk: "Toolbox talk: ",
    rDone: "COMPLETED", rProg: "IN PROGRESS", rBlocked: "BLOCKED / ON HOLD", rNot: "NOT STARTED", rDelay: "DELAYS / PROBLEMS", rNone: "None", rNext: "NEXT SHIFT", rSafe: "SAFETY",
    rCheck: (a, b) => "CHECKLIST: " + a + "/" + b + " complete", rOpen: "Open items:",
    copied: "Copied", selected: "Selected. Press Ctrl+C to copy.",
  };
  const stLabel = s => T.st[s] || s;
  $("#dateline").textContent = now.toLocaleDateString(LOC, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  /* ---------- checklist ---------- */
  const baseEn = [
    { ph: "Start of shift", items: ["Read last shift's handover", "Toolbox talk held, attendance signed", "Permits reviewed and signed with operations", "Isolations walked and own lock applied", "Crew allocated, JSA read at each job", "Materials and special tools checked for today's jobs", "PPE check: harness, gloves, glasses, hearing"] },
    { ph: "During shift", items: ["Walk every job before the first break", "Hot work: fire watch and gas tests in place", "Lifts: lift plan and exclusion zone checked", "Measurements being recorded (alignment, torque, clearances)", "Welding rods in ovens / quivers plugged in", "Housekeeping round", "Planner meeting: tomorrow's permits and materials"] },
    { ph: "End of shift", items: ["Jobs handed back or made safe", "Permits closed or suspended", "Tools returned, consumables stored", "Job cards and work orders completed", "Timesheets done", "Face-to-face handover to next shift"] },
  ];
  const baseBn = [
    { ph: "শিফটের শুরু", items: ["আগের শিফটের হ্যান্ডওভার পড়া", "টুলবক্স টক হয়েছে, উপস্থিতি সই", "অপারেশনসের সাথে পারমিট রিভিউ ও সই", "আইসোলেশন ঘুরে দেখা ও নিজের লক লাগানো", "ক্রু বণ্টন, প্রতিটি কাজে JSA পড়া", "আজকের কাজের ম্যাটেরিয়াল ও বিশেষ টুল যাচাই", "PPE চেক: হারনেস, গ্লাভস, চশমা, কানের সুরক্ষা"] },
    { ph: "শিফট চলাকালীন", items: ["প্রথম বিরতির আগে প্রতিটি কাজ ঘুরে দেখা", "হট ওয়ার্ক: ফায়ার ওয়াচ ও গ্যাস টেস্ট আছে", "লিফট: লিফট প্ল্যান ও এক্সক্লুশন জোন যাচাই", "মাপ রেকর্ড হচ্ছে (অ্যালাইনমেন্ট, টর্ক, ক্লিয়ারেন্স)", "ওয়েল্ডিং রড ওভেনে / কুইভার প্লাগ করা", "হাউসকিপিং রাউন্ড", "প্ল্যানার মিটিং: আগামীকালের পারমিট ও ম্যাটেরিয়াল"] },
    { ph: "শিফটের শেষ", items: ["কাজ ফেরত দেওয়া বা নিরাপদ করা", "পারমিট বন্ধ বা স্থগিত", "টুল ফেরত, কনজিউমেবল গুছিয়ে রাখা", "জব কার্ড ও ওয়ার্ক অর্ডার পূরণ", "টাইমশিট সম্পন্ন", "পরের শিফটকে মুখোমুখি হ্যান্ডওভার"] },
  ];
  const base = BN ? baseBn : baseEn;
  let custom = store.get("fh-custom-checks", []);
  let checks = store.get("fh-checks-" + dayKey, {});
  function allSections() { return custom.length ? [...base, { ph: T.mine, items: custom, mine: true }] : base; }
  function renderChecks() {
    const box = $("#checklist"); box.innerHTML = ""; let n = 0, done = 0;
    allSections().forEach((sec, si) => {
      const ids = sec.items.map((_, ii) => (sec.mine ? "m" : si) + "-" + ii);
      const secDone = ids.filter(k => checks[k]).length;
      const h = document.createElement("div"); h.className = "phase";
      h.innerHTML = "<span>" + esc(sec.ph) + "</span><span>" + T.frac(secDone, sec.items.length) + "</span>";
      box.appendChild(h);
      sec.items.forEach((it, ii) => {
        const k = ids[ii]; n++; if (checks[k]) done++;
        const row = document.createElement("div"); row.className = "check";
        row.innerHTML = '<input type="checkbox" id="ck-' + k + '"' + (checks[k] ? " checked" : "") + '><label for="ck-' + k + '">' + esc(it) + "</label>" + (sec.mine ? '<button class="del" type="button" aria-label="' + T.del + '">×</button>' : "");
        row.querySelector("input").addEventListener("change", e => { checks[k] = e.target.checked; store.set("fh-checks-" + dayKey, checks); renderChecks(); buildReport(); });
        const del = row.querySelector(".del");
        if (del) del.addEventListener("click", () => { custom.splice(ii, 1); store.set("fh-custom-checks", custom); renderChecks(); buildReport(); });
        box.appendChild(row);
      });
    });
    $("#meter").style.width = (n ? done / n * 100 : 0) + "%";
    $("#progress").textContent = T.done(done, n);
  }
  $("#addCheck").addEventListener("click", addCustom);
  $("#newCheck").addEventListener("keydown", e => { if (e.key === "Enter") addCustom(); });
  function addCustom() {
    const v = $("#newCheck").value.trim(); if (!v) return;
    custom.push(v); store.set("fh-custom-checks", custom); $("#newCheck").value = ""; renderChecks(); buildReport();
  }
  $("#resetChecks").addEventListener("click", () => { checks = {}; store.set("fh-checks-" + dayKey, checks); renderChecks(); buildReport(); });

  /* ---------- jobs ---------- */
  const sample = [
    { job: "WO-48812 P-101B seal change", crew: "Ali, Ben", permit: "PTW 4471", status: "In progress" },
    { job: "WO-48790 E-204 bundle pull", crew: "Rigging crew", permit: "PTW 4468", status: "Waiting permit" },
    { job: "WO-48801 K-301 valve inspection", crew: "Carlos", permit: "PTW 4472", status: "Done" },
  ];
  const sampleBn = [
    { job: "WO-48812 P-101B সিল বদল", crew: "আলী, বেলাল", permit: "PTW 4471", status: "In progress" },
    { job: "WO-48790 E-204 বান্ডল টানা", crew: "রিগিং ক্রু", permit: "PTW 4468", status: "Waiting permit" },
    { job: "WO-48801 K-301 ভাল্ভ ইন্সপেকশন", crew: "কামাল", permit: "PTW 4472", status: "Done" },
  ];
  let jobs = store.get("fh-jobs", null) || (BN ? sampleBn : sample);
  const statuses = ["Not started", "Waiting permit", "Waiting parts", "In progress", "On hold", "Done"];
  function renderJobs() {
    const tb = $("#jobs"); tb.innerHTML = "";
    jobs.forEach((j, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = '<td><input type="text" id="job-' + i + '" value="' + esc(j.job) + '" aria-label="' + T.job + '"></td>' +
        '<td><input type="text" id="crew-' + i + '" value="' + esc(j.crew) + '" aria-label="' + T.crew + '"></td>' +
        '<td><input type="text" id="permit-' + i + '" value="' + esc(j.permit) + '" aria-label="' + T.permit + '"></td>' +
        '<td><select class="status-sel" id="status-' + i + '" aria-label="' + T.status + '">' + statuses.map(s => '<option value="' + s + '"' + (s === j.status ? " selected" : "") + ">" + esc(stLabel(s)) + "</option>").join("") + "</select></td>" +
        '<td><button class="del" type="button" aria-label="' + T.delJob + '" style="background:none;border:0;color:var(--muted);cursor:pointer;font-size:1.1rem">×</button></td>';
      ["job", "crew", "permit", "status"].forEach(f => tr.querySelector("#" + f + "-" + i).addEventListener("input", e => { jobs[i][f] = e.target.value; store.set("fh-jobs", jobs); buildReport(); }));
      tr.querySelector(".del").addEventListener("click", () => { jobs.splice(i, 1); store.set("fh-jobs", jobs); renderJobs(); buildReport(); });
      tb.appendChild(tr);
    });
  }
  $("#addJob").addEventListener("click", () => { jobs.push({ job: "", crew: "", permit: "", status: "Not started" }); store.set("fh-jobs", jobs); renderJobs(); const last = document.getElementById("job-" + (jobs.length - 1)); if (last) last.focus(); });

  /* ---------- toolbox talks ---------- */
  const talksEn = [
    ["Line of fire", ["Stand out of the path of moving loads, springs and pressurised lines.", "Never put hands between a load and a fixed object.", "Use push sticks, taglines and tools to keep hands clear."], "Where on today's jobs could someone be caught in the line of fire?"],
    ["Stored energy in pumps", ["A locked motor can still turn if liquid flows backward through the pump.", "Close and lock suction and discharge valves, seal flush and cooling.", "Drain and vent the casing before opening. Check the gauge."], "Which energy sources did we isolate on today's pump job?"],
    ["Hand injuries", ["Right gloves for the task: cut-resistant for sheet metal, leather for welding.", "No rings or loose sleeves near rotating parts. No gloves at lathes and drills.", "Report every cut, however small."], "What job today has the highest risk to hands?"],
    ["Hot work", ["Permit and gas test before the first spark.", "Clear or cover combustibles within 11 m, cover drains.", "Fire watch stays at least 30 minutes after work stops."], "Who is the fire watch today and do they have an extinguisher?"],
    ["Working at height", ["100% tie-off when there is no guardrail.", "Inspect harness and lanyard before use; check fall clearance.", "Tether tools. Barricade the area below."], "Is there a rescue plan for anyone working in a harness today?"],
    ["Confined space", ["Gas test before entry and continuously while inside.", "Attendant at the entry the whole time, never enters for rescue.", "Rescue equipment set up before anyone goes in."], "What would we do if someone collapsed inside?"],
    ["Rigging basics", ["Check WLL tags on every sling and shackle. No tag, no lift.", "Know the sling angle. Below 30° is not allowed.", "One signal person. Nobody under a suspended load."], "What is the heaviest lift today and who is the signaller?"],
    ["Grinding and cutting", ["Guard on, disc rated above grinder speed, correct disc for the job.", "Face shield over safety glasses, hearing protection.", "Direct sparks away from people, gas bottles and drains."], "Are all grinders on site guarded and in date?"],
    ["Housekeeping", ["Trip hazards cause more injuries than big events.", "Clean as you go. Cables and hoses off walkways.", "Oil spill: absorbent first, then report."], "What is the worst housekeeping spot right now?"],
    ["Manual handling", ["Test the weight first. Above 25 kg get help or a lifting aid.", "Bend your knees, keep the load close, don't twist.", "Plan the route before you pick it up."], "Which parts today are heavy or awkward to carry?"],
    ["Pressure testing", ["Exclusion zone marked and controlled.", "Calibrated gauges and a relief valve fitted.", "Never tighten a flange under pressure. Depressurise first."], "Where is the test boundary and who controls access?"],
    ["Heat stress", ["Drink water every 15–20 minutes in heat.", "Watch for dizziness, confusion, heavy or no sweating.", "Rest breaks in shade are part of the job, not optional."], "Where is the nearest cool rest area and water?"],
    ["Electrical isolation", ["Only electricians prove dead. Then you apply your own lock.", "Your lock, your key. Never lend it.", "Welding earth clamp close to the weld, never through bearings."], "Which jobs today need an electrical isolation?"],
    ["Chemical handling", ["Read the SDS before opening a new product.", "Right gloves for solvents and acids; face shield for splashing.", "Eyewash station checked and close by."], "Which chemicals are we using today and what are their hazards?"],
    ["Dropped objects", ["Secure tools and parts at height.", "Remove loose items from scaffolds after work.", "Barricade under work at height."], "What could fall from today's elevated work?"],
    ["Slips, trips and falls", ["Watch for oil, ice and grating openings.", "Three points of contact on ladders and stairs.", "Use handrails. Don't carry loads that block your view."], "Where are the slippery spots on site today?"],
    ["Pinch points", ["Flanges, couplings, chain blocks and machine guards are pinch points.", "Use tools to align bolt holes, never fingers.", "Communicate before moving a load."], "Where are the pinch points in today's tasks?"],
    ["Line breaking", ["Assume trapped pressure and product.", "Loosen far-side bolts first so the gap opens away from you.", "Wear the PPE the product SDS asks for."], "Which line breaks are planned today and what was in the line?"],
    ["Compressed air", ["Never blow air at skin or clothes.", "Whip checks on hose couplings.", "Vent to zero before breaking a connection."], "Where are air hoses used today and are they secured?"],
    ["Hydraulic tools", ["Inspect hoses and couplings before use.", "Never stand in line with a hydraulic wrench reaction arm.", "High-pressure injection injuries are emergencies."], "Who is trained on the hydraulic tools today?"],
    ["Gas cylinders", ["Upright, chained, caps on when not in use.", "Flashback arrestors on both hoses.", "Leak test with soap, never a flame."], "Are all cylinders on site secured and separated?"],
    ["Excavations", ["Permit and service scan before digging.", "Shoring or battering for trenches over 1.2 m.", "Spoil at least 0.6 m back from the edge."], "Are there open excavations near today's work?"],
    ["Noise", ["Hearing protection above 85 dB. If you have to shout at 1 m, it's too loud.", "Grinding and gouging are over 100 dB.", "Fit earplugs properly: roll, pull ear, insert."], "Which jobs today need double hearing protection?"],
    ["Fatigue", ["Tired people make mistakes. Speak up if you or a mate is exhausted.", "Critical tasks early in the shift, not the last hour.", "Take your breaks."], "Is anyone on their 7th day or long overtime?"],
    ["Stop work authority", ["Anyone can stop any job they think is unsafe.", "No blame for stopping. Ever.", "Stop, make safe, talk, fix, then restart."], "When did someone last stop a job here, and what happened?"],
    ["New and young workers", ["New workers get a buddy and closer supervision.", "Explain why, not just what.", "Check understanding by asking them to explain back."], "Who is new on the crew today?"],
    ["Driving on site", ["Speed limits, seat belts, no phones.", "Pedestrians have right of way. Make eye contact.", "Spotter when reversing large vehicles."], "Where do vehicles and people cross on site?"],
    ["Hand tools", ["Use the right tool. No cheater bars on spanners.", "Inspect: cracked handles, mushroomed chisels, worn jaws.", "Pull, don't push, on spanners."], "What damaged tools did we find this week?"],
    ["Bolting", ["Correct gasket and bolts for the line class.", "Lubricate and follow the cross pattern in passes.", "Calibrated torque tools, record each joint."], "Which flanges are being made up today and what's the torque?"],
    ["Emergency response", ["Know the alarm sounds and the muster points.", "Check the wind direction for gas alarms.", "Foreman does the headcount."], "Where is today's muster point and the nearest eyewash?"],
  ];
  const talksBn = [
    ["লাইন অব ফায়ার", ["চলমান লোড, স্প্রিং ও চাপযুক্ত লাইনের পথ থেকে সরে দাঁড়ান।", "লোড আর স্থির বস্তুর মাঝে কখনো হাত দেবেন না।", "হাত দূরে রাখতে পুশ স্টিক, ট্যাগলাইন ও টুল ব্যবহার করুন।"], "আজকের কোন কাজে কেউ লাইন অব ফায়ারে পড়তে পারে?"],
    ["পাম্পে জমা শক্তি", ["পাম্পের মধ্য দিয়ে তরল উল্টো দিকে গেলে লক করা মোটরও ঘুরতে পারে।", "সাকশন ও ডিসচার্জ ভাল্ভ, সিল ফ্লাশ ও কুলিং বন্ধ করে লক করুন।", "খোলার আগে কেসিং ড্রেন ও ভেন্ট করুন। গেজ দেখুন।"], "আজকের পাম্পের কাজে আমরা কোন কোন শক্তির উৎস আইসোলেট করেছি?"],
    ["হাতের আঘাত", ["কাজ অনুযায়ী সঠিক গ্লাভস: শিট মেটালে কাট-প্রতিরোধী, ওয়েল্ডিংয়ে চামড়ার।", "ঘূর্ণায়মান অংশের কাছে আংটি বা ঢিলা হাতা নয়। লেদ ও ড্রিলে গ্লাভস নয়।", "যত ছোটই হোক, প্রতিটি কাটা জানান।"], "আজকের কোন কাজে হাতের ঝুঁকি সবচেয়ে বেশি?"],
    ["হট ওয়ার্ক", ["প্রথম স্ফুলিঙ্গের আগে পারমিট ও গ্যাস টেস্ট।", "১১ মিটারের মধ্যে দাহ্য বস্তু সরান বা ঢাকুন, ড্রেন ঢাকুন।", "কাজ থামার পর কমপক্ষে ৩০ মিনিট ফায়ার ওয়াচ থাকবে।"], "আজ ফায়ার ওয়াচ কে, আর তার কাছে কি এক্সটিংগুইশার আছে?"],
    ["উচ্চতায় কাজ", ["গার্ডরেল না থাকলে ১০০% টাই-অফ।", "ব্যবহারের আগে হারনেস ও ল্যানিয়ার্ড দেখুন; পতনের ফাঁকা জায়গা যাচাই করুন।", "টুল বেঁধে রাখুন। নিচের এলাকা ব্যারিকেড করুন।"], "আজ হারনেসে কাজ করা কারো জন্য কি উদ্ধার পরিকল্পনা আছে?"],
    ["কনফাইনড স্পেস", ["প্রবেশের আগে ও ভেতরে থাকার পুরো সময় গ্যাস টেস্ট।", "পুরো সময় প্রবেশপথে অ্যাটেনড্যান্ট, উদ্ধারে নিজে কখনো ঢোকেন না।", "কেউ ঢোকার আগেই উদ্ধার সরঞ্জাম প্রস্তুত।"], "কেউ ভেতরে অজ্ঞান হলে আমরা কী করব?"],
    ["রিগিংয়ের মূল কথা", ["প্রতিটি স্লিং ও শ্যাকলে WLL ট্যাগ দেখুন। ট্যাগ নেই, লিফট নেই।", "স্লিং অ্যাঙ্গেল জানুন। ৩০° এর নিচে অনুমোদিত নয়।", "একজন সিগন্যাল ম্যান। ঝুলন্ত লোডের নিচে কেউ নয়।"], "আজকের সবচেয়ে ভারী লিফট কোনটি, আর সিগন্যাল ম্যান কে?"],
    ["গ্রাইন্ডিং ও কাটিং", ["গার্ড লাগানো, ডিস্কের রেটিং গ্রাইন্ডারের গতির বেশি, কাজের জন্য সঠিক ডিস্ক।", "সেফটি চশমার উপর ফেস শিল্ড, কানের সুরক্ষা।", "স্ফুলিঙ্গ মানুষ, গ্যাস বোতল ও ড্রেন থেকে দূরে রাখুন।"], "সাইটের সব গ্রাইন্ডারে কি গার্ড আছে ও মেয়াদ ঠিক আছে?"],
    ["হাউসকিপিং", ["বড় ঘটনার চেয়ে হোঁচটেই বেশি আঘাত হয়।", "কাজের সাথে সাথে পরিষ্কার করুন। হাঁটার পথ থেকে ক্যাবল ও হোস সরান।", "তেল পড়লে: আগে অ্যাবজরবেন্ট, তারপর জানান।"], "এখন সবচেয়ে খারাপ হাউসকিপিংয়ের জায়গা কোনটি?"],
    ["হাতে মাল তোলা", ["আগে ওজন পরখ করুন। ২৫ কেজির বেশি হলে সাহায্য বা লিফটিং যন্ত্র নিন।", "হাঁটু ভাঁজ করুন, লোড কাছে রাখুন, মোচড় দেবেন না।", "তোলার আগে পথ ঠিক করুন।"], "আজকের কোন পার্টস ভারী বা বহনে অসুবিধাজনক?"],
    ["প্রেশার টেস্টিং", ["এক্সক্লুশন জোন চিহ্নিত ও নিয়ন্ত্রিত।", "ক্যালিব্রেটেড গেজ ও রিলিফ ভাল্ভ লাগানো।", "চাপ থাকা অবস্থায় কখনো ফ্ল্যাঞ্জ টাইট করবেন না। আগে চাপমুক্ত করুন।"], "টেস্টের সীমানা কোথায়, আর প্রবেশ কে নিয়ন্ত্রণ করছে?"],
    ["তাপজনিত চাপ", ["গরমে প্রতি ১৫–২০ মিনিটে পানি পান করুন।", "মাথা ঘোরা, বিভ্রান্তি, অতিরিক্ত বা একদম না ঘামা খেয়াল করুন।", "ছায়ায় বিশ্রাম কাজেরই অংশ, ঐচ্ছিক নয়।"], "সবচেয়ে কাছের ঠান্ডা বিশ্রামের জায়গা ও পানি কোথায়?"],
    ["ইলেকট্রিক্যাল আইসোলেশন", ["শুধু ইলেকট্রিশিয়ান ডেড প্রমাণ করেন। তারপর আপনি নিজের লক লাগান।", "আপনার লক, আপনার চাবি। কখনো ধার দেবেন না।", "ওয়েল্ডিং আর্থ ক্ল্যাম্প ওয়েল্ডের কাছে, কখনো বিয়ারিংয়ের মধ্য দিয়ে নয়।"], "আজকের কোন কাজে ইলেকট্রিক্যাল আইসোলেশন লাগবে?"],
    ["কেমিক্যাল হ্যান্ডলিং", ["নতুন পণ্য খোলার আগে SDS পড়ুন।", "সলভেন্ট ও অ্যাসিডের জন্য সঠিক গ্লাভস; ছিটকে পড়ার ঝুঁকিতে ফেস শিল্ড।", "আই-ওয়াশ স্টেশন যাচাই করা ও কাছে আছে।"], "আজ কোন কেমিক্যাল ব্যবহার করছি, আর তাদের বিপদ কী?"],
    ["উপর থেকে পড়া বস্তু", ["উচ্চতায় টুল ও পার্টস সুরক্ষিত রাখুন।", "কাজের পর স্ক্যাফোল্ড থেকে আলগা জিনিস সরান।", "উচ্চতায় কাজের নিচে ব্যারিকেড দিন।"], "আজকের উঁচু কাজ থেকে কী পড়তে পারে?"],
    ["পিছলানো, হোঁচট ও পড়ে যাওয়া", ["তেল, বরফ ও গ্রেটিংয়ের ফাঁক খেয়াল করুন।", "মই ও সিঁড়িতে তিন-বিন্দু সংস্পর্শ।", "হ্যান্ডরেল ধরুন। দৃষ্টি আটকায় এমন লোড বহন করবেন না।"], "আজ সাইটে পিছলে যাওয়ার জায়গাগুলো কোথায়?"],
    ["পিঞ্চ পয়েন্ট", ["ফ্ল্যাঞ্জ, কাপলিং, চেইন ব্লক ও মেশিন গার্ড হলো পিঞ্চ পয়েন্ট।", "বোল্টের ছিদ্র মেলাতে টুল ব্যবহার করুন, কখনো আঙুল নয়।", "লোড সরানোর আগে জানিয়ে দিন।"], "আজকের কাজে পিঞ্চ পয়েন্টগুলো কোথায়?"],
    ["লাইন ব্রেকিং", ["ধরে নিন ভেতরে চাপ ও প্রোডাক্ট আটকে আছে।", "আগে দূরের দিকের বোল্ট ঢিলা করুন যাতে ফাঁক আপনার থেকে দূরে খোলে।", "প্রোডাক্টের SDS অনুযায়ী PPE পরুন।"], "আজ কোন লাইন ব্রেক পরিকল্পিত, আর লাইনে কী ছিল?"],
    ["কম্প্রেসড এয়ার", ["কখনো ত্বক বা কাপড়ে বাতাস দেবেন না।", "হোস কাপলিংয়ে হুইপ চেক।", "সংযোগ খোলার আগে শূন্যে ভেন্ট করুন।"], "আজ কোথায় এয়ার হোস ব্যবহার হচ্ছে, আর সেগুলো কি সুরক্ষিত?"],
    ["হাইড্রলিক টুল", ["ব্যবহারের আগে হোস ও কাপলিং দেখুন।", "হাইড্রলিক রেঞ্চের রিঅ্যাকশন আর্মের লাইনে কখনো দাঁড়াবেন না।", "উচ্চচাপে ইনজেকশন আঘাত জরুরি অবস্থা।"], "আজ হাইড্রলিক টুলে প্রশিক্ষিত কে?"],
    ["গ্যাস সিলিন্ডার", ["খাড়া, শিকলে বাঁধা, ব্যবহার না হলে ক্যাপ লাগানো।", "দুটি হোসেই ফ্ল্যাশব্যাক অ্যারেস্টর।", "সাবান দিয়ে লিক টেস্ট, কখনো শিখা দিয়ে নয়।"], "সাইটের সব সিলিন্ডার কি সুরক্ষিত ও আলাদা রাখা?"],
    ["খনন", ["খোঁড়ার আগে পারমিট ও সার্ভিস স্ক্যান।", "১.২ মিটারের বেশি গভীর ট্রেঞ্চে শোরিং বা ঢাল।", "মাটির স্তূপ কিনারা থেকে কমপক্ষে ০.৬ মিটার দূরে।"], "আজকের কাজের কাছে কি খোলা খনন আছে?"],
    ["শব্দ", ["৮৫ dB এর উপরে কানের সুরক্ষা। ১ মিটারে চিৎকার করে কথা বলতে হলে শব্দ বেশি।", "গ্রাইন্ডিং ও গাউজিং ১০০ dB এর বেশি।", "ইয়ারপ্লাগ ঠিকভাবে পরুন: পাকান, কান টানুন, ঢোকান।"], "আজকের কোন কাজে ডাবল কানের সুরক্ষা লাগবে?"],
    ["ক্লান্তি", ["ক্লান্ত মানুষ ভুল করে। আপনি বা সহকর্মী খুব ক্লান্ত হলে বলুন।", "গুরুত্বপূর্ণ কাজ শিফটের শুরুতে, শেষ ঘণ্টায় নয়।", "বিরতি নিন।"], "কেউ কি টানা ৭ম দিনে বা লম্বা ওভারটাইমে আছেন?"],
    ["কাজ থামানোর অধিকার", ["অনিরাপদ মনে হলে যে কেউ যে কোনো কাজ থামাতে পারেন।", "থামানোর জন্য কোনো দোষ নয়। কখনো নয়।", "থামুন, নিরাপদ করুন, কথা বলুন, ঠিক করুন, তারপর আবার শুরু করুন।"], "এখানে শেষ কবে কেউ কাজ থামিয়েছিল, আর কী হয়েছিল?"],
    ["নতুন ও তরুণ কর্মী", ["নতুন কর্মীরা একজন সঙ্গী ও কাছ থেকে তত্ত্বাবধান পান।", "শুধু কী নয়, কেন তাও বুঝিয়ে বলুন।", "তাদের দিয়ে আবার বলিয়ে বোঝাপড়া যাচাই করুন।"], "আজ ক্রুতে নতুন কে?"],
    ["সাইটে গাড়ি চালানো", ["গতিসীমা, সিট বেল্ট, ফোন নয়।", "পথচারীর অগ্রাধিকার। চোখে চোখ রাখুন।", "বড় গাড়ি পেছাতে স্পটার।"], "সাইটে কোথায় গাড়ি ও মানুষ পার হয়?"],
    ["হাতের টুল", ["সঠিক টুল ব্যবহার করুন। স্প্যানারে চিটার বার নয়।", "দেখুন: ফাটা হাতল, মাথা থেঁতলানো ছেনি, ক্ষয়ে যাওয়া চোয়াল।", "স্প্যানারে ঠেলবেন না, টানুন।"], "এই সপ্তাহে কোন নষ্ট টুল পাওয়া গেছে?"],
    ["বোল্টিং", ["লাইন ক্লাস অনুযায়ী সঠিক গ্যাসকেট ও বোল্ট।", "লুব্রিকেট করুন এবং পাসে পাসে ক্রস প্যাটার্ন মানুন।", "ক্যালিব্রেটেড টর্ক টুল, প্রতিটি জয়েন্ট রেকর্ড।"], "আজ কোন ফ্ল্যাঞ্জ জোড়া হচ্ছে, আর টর্ক কত?"],
    ["জরুরি সাড়া", ["অ্যালার্মের শব্দ ও মাস্টার পয়েন্ট জানুন।", "গ্যাস অ্যালার্মে বাতাসের দিক দেখুন।", "ফোরম্যান হেডকাউন্ট করেন।"], "আজকের মাস্টার পয়েন্ট ও সবচেয়ে কাছের আই-ওয়াশ কোথায়?"],
  ];
  const talks = BN ? talksBn : talksEn;
  const dayIndex = Math.floor(Date.now() / 86400000);
  let talkI = dayIndex % talks.length;
  function renderTalk() {
    const t = talks[talkI];
    $("#talkDay").textContent = talkI === dayIndex % talks.length ? T.today : T.topic(talkI + 1, talks.length);
    $("#talkTitle").textContent = t[0];
    $("#talkPoints").innerHTML = t[1].map(x => "<li>" + esc(x) + "</li>").join("");
    $("#talkQ").textContent = T.ask + t[2];
  }
  $("#nextTalk").addEventListener("click", () => { talkI = (talkI + 1) % talks.length; renderTalk(); buildReport(); });
  $("#prevTalk").addEventListener("click", () => { talkI = (talkI - 1 + talks.length) % talks.length; renderTalk(); buildReport(); });

  /* ---------- report ---------- */
  const rIds = ["r-name", "r-shift", "r-crew", "r-area", "r-delay", "r-next", "r-safe"];
  const saved = store.get("fh-report2", null);
  if (saved) rIds.forEach(id => { if (saved[id] != null) $("#" + id).value = saved[id]; });
  function buildReport() {
    const v = {}; rIds.forEach(id => v[id] = $("#" + id).value.trim());
    store.set("fh-report2", v);
    const open = []; let total = 0;
    allSections().forEach((s, si) => s.items.forEach((it, ii) => { total++; if (!checks[(s.mine ? "m" : si) + "-" + ii]) open.push(it); }));
    const group = st => jobs.filter(j => j.job && j.status === st);
    const line = j => "- " + j.job + (j.crew ? " (" + j.crew + ")" : "") + (j.permit ? " [" + j.permit + "]" : "");
    const sect = (title, list) => list.length ? "\n" + title + "\n" + list.map(line).join("\n") + "\n" : "";
    const done = group("Done"), prog = group("In progress");
    const blocked = jobs.filter(j => j.job && ["Waiting permit", "Waiting parts", "On hold"].includes(j.status));
    const notStarted = group("Not started");
    const txt =
      T.rTitle + "\n" +
      now.toLocaleDateString(LOC, { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + " · " + (T.shift[v["r-shift"]] || v["r-shift"]) + T.rShift + "\n" +
      T.rForeman + (v["r-name"] || "-") + "\n" + T.rArea + (v["r-area"] || "-") + "\n" + T.rCrew + (v["r-crew"] || "-") + "\n" + T.rTalk + talks[talkI][0] + "\n" +
      sect(T.rDone, done) + sect(T.rProg, prog) +
      (blocked.length ? "\n" + T.rBlocked + "\n" + blocked.map(j => line(j) + " – " + stLabel(j.status)).join("\n") + "\n" : "") +
      sect(T.rNot, notStarted) +
      "\n" + T.rDelay + "\n" + (v["r-delay"] || T.rNone) + "\n" +
      "\n" + T.rNext + "\n" + (v["r-next"] || "-") + "\n" +
      "\n" + T.rSafe + "\n" + (v["r-safe"] || "-") + "\n" +
      "\n" + T.rCheck(total - open.length, total) + (open.length ? "\n" + T.rOpen + "\n- " + open.join("\n- ") : "");
    $("#report").textContent = txt;
  }
  rIds.forEach(id => $("#" + id).addEventListener("input", buildReport));
  $("#copyReport").addEventListener("click", () => {
    const txt = $("#report").textContent;
    const ok = () => { $("#copyMsg").textContent = T.copied; setTimeout(() => $("#copyMsg").textContent = "", 2000); };
    const fallback = () => { const r = document.createRange(); r.selectNodeContents($("#report")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); $("#copyMsg").textContent = T.selected; };
    try { navigator.clipboard.writeText(txt).then(ok, fallback); } catch (e) { fallback(); }
  });

  renderChecks(); renderJobs(); renderTalk(); buildReport();
})();
