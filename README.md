# Mechanical Handbook · মেকানিক্যাল হ্যান্ডবুক

Static site (English + বাংলা), live at https://ekemran9-pixel.github.io/foreman-handbook/ (GitHub Pages; every push to `main` publishes automatically)

## আপডেট করার নিয়ম

- যেকোনো HTML/CSS/JS ফাইল বদলে `main` ব্রাঞ্চে push করুন, Netlify নিজে থেকে সাইট আপডেট করবে। কোনো build লাগে না।
- ইংরেজি পাতা রুটে, বাংলা পাতা `bn/` ফোল্ডারে।
- ক্যালকুলেটর: হিসাব `assets/tools.js` (EN) ও `assets/tools-bn.js` (BN); ছবি/অ্যানিমেশন ও পাতার UI `assets/tools-ui.js` (দুই ভাষাতেই একই); স্টাইল `assets/style.css`।
- নতুন ক্যালকুলেটরে ছবি দিতে `tools-ui.js` এর `VIZ` এ ক্যালকুলেটরের `id` নামে একটা ফাংশন যোগ করুন।
- **যেকোনো পরিবর্তনের পর** চালান: `python3 scripts/update.py` — এটা নিজে থেকে ভার্সন নম্বর বাড়ায়, অফলাইন কপির তালিকা (`sw.js`), `sitemap.xml` ও WhatsApp/Facebook শেয়ার-প্রিভিউ ঠিক করে। তারপর commit ও push।
- Netlify লিংক (সাইটের ঠিকানা) বদলালে `scripts/update.py`-এর শুরুতে `SITE` বদলে স্ক্রিপ্টটা একবার চালান।
- নিচের ডেভেলপার তথ্য প্রতিটা পাতার `<p class="dev">` লাইনে।
- বিষয়ের পাতার ছবি: `assets/figs.js`। নতুন পাতায় ছবি দিতে সেখানে পাতার পথ (যেমন `"rotary/gearboxes"`) নামে একটা ফাংশন যোগ করুন এবং সেই পাতার (ইংরেজি ও `bn/`) `search.js`-এর আগে `figs.js` স্ক্রিপ্ট লাইনটা দিন।

## সব সাইটের লিংক

সব সাইটের লিংক ও আপডেটের ইতিহাস এই Google Sheet-এ রাখা হয়: https://docs.google.com/spreadsheets/d/1Cou0UVFgeoXPAcPovWf_OsRJtxt80I92h2XGK97Ra0w/edit
প্রতিবার সাইট আপডেট হলে "আপডেটের ইতিহাস" ট্যাবে উপরে একটা নতুন সারি যোগ করুন, আর লিংক বদলালে "সাইট ও লিংক" ট্যাব ঠিক করুন।
