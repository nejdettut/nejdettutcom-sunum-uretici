import type { Deck, ThemeKey } from "@/lib/deck-schema";
import { THEMES_CONFIG } from "@/lib/deck-schema";

type PptxShape = "rect";

type PptxTextOptions = {
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  bold?: boolean;
  color?: string;
  fontFace?: string;
  align?: "left" | "center" | "right";
  paraSpaceAfter?: number;
};

interface PptxSlide {
  background: { color: string };
  addShape(
    shape: PptxShape,
    opts: {
      x: number;
      y: number;
      w: number;
      h: number;
      fill: { color: string };
      line: { color: string; width: number };
    },
  ): void;
  addText(
    text: string | { text: string; options: { bullet: boolean } }[],
    opts: PptxTextOptions,
  ): void;
  addNotes(note: string): void;
}

interface PptxGen {
  layout: string;
  addSlide(): PptxSlide;
  write(opts: { outputType: "blob" }): Promise<Blob>;
}

export async function buildPptxBlob(
  deck: Deck,
  theme: ThemeKey,
): Promise<Blob> {
  const mod = await import("pptxgenjs");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Ctor = (mod.default ?? (mod as any)) as new () => PptxGen;
  const pptx = new Ctor();
  pptx.layout = "LAYOUT_WIDE";

  const palette = THEMES_CONFIG[theme];

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: palette.background };
  titleSlide.addShape("rect", {
    x: 0,
    y: 6.6,
    w: 13.33,
    h: 0.6,
    fill: { color: palette.accent },
    line: { color: palette.accent, width: 0 },
  });
  titleSlide.addText(deck.title, {
    x: 0.7,
    y: 2.4,
    w: 12,
    h: 1.5,
    fontSize: 44,
    bold: true,
    color: palette.title,
    fontFace: "Calibri",
  });
  titleSlide.addText(deck.subtitle, {
    x: 0.7,
    y: 4.1,
    w: 12,
    h: 1.2,
    fontSize: 20,
    color: palette.body,
    fontFace: "Calibri",
  });

  deck.slides.forEach((slide, idx) => {
    const s = pptx.addSlide();
    s.background = { color: palette.background };
    s.addShape("rect", {
      x: 0,
      y: 0,
      w: 0.25,
      h: 7.5,
      fill: { color: palette.accent },
      line: { color: palette.accent, width: 0 },
    });
    s.addText(slide.heading, {
      x: 0.7,
      y: 0.4,
      w: 12,
      h: 0.8,
      fontSize: 30,
      bold: true,
      color: palette.heading,
      fontFace: "Calibri",
    });
    s.addText(
      slide.bullets.map((b) => ({ text: b, options: { bullet: true } })),
      {
        x: 0.7,
        y: 1.4,
        w: 12,
        h: 5.6,
        fontSize: 20,
        color: palette.body,
        fontFace: "Calibri",
        paraSpaceAfter: 8,
      },
    );
    s.addText(`${idx + 1} / ${deck.slides.length}`, {
      x: 11.5,
      y: 7.0,
      w: 1.5,
      h: 0.3,
      fontSize: 10,
      align: "right",
      color: palette.body,
      fontFace: "Calibri",
    });
    s.addNotes(slide.speakerNote);
  });

  return pptx.write({ outputType: "blob" });
}
