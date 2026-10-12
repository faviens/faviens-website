/**
 * Turns the `<text>` runs of a resolved SVG into outlined `<path>`s set in
 * Archivo itself.
 *
 * The rasteriser resolves whatever face the machine has installed, so a
 * wordmark left as text is drawn in Archivo on one laptop and in a fallback on
 * the next, and an SVG handed to anyone else depends on their fonts too. Laying
 * the glyphs out here, from the font file the site already ships, makes every
 * output the same drawing everywhere.
 *
 * Handles plain runs only: `x`, `y`, `text-anchor`, `font-size`, `font-weight`,
 * `letter-spacing` and `fill`, with no `<tspan>` inside. It throws on anything
 * else rather than drawing it wrong.
 *
 * Two workarounds, both for fontkit with a variable WOFF2:
 *   - The WOFF2 is decompressed to TrueType first. fontkit reads a WOFF2's
 *     outlines without applying the weight axis, so every weight comes back as
 *     the default 600.
 *   - `letter-spacing` is applied between glyphs and not after the last one.
 *     The template's bar is placed against FAV's advance edge, and a trailing
 *     space would move FAV away from it.
 */
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

const require = createRequire(import.meta.url);

/** The upright Latin subset, with the weight axis. Archivo's only other axis,
 *  width, is not used on the site. */
export const FONT_FILE =
  require.resolve('@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2');

const TEXT_RUN = /<text\b([^>]*)>([^<]*)<\/text>/g;

/** Coordinates to this many decimals: well under a pixel at any output size. */
const PRECISION = 2;

let base;

async function archivo(weight) {
  base ??= fontkit.create(Buffer.from(await wawoff2.decompress(await readFile(FONT_FILE))));
  return base.getVariation({ wght: weight });
}

function attributes(source) {
  return Object.fromEntries(
    [...source.matchAll(/([a-z-:]+)="([^"]*)"/g)].map(([, name, value]) => [name, value]),
  );
}

const round = (d) => d.replace(/-?\d+\.\d+/g, (n) => String(Number(Number(n).toFixed(PRECISION))));

/** One run as a path, and the ink box it covers. */
async function outlineRun(attrs, content) {
  const size = Number(attrs['font-size']);
  const spacing = Number(attrs['letter-spacing'] ?? 0);
  const font = await archivo(Number(attrs['font-weight'] ?? 400));
  const scale = size / font.unitsPerEm;
  const { glyphs, positions } = font.layout(content);

  const advances = positions.map((position) => position.xAdvance * scale);
  const width = advances.reduce((sum, advance) => sum + advance, 0) + spacing * (glyphs.length - 1);
  const anchor = attrs['text-anchor'] ?? 'start';
  const offset = { start: 0, middle: width / 2, end: width }[anchor];
  if (offset === undefined) throw new Error(`text-anchor="${anchor}" is not supported`);

  const baseline = Number(attrs.y);
  let pen = Number(attrs.x) - offset;
  const parts = glyphs.map((glyph, i) => {
    const { xOffset, yOffset } = positions[i];
    const placed = glyph.path.transform(
      scale,
      0,
      0,
      -scale,
      pen + xOffset * scale,
      baseline - yOffset * scale,
    );
    pen += advances[i] + spacing;
    return placed;
  });

  const box = parts
    .map((path) => path.bbox)
    .reduce((a, b) => ({
      minX: Math.min(a.minX, b.minX),
      minY: Math.min(a.minY, b.minY),
      maxX: Math.max(a.maxX, b.maxX),
      maxY: Math.max(a.maxY, b.maxY),
    }));
  const d = round(parts.map((path) => path.toSVG()).join(''));
  return { path: `<path d="${d}" fill="${attrs.fill}"/>`, box };
}

/**
 * @param {string} svg a resolved SVG, colours already substituted
 * @returns {Promise<{ svg: string, boxes: { minX: number, minY: number, maxX: number, maxY: number }[] }>}
 *   the SVG with every run outlined, and each run's ink box in its own units
 */
export async function outlineText(svg) {
  if (/<text\b/.test(svg.replace(TEXT_RUN, ''))) {
    throw new Error('outlineText handles plain <text> runs only, and found one with children.');
  }
  const runs = await Promise.all(
    [...svg.matchAll(TEXT_RUN)].map(([, attrs, content]) => outlineRun(attributes(attrs), content)),
  );
  let index = 0;
  return {
    svg: svg.replace(TEXT_RUN, () => runs[index++].path),
    boxes: runs.map((run) => run.box),
  };
}
