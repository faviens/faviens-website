/**
 * The logo as vector files: the same three compositions as the PNGs, laid out
 * in SVG with the wordmark outlined, so they scale to any size and need no font.
 *
 * `lockup.mjs` composes measured rasters because the rasteriser's font is not
 * known. Here it is: `outline.mjs` sets the wordmark in Archivo itself and
 * reports where the ink lands, so the layout is computed directly from the same
 * ratios instead of being measured after the fact.
 */
import { GAP_RATIO, STACK_GAP_RATIO, STACK_WORD_RATIO } from './lockup.mjs';
import { outlineText } from './outline.mjs';

/** The globe group from `template.mjs` is normalised into this box. */
const GLOBE_BOX = 100;

const fixed = (n) => Number(n.toFixed(3));

/** The children of a resolved SVG, without its comment or root element. */
function body(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^\s*<svg\b[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '')
    .trim();
}

/** The wordmark's ink box: the outlined runs plus the bar. */
function inkBox(svg, boxes) {
  const rects = [...svg.matchAll(/<rect\b([^>]*)\/>/g)].map(([, attrs]) => {
    const get = (name) => Number(attrs.match(new RegExp(`\\b${name}="([^"]+)"`))[1]);
    return {
      minX: get('x'),
      minY: get('y'),
      maxX: get('x') + get('width'),
      maxY: get('y') + get('height'),
    };
  });
  const all = [...boxes, ...rects];
  const minX = Math.min(...all.map((b) => b.minX));
  const minY = Math.min(...all.map((b) => b.minY));
  return {
    x: minX,
    y: minY,
    width: Math.max(...all.map((b) => b.maxX)) - minX,
    height: Math.max(...all.map((b) => b.maxY)) - minY,
  };
}

/** The wordmark, outlined and moved so its ink starts at the origin. */
async function wordmarkPart(wordmark) {
  const { svg, boxes } = await outlineText(wordmark);
  const ink = inkBox(svg, boxes);
  return {
    content: `<g transform="translate(${fixed(-ink.x)} ${fixed(-ink.y)})">${body(svg)}</g>`,
    width: ink.width,
    height: ink.height,
  };
}

const place = (content, x, y, scale = 1) =>
  `<g transform="translate(${fixed(x)} ${fixed(y)}) scale(${fixed(scale)})">${content}</g>`;

/** Wraps a composition in its own file, padded by `margin` of its shorter side. */
function document({ content, width, height, margin, ground }) {
  const pad = Math.min(width, height) * margin;
  const box = [-pad, -pad, width + pad * 2, height + pad * 2].map(fixed);
  const fill = ground
    ? `<rect x="${box[0]}" y="${box[1]}" width="${box[2]}" height="${box[3]}" fill="${ground}"/>`
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box.join(' ')}" role="img" ` +
    `aria-label="Faviens"><title>Faviens</title>${fill}${content}</svg>\n`
  );
}

/**
 * @param {{ wordmark: string, mark: string, lockup: 'horizontal' | 'stacked' | 'mark', margin: number, ground: string | null }} options
 *   resolved SVG sources, the composition, the padding as a share of the
 *   shorter side, and a hex ground or null for transparent
 * @returns {Promise<string>} the SVG file
 */
export async function vectorLockup({ wordmark, mark, lockup, margin, ground }) {
  const globe = body(mark);

  if (lockup === 'mark') {
    return document({ content: globe, width: GLOBE_BOX, height: GLOBE_BOX, margin, ground });
  }

  const word = await wordmarkPart(wordmark);

  if (lockup === 'horizontal') {
    // The circle is as wide as the wordmark is tall, and centred on it.
    const size = word.height;
    const gap = GAP_RATIO * size;
    const content = place(globe, 0, 0, size / GLOBE_BOX) + place(word.content, size + gap, 0);
    return document({ content, width: size + gap + word.width, height: size, margin, ground });
  }

  // Stacked: the wordmark is a set share of the circle's width, centred under it.
  const size = word.width / STACK_WORD_RATIO;
  const gap = STACK_GAP_RATIO * size;
  const content =
    place(globe, 0, 0, size / GLOBE_BOX) + place(word.content, (size - word.width) / 2, size + gap);
  return document({ content, width: size, height: size + gap + word.height, margin, ground });
}
