// Live filter for the glossary page.
(function () {
  const f = document.getElementById("gfilter");
  if (!f) return;
  f.addEventListener("input", () => {
    const s = f.value.trim().toLowerCase();
    document.querySelectorAll(".gl").forEach(sec => {
      let any = false;
      sec.querySelectorAll(".gi").forEach(gi => {
        const show = !s || gi.textContent.toLowerCase().includes(s);
        gi.hidden = !show; if (show) any = true;
      });
      sec.hidden = !any;
    });
  });
})();
