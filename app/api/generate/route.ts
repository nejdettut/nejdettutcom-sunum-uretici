import "server-only";
import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { rateLimit } from "@/lib/rate-limit";
import {
  AUDIENCE_LABELS,
  DeckRequestSchema,
  DeckSchema,
} from "@/lib/deck-schema";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const limited = await rateLimit({
    action: "sunum-uret",
    windowMs: 60 * 60 * 1000,
    max: 12,
  });
  if (!limited.ok) {
    return json(
      {
        error:
          "Saatte en fazla 12 sunum üretebilirsin. Lütfen biraz sonra tekrar dene.",
      },
      429,
    );
  }

  let body;
  try {
    body = DeckRequestSchema.parse(await req.json());
  } catch {
    return json({ error: "Geçersiz istek gövdesi." }, 400);
  }

  const target = Number.parseInt(body.slideCount, 10);
  const system = [
    "Sen deneyimli bir sunum tasarımcısı ve konu uzmanısın.",
    `Hedef kitle: ${AUDIENCE_LABELS[body.audience]}. Dil seviyesini kitleye göre ayarla.`,
    `Toplam slayt sayısı: ${target} (başlık slaytı dahil değil — ek olarak oluştur).`,
    "Her slaytta 1-6 arası madde (bullet) olsun; her madde 1-2 kısa cümle, teknik terimleri tanımla.",
    "Konuşmacı notu her slayt için 2-4 cümle; mikrofonda okunabilir, doğal akıcılıkta.",
    "Akış: Giriş → 2-3 ana kavram → örnek/uygulama → özet → kaynak önerisi.",
    "Türkçe. Emoji + görsel tasvir metinde yok (slayt üzerinde ikon zaten var).",
    "İçerik eğitim amaçlıdır; 'kesin', 'tek doğru' iddiaları yerine 'genelde', 'yaygın olarak' gibi ifadeler kullan.",
    body.notes ? `Ek notlar: ${body.notes}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  const prompt = `Konu: ${body.topic}\n\n${target}-slayt bir sunum üret. JSON şemasına uygun döndür. Title + subtitle üst başlık slaytı için; slides dizisinde ${target} içerik slaytı olsun.`;

  try {
    const { object } = await generateObject({
      model: groq("openai/gpt-oss-120b"),
      schema: DeckSchema,
      system,
      prompt,
      temperature: 0.4,
    });
    return json(object);
  } catch (err) {
    console.error("[sunum] failed:", err);
    return json(
      { error: "Sunum üretilemedi. Lütfen biraz sonra tekrar dene." },
      502,
    );
  }
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
