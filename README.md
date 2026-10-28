# Mechanical Handbook · মেকানিক্যাল হ্যান্ডবুক

Static site (English + বাংলা), live at https://foreman-handbook.netlify.app

## আপডেট করার নিয়ম

- যেকোনো HTML/CSS/JS ফাইল বদলে `main` ব্রাঞ্চে push করুন, Netlify নিজে থেকে সাইট আপডেট করবে। কোনো build লাগে না।
- ইংরেজি পাতা রুটে, বাংলা পাতা `bn/` ফোল্ডারে।
- ক্যালকুলেটর: হিসাব `assets/tools.js` (EN) ও `assets/tools-bn.js` (BN); ছবি/অ্যানিমেশন ও পাতার UI `assets/tools-ui.js` (দুই ভাষাতেই একই); স্টাইল `assets/style.css`।
- নতুন ক্যালকুলেটরে ছবি দিতে `tools-ui.js` এর `VIZ` এ ক্যালকুলেটরের `id` নামে একটা ফাংশন যোগ করুন।
- CSS/JS বদলালে সব HTML-এ `?v=5` কে `?v=6` করে দিন (আর `assets/tools.js`, `assets/tools-bn.js`-এ `UI_VER`), যাতে ব্রাউজার পুরনো ফাইল না দেখায়।
- নিচের ডেভেলপার তথ্য প্রতিটা পাতার `<p class="dev">` লাইনে।
