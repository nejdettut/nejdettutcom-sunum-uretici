import { z } from "zod";

export const AUDIENCES = [
  "cocuk-ilkokul",
  "ortaokul",
  "lise",
  "universite",
  "ogretmen",
  "profesyonel",
  "genel",
] as const;

export const AUDIENCE_LABELS: Record<(typeof AUDIENCES)[number], string> = {
  "cocuk-ilkokul": "Çocuk (ilkokul)",
  ortaokul: "Ortaokul öğrencisi",
  lise: "Lise öğrencisi",
  universite: "Üniversite öğrencisi",
  ogretmen: "Öğretmen / eğitmen",
  profesyonel: "Profesyonel / iş dünyası",
  genel: "Genel kitle",
};

export const THEMES = ["navy", "warm", "pastel", "dark"] as const;

export const THEME_LABELS: Record<(typeof THEMES)[number], string> = {
  navy: "Klasik Lacivert",
  warm: "Sıcak Toprak",
  pastel: "Pastel Yumuşak",
  dark: "Koyu Profesyonel",
};

export const SLIDE_COUNTS = ["5", "7", "10", "12"] as const;

export const DeckRequestSchema = z.object({
  topic: z.string().min(3).max(200),
  audience: z.enum(AUDIENCES),
  slideCount: z.enum(SLIDE_COUNTS),
  theme: z.enum(THEMES),
  notes: z.string().max(400).optional(),
});

export const DeckSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  slides: z
    .array(
      z.object({
        heading: z.string(),
        bullets: z.array(z.string()).min(1).max(6),
        speakerNote: z.string(),
      }),
    )
    .min(3)
    .max(14),
});

export type Deck = z.infer<typeof DeckSchema>;
export type DeckRequest = z.infer<typeof DeckRequestSchema>;

export type ThemeKey = (typeof THEMES)[number];

export const THEMES_CONFIG: Record<
  ThemeKey,
  { background: string; title: string; heading: string; body: string; accent: string }
> = {
  navy: {
    background: "FFFFFF",
    title: "1E3A8A",
    heading: "1E3A8A",
    body: "0F172A",
    accent: "06B6D4",
  },
  warm: {
    background: "FDF6EC",
    title: "92400E",
    heading: "B45309",
    body: "1F2937",
    accent: "EA580C",
  },
  pastel: {
    background: "F5F3FF",
    title: "6D28D9",
    heading: "7C3AED",
    body: "1F2937",
    accent: "EC4899",
  },
  dark: {
    background: "0F172A",
    title: "F8FAFC",
    heading: "06B6D4",
    body: "E2E8F0",
    accent: "F59E0B",
  },
};
