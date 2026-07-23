# ویراستار فارسی — Persian Virastar

ابزار تحت وب برای ویراستاری، نرمال‌سازی، پاکسازی و اصلاح نگارشی متون فارسی.

**آدرس:** [virastar.nounproject.ir](https://virastar.nounproject.ir)

---

## قابلیت‌ها

- اصلاح خودکار نیم‌فاصله‌های فارسی (پیشوندها و پسوندها)
- تصحیح فاصله‌گذاری علائم نگارشی (نقطه، کاما، گیومه، پرانتز و...)
- نرمال‌سازی اعداد (انگلیسی/عربی به فارسی) و حروف عربی (کاف و یای عربی)
- تحلیل متن: تعداد کلمات، جملات، پاراگراف‌ها، زمان مطالعه و شاخص خوانایی فارسی
- مقایسه‌گر زنده تغییرات (Diff Viewer)
- ویرایشگر دوپنله با قابلیت تنظیم اندازه
- ذخیره و بازیابی تاریخچه (۱۰ مورد آخر)
- اشتراک‌گذاری رمزگذاری‌شده با رمز عبور و تاریخ انقضا
- بارگذاری فایل متنی و خروجی با فرمت‌های TXT، MD، DOC، HTML
- پروفایل‌های تنظیمات: پیش‌فرض، حداکثری، ادبی، دانشگاهی، مینیمال
- پوسته تیره و روشن
- ذخیره تنظیمات در مرورگر

---

## تکنولوژی‌ها

| لایه | فناوری |
|------|--------|
| فرانت‌اند | React 19 + TypeScript |
| ساخت | Vite 6 |
| استایل | Tailwind CSS 4 |
| آیکون | Lucide React |
| نمودار | Recharts |
| بک‌اند | Express 4 |
| انیمیشن | Motion |

---

## نصب و اجرا

```bash
npm install
npm run dev
```

برای ساخت نسخه نهایی:

```bash
npm run build
npm start
```

---

## ساختار پروژه

```
src/
├── components/     # کامپوننت‌های React
│   ├── Header.tsx
│   ├── VirastarEditor.tsx
│   ├── StatsChartWidget.tsx
│   ├── DiffViewer.tsx
│   ├── OptionsPanel.tsx
│   ├── HistoryDrawer.tsx
│   ├── ShareModal.tsx
│   ├── SampleTextModal.tsx
│   ├── ShortcutsModal.tsx
│   └── Toast.tsx
├── lib/
│   └── virastarEngine.ts   # موتور پردازش متن
├── data/
│   └── sampleTexts.ts
├── types.ts
├── main.tsx
└── index.css
server.ts           # سرور Express
```

---

## توسعه‌دهنده

**حمیدرضا درهمی** — [derhami.com](https://derhami.com)

© ویراستار فارسی
