import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "5mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "Virastar Persian Text Editor API" });
  });

  // AI Editing endpoint via Gemini API
  app.post("/api/ai-edit", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "کلید API برای مدل هوش مصنوعی پیکربندی نشده است."
        });
      }

      const { text, mode, targetTone, customPrompt } = req.body;

      if (!text || typeof text !== "string" || text.trim() === "") {
        return res.status(400).json({ error: "متن ورودی خالی است." });
      }

      const ai = new GoogleGenAI({ apiKey });

      let systemInstruction = `شما یک ویراستار و متخصص زبان و ادبیات فارسی بسیار زبده هستید.
وظیفه شما ویرایش، بازنویسی و اصلاح متون فارسی طبق اصول نگارش استاندارد دستور خط فرهنگستان و نگارش معاصر فارسی است.
قواعد کلیدی:
1. استفاده درست از نیم‌فاصله (مثلاً 'می‌شود'، 'آن‌ها'، 'کتاب‌ها').
2. اصلاح تمام غلط‌های املایی، نگارشی و علائم نشانه‌گذاری (نقطه، کاما، علامت سؤال، گیومه فارسی «»).
3. تبدیل اعداد به فارسی و اصلاح حروف عربی (ک و ی) به فارسی.
4. حفظ معنا و مفهوم اصلی متن مگر آنکه کاربر تغییر لحن خاصی خواسته باشد.
5. خروجی شما باید فقط و فقط متن ویرایش شده باشد (بدون توضیحات اضافی، مگر اینکه توضیحات خواسته شده باشد).`;

      let prompt = "";

      switch (mode) {
        case "proofread":
          prompt = `لطفاً متن زیر را از نظر املایی، دستور زبانی، نگارشی و علائم ویرایشی کاملاً اصلاح کنید:\n\n${text}`;
          break;
        case "tone":
          prompt = `لطفاً متن زیر را به لحن ${targetTone || "رسمی و اداری"} تغییر دهید و تمام اشکالات نگارشی و املایی آن را برطرف کنید:\n\n${text}`;
          break;
        case "summarize":
          prompt = `لطفاً متن زیر را خلاصه، روان و تیتروار ویرایش و خلاصه‌سازی کنید:\n\n${text}`;
          break;
        case "simplify":
          prompt = `لطفاً متن زیر را به زبانی بسیار ساده، روان و قابل فهم برای عموم بازنویسی کنید:\n\n${text}`;
          break;
        case "custom":
          prompt = `دستور کاربر: ${customPrompt || "ویرایش دقیق متن"}\n\nمتن ورودی:\n${text}`;
          break;
        default:
          prompt = `لطفاً متن زیر را ویرایش و اصلاح دقیق نگارشی کنید:\n\n${text}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.3,
        }
      });

      const resultText = response.text || "";
      return res.json({ result: resultText.trim() });
    } catch (err: any) {
      console.error("Gemini API Error:", err);
      return res.status(500).json({
        error: "خطا در پردازش هوش مصنوعی: " + (err.message || "خطای ناشناخته")
      });
    }
  });

  // Vite development mode integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
