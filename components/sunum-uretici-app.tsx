"use client";

import { useState } from "react";
import {
  AlertCircle,
  Download,
  Layers,
  Loader2,
  Presentation,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Audience =
  | "cocuk-ilkokul"
  | "ortaokul"
  | "lise"
  | "universite"
  | "ogretmen"
  | "profesyonel"
  | "genel";

type Theme = "navy" | "warm" | "pastel" | "dark";
type SlideCount = "5" | "7" | "10" | "12";

type Deck = {
  title: string;
  subtitle: string;
  slides: {
    heading: string;
    bullets: string[];
    speakerNote: string;
  }[];
};

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "cocuk-ilkokul", label: "Çocuk (ilkokul)" },
  { value: "ortaokul", label: "Ortaokul" },
  { value: "lise", label: "Lise" },
  { value: "universite", label: "Üniversite" },
  { value: "ogretmen", label: "Öğretmen / eğitmen" },
  { value: "profesyonel", label: "Profesyonel" },
  { value: "genel", label: "Genel kitle" },
];

const THEMES: {
  value: Theme;
  label: string;
  bg: string;
  text: string;
  accent: string;
}[] = [
  { value: "navy", label: "Klasik Lacivert", bg: "bg-white", text: "text-[#1E3A8A]", accent: "bg-[#06B6D4]" },
  { value: "warm", label: "Sıcak Toprak", bg: "bg-[#FDF6EC]", text: "text-[#92400E]", accent: "bg-[#EA580C]" },
  { value: "pastel", label: "Pastel Yumuşak", bg: "bg-[#F5F3FF]", text: "text-[#6D28D9]", accent: "bg-[#EC4899]" },
  { value: "dark", label: "Koyu Profesyonel", bg: "bg-[#0F172A]", text: "text-[#F8FAFC]", accent: "bg-[#06B6D4]" },
];

const SLIDE_COUNTS: { value: SlideCount; label: string }[] = [
  { value: "5", label: "5 slayt (kısa)" },
  { value: "7", label: "7 slayt (standart)" },
  { value: "10", label: "10 slayt (detaylı)" },
  { value: "12", label: "12 slayt (geniş)" },
];

const EXAMPLES = [
  "Fotosentez: Bitkiler güneş ışığından nasıl besin üretir?",
  "Yapay zekâ nedir? Günlük hayattaki örnekleri",
  "İklim değişikliği ve karbon ayak izi",
  "Python ile ilk adım: değişkenler ve fonksiyonlar",
];

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-1.5 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-navy/90 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-purple dark:text-white";

const BTN_OUTLINE =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white/70 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm backdrop-blur transition hover:bg-slate-50 hover:shadow disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:bg-slate-900";

const CARD =
  "rounded-2xl border border-slate-200 bg-white/80 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/60";

const MUTED_TEXT = "text-slate-500 dark:text-slate-400";

export function SunumUreticiApp() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<Audience>("ortaokul");
  const [slideCount, setSlideCount] = useState<SlideCount>("7");
  const [theme, setTheme] = useState<Theme>("navy");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);

  async function run() {
    if (topic.trim().length < 3) {
      setError("Konu en az 3 karakter olmalı.");
      return;
    }
    setLoading(true);
    setError(null);
    setDeck(null);
    try {
      const r = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, audience, slideCount, theme, notes }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error ?? "Bilinmeyen hata.");
      else setDeck(data as Deck);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ağ hatası.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadPptx() {
    if (!deck) return;
    setExporting(true);
    setError(null);
    try {
      const { buildPptxBlob } = await import("@/lib/pptx");
      const blob = await buildPptxBlob(deck, theme);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const slug = topic
        .replace(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ _-]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
        .slice(0, 40) || "sunum";
      a.download = `${slug}.pptx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "İndirme hatası.");
    } finally {
      setExporting(false);
    }
  }

  const activeTheme = THEMES.find((t) => t.value === theme) ?? THEMES[0];

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Input column */}
      <div className="space-y-4 lg:col-span-2">
        <div className={CARD}>
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
              <Presentation className="size-4 text-brand-purple" />
              Sunum bilgisi
            </h2>
          </div>
          <div className="space-y-4 p-5">
            <div>
              <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                Konu
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="örn: Fotosentez, Yapay zekâ, İklim değişikliği…"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                  Hedef kitle
                </label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Audience)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {AUDIENCES.map((a) => (
                    <option key={a.value} value={a.value}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                  Slayt sayısı
                </label>
                <select
                  value={slideCount}
                  onChange={(e) => setSlideCount(e.target.value as SlideCount)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  {SLIDE_COUNTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                Tema
              </label>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-xs font-medium transition",
                      theme === t.value
                        ? "border-brand-purple ring-2 ring-brand-purple/30"
                        : "border-slate-300 dark:border-slate-700",
                    )}
                  >
                    <span className="mb-1 flex items-center gap-1.5">
                      <span className={cn("block size-3 rounded-full", t.accent)} />
                      <span className={cn("flex-1 text-left", t.bg === "bg-[#0F172A]" ? "text-slate-100" : "text-slate-900")}>
                        {t.label}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={cn("mb-1.5 block text-xs font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                Ek notlar (opsiyonel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="örn: Özellikle öğrencilere yönelik; örneklerle; 10-15 dakikalık konuşma"
                className="block h-20 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-xs leading-relaxed dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={run}
                disabled={loading || topic.length < 3}
                className={BTN_PRIMARY}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Sunum üretiliyor…
                  </>
                ) : (
                  <>
                    <Sparkles className="size-3.5" />
                    Sunumu üret
                  </>
                )}
              </button>
            </div>

            <div>
              <p className={cn("mb-2 text-[11px] uppercase tracking-wider", MUTED_TEXT)}>
                Hızlı örnekler
              </p>
              <div className="flex flex-wrap gap-1.5">
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setTopic(ex)}
                    className="rounded-full border border-slate-300 bg-white/50 px-2.5 py-1 text-[11px] text-slate-700 transition hover:border-brand-purple hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 dark:hover:text-slate-100"
                  >
                    {ex.slice(0, 32)}…
                  </button>
                ))}
              </div>
            </div>

            <p className={cn("text-[11px]", MUTED_TEXT)}>
              Saatte 12 sunum sınırı. Üretim 10-30 saniye sürer.
            </p>
          </div>
        </div>
      </div>

      {/* Output column */}
      <div className="space-y-4 lg:col-span-3">
        {error ? (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-900 dark:border-red-400/30 dark:bg-red-400/10 dark:text-red-200"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {!deck && !loading && !error ? (
          <div
            className={cn(
              CARD,
              "flex flex-col items-center gap-3 border-dashed py-14 text-center",
            )}
          >
            <Layers className="size-10 text-brand-purple" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">
              Sunum iskeletin burada görünecek
            </h3>
            <p className={cn("max-w-sm text-sm", MUTED_TEXT)}>
              Konu, kitle, slayt sayısı ve tema seç, &quot;Sunumu üret&quot;e
              bas. Her slayt başlık, 1-6 madde ve konuşmacı notu ile gelir;
              PowerPoint (.pptx) olarak indirilir.
            </p>
          </div>
        ) : null}

        {loading ? (
          <div
            className={cn(
              CARD,
              "flex flex-col items-center gap-3 py-14 text-center",
            )}
          >
            <Loader2 className="size-10 animate-spin text-brand-purple" />
            <p className={cn("text-sm", MUTED_TEXT)}>
              Sunum hazırlanıyor… 10-30 saniye.
            </p>
          </div>
        ) : null}

        {deck ? (
          <>
            <div className={cn(CARD, "px-5 py-5")}>
              <p className={cn("text-[11px] font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                Başlık slaytı
              </p>
              <div
                className={cn(
                  "mt-2 overflow-hidden rounded-lg border p-6",
                  activeTheme.bg,
                  activeTheme.bg === "bg-[#0F172A]" ? "border-slate-700" : "border-slate-200",
                )}
              >
                <div className={cn("mb-2 h-1 w-full rounded", activeTheme.accent)} />
                <p className={cn("text-2xl font-bold", activeTheme.text)}>
                  {deck.title}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm",
                    activeTheme.bg === "bg-[#0F172A]" ? "text-slate-200" : "text-slate-700",
                  )}
                >
                  {deck.subtitle}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={downloadPptx}
                  disabled={exporting}
                  className={BTN_PRIMARY}
                >
                  {exporting ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      .pptx hazırlanıyor…
                    </>
                  ) : (
                    <>
                      <Download className="size-3.5" />
                      PowerPoint (.pptx) olarak indir
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className={BTN_OUTLINE}
                >
                  Yazdır / PDF
                </button>
              </div>
            </div>

            {deck.slides.map((slide, i) => (
              <div key={i} className={cn(CARD, "px-5 py-5")}>
                <p className={cn("text-[11px] font-semibold uppercase tracking-wider", MUTED_TEXT)}>
                  Slayt {i + 1} / {deck.slides.length}
                </p>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                  {slide.heading}
                </h3>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                  {slide.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
                <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-950/40">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-brand-purple">
                    Konuşmacı notu
                  </p>
                  <p className={cn("text-xs leading-relaxed italic", MUTED_TEXT)}>
                    {slide.speakerNote}
                  </p>
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}
