/**
 * Off-site brand assets: the logo files uploaded to Google Workspace, LinkedIn
 * and anywhere else that asks for one. Reads the same palette and the same
 * letterforms as the site, so a profile picture cannot drift from the page it
 * points at.
 *
 * Not part of the site build. `generate-og.mjs` runs on predev and prebuild
 * because the browser fetches what it writes; nothing fetches these, so this
 * runs by hand, with `pnpm brand`, when a logo is actually needed.
 *
 * The logos go to `logos/`, which is tracked: it is the public logo, and a
 * copy anyone can download beats one that only exists on whichever laptop last
 * ran this. Regenerate them after changing a source SVG or the palette, and
 * commit the result with that change. The photo banners go there too, but
 * only regenerate when the photograph is supplied, since the repository does
 * not hold it.
 *
 * Sizes and the reasoning behind them are in TARGETS.
 */
import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { paletteFrom } from './tokens.mjs';
import { resolveSource } from './template.mjs';
import { fitInto, hexToRgb } from './tight-render.mjs';
import { horizontalLockup, lockupBlock, stackedLockup } from './lockup.mjs';
import { photoBanner } from './photo-banner.mjs';
import { globeGroup, strokeWeightFor } from '../src/lib/globe.mjs';
import { outlineText } from './outline.mjs';
import { vectorLockup } from './vector-lockup.mjs';
import { buildManifest, LOGOS_DIR as logosDir, MANIFEST } from './logo-manifest.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourceDir = join(__dirname, 'assets');
const stylesheet = join(__dirname, '..', 'src', 'styles', 'global.css');

const palette = paletteFrom(await readFile(stylesheet, 'utf8'));
const wordmarkText = await resolveSource(sourceDir, 'brand-wordmark.svg', palette);
// Outlined before rasterising, so the PNGs are set in Archivo on any machine
// rather than in whatever face the rasteriser finds installed.
const wordmark = (await outlineText(wordmarkText)).svg;
const mark = await resolveSource(sourceDir, 'brand-mark.svg', palette);
const descriptor = await resolveSource(sourceDir, 'descriptor.svg', palette);

/**
 * The mark with its strokes thickened so they hold up at `px` wide. At weight
 * 1 it is the template's own drawing; heavier only where the ball is small.
 */
function markFor(px, scale = 1) {
  const weight = strokeWeightFor(px, scale);
  if (weight === 1) return mark;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">` +
    `${globeGroup({ colour: palette.accent, weight })}</svg>`
  );
}

/**
 * `ground: null` leaves the PNG transparent. Workspace sets the logo on its own
 * white chrome, where a near-white tile would read as a grey rectangle, so that
 * one is transparent and carries no ground of its own. LinkedIn renders the
 * same avatar on a light card and on a dark one, so those keep the paper tile:
 * transparent there would leave ink letters invisible in dark mode.
 *
 * `margin` is the share of the shorter side left empty on each edge. Small on
 * purpose. The complaint that started this file was that the existing icons sit
 * in a field of dead space, which is what happens when a mark is centred in a
 * tile sized for something else instead of being measured and then padded.
 *
 * `lockup` picks the composition. `horizontal` is the logo, and it is what goes
 * anywhere wide. `stacked` exists for the square tiles: the horizontal lockup
 * is about six to one, so in a square frame it letterboxes to most of the tile
 * empty however small the margin is set. `mark` is the circle alone, which is
 * the right avatar wherever the name is already printed beside it.
 *
 * Only the Workspace logo is held to a destination's size, because Google
 * takes nothing larger. Everything else is rendered well above what any
 * platform displays, so the platform scales down from detail rather than up
 * from a tile that was only just big enough.
 */
const TARGETS = [
  {
    file: 'faviens-workspace-320x132.png',
    lockup: 'horizontal',
    width: 320,
    height: 132,
    ground: null,
    margin: 0.04,
    // Google caps this one at 30 KB and resizes anything that is not 320x132.
    maxBytes: 30 * 1024,
  },
  {
    // The same logo on paper, for wherever it is set on something that is not
    // white: a dark Workspace theme, a slide, an email signature.
    file: 'faviens-workspace-320x132-paper.png',
    lockup: 'horizontal',
    width: 320,
    height: 132,
    ground: 'paper',
    margin: 0.04,
    maxBytes: 30 * 1024,
  },
  {
    // 320x132 is all Google takes, and at that size the globe's lines are a
    // pixel wide, so it looks soft the moment anything zooms it. These are the
    // same composition at four times the pixels, for every other use.
    file: 'faviens-logo-1280x528.png',
    lockup: 'horizontal',
    width: 1280,
    height: 528,
    ground: null,
    margin: 0.04,
  },
  {
    file: 'faviens-logo-1280x528-paper.png',
    lockup: 'horizontal',
    width: 1280,
    height: 528,
    ground: 'paper',
    margin: 0.04,
  },
  {
    // The name under the circle, square, for avatars and print.
    file: 'faviens-logo-stacked-1600x1600.png',
    lockup: 'stacked',
    width: 1600,
    height: 1600,
    ground: null,
    margin: 0.09,
  },
  {
    file: 'faviens-logo-stacked-1600x1600-paper.png',
    lockup: 'stacked',
    width: 1600,
    height: 1600,
    ground: 'paper',
    margin: 0.09,
  },
  {
    // The circle alone, for any square avatar where the name is printed
    // beside it anyway. Large enough to scale down to any platform's tile.
    file: 'faviens-mark-1600x1600.png',
    lockup: 'mark',
    width: 1600,
    height: 1600,
    ground: null,
    margin: 0.08,
  },
  {
    file: 'faviens-mark-1600x1600-paper.png',
    lockup: 'mark',
    width: 1600,
    height: 1600,
    ground: 'paper',
    margin: 0.08,
  },
  /*
   * The flat banners at twice LinkedIn's published sizes, which LinkedIn
   * accepts and scales down, like the photo banners. Every measurement is the
   * 1x one doubled.
   */
  {
    file: 'faviens-cover-2256x382.png',
    banner: { blockHeight: 124, align: 'left', inset: 600, scale: 2 },
    width: 2256,
    height: 382,
    ground: 'paper',
  },
  {
    file: 'faviens-banner-3168x792.png',
    banner: { blockHeight: 208, align: 'right', inset: 240, scale: 2 },
    width: 3168,
    height: 792,
    ground: 'paper',
  },
];

/**
 * The vector logos. No size and no destination: these are the masters, for
 * print, slides and anything that asks for an SVG. Margins match the PNG
 * nearest in kind.
 */
const VECTOR_TARGETS = [
  { file: 'faviens-logo.svg', lockup: 'horizontal', ground: null, margin: 0.12 },
  { file: 'faviens-logo-paper.svg', lockup: 'horizontal', ground: 'paper', margin: 0.12 },
  { file: 'faviens-logo-stacked.svg', lockup: 'stacked', ground: null, margin: 0.09 },
  { file: 'faviens-logo-stacked-paper.svg', lockup: 'stacked', ground: 'paper', margin: 0.09 },
  { file: 'faviens-mark.svg', lockup: 'mark', ground: null, margin: 0.08 },
  { file: 'faviens-mark-paper.svg', lockup: 'mark', ground: 'paper', margin: 0.08 },
];

async function renderVector({ file, lockup, ground, margin }) {
  const svg = await vectorLockup({
    wordmark: wordmarkText,
    mark,
    lockup,
    margin,
    ground: ground ? palette[ground] : null,
  });
  await writeFile(join(logosDir, file), svg);
  console.log(`${file} generated (${lockup}, ${svg.length} bytes)`);
}

/**
 * A banner is placed, not fitted. The other targets centre a mark in a tile;
 * these have to keep clear of what LinkedIn draws on top of them, so the block
 * is anchored to one side with a stated inset instead.
 *
 * Company page cover, 1128x191: the square logo tile is overlaid at the bottom
 * LEFT, so the block starts to the right of it.
 *
 * Personal profile banner, 1584x396: the profile photo is overlaid at the
 * bottom left and the frame is cropped tighter on a phone, so the block is
 * anchored right and kept on the vertical centre line, which survives both.
 *
 * Both sizes are LinkedIn's published ones. They have been stable for years but
 * they are LinkedIn's to change, so check them before a re-upload matters.
 */
async function renderBanner({ width, height, ground, banner }) {
  const block = await lockupBlock({
    wordmark,
    mark: markFor(banner.blockHeight, banner.scale),
    descriptor,
    height: banner.blockHeight,
    // A quarter of the lockup's height, which is the same ratio the link
    // preview uses, so the line sits the same distance under the mark
    // everywhere it appears.
    gap: Math.round(banner.blockHeight * 0.23),
  });
  const left = banner.align === 'right' ? width - banner.inset - block.width : banner.inset;

  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { ...hexToRgb(palette[ground]), alpha: 1 },
    },
  })
    .composite([{ input: block.data, left, top: Math.round((height - block.height) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/** The composed artwork, cropped to its ink, before any ground or margin. */
async function compose(lockup, mark) {
  if (lockup === 'mark') {
    return sharp(Buffer.from(mark), { density: 1200 }).trim({ threshold: 1 }).png().toBuffer();
  }
  // A generous working size: the parts are measured and composed here, then
  // scaled once into the destination's box, so this only has to be larger than
  // any target rather than equal to one.
  const build =
    lockup === 'stacked'
      ? await stackedLockup({ wordmark, mark, width: 1200 })
      : await horizontalLockup({ wordmark, mark, height: 400 });
  return build.data;
}

/**
 * How wide the ball comes out in a fitted target, in pixels: the composition is
 * drawn once at the logo's own weight and its fit into the margin box measured.
 */
async function ballSize({ lockup, width, height, margin }) {
  const art = await sharp(await compose(lockup, mark)).metadata();
  const inset = Math.round(Math.min(width, height) * margin);
  const scale = Math.min((width - inset * 2) / art.width, (height - inset * 2) / art.height);
  // The horizontal lockup is as tall as the ball; the other two are as wide.
  return (lockup === 'horizontal' ? art.height : art.width) * scale;
}

/** Renders one target and enforces whatever size cap the destination imposes. */
async function renderTarget(target) {
  const { file, lockup, width, height, ground, margin, maxBytes, banner } = target;
  const png = banner
    ? await renderBanner(target)
    : await fitInto(await compose(lockup, markFor(await ballSize(target))), {
        width,
        height,
        ground: ground ? palette[ground] : null,
        margin,
      });

  await writeFile(join(logosDir, file), png);

  if (maxBytes && png.byteLength > maxBytes) {
    throw new Error(
      `${file} is ${png.byteLength} bytes, over the ${maxBytes} the destination accepts.`,
    );
  }
  console.log(
    `${file} generated (${lockup ?? 'banner'}, ${width}x${height}, ${png.byteLength} bytes)`,
  );
}

/**
 * Removes outputs this script no longer produces.
 *
 * A target dropped from the list would otherwise leave its last render sitting
 * there indefinitely, with nothing to show it is stale. That is how an avatar
 * carrying the previous identity survived the switch to the new one and was
 * still there to be uploaded. In `logos/` the removal shows up in `git status`,
 * so it is committed along with the change that dropped the target.
 *
 * Scoped to the `faviens-*` names this script writes, and it says what it
 * removed, so anything else left in the directory by hand is untouched.
 *
 * Photo banners are never removed. They cannot be regenerated without the
 * photograph, which may not be on the machine running this, so deleting an old
 * one is a decision for a person and a commit, not for a script.
 */
async function pruneStale(dir, current) {
  const existing = await readdir(dir).catch(() => []);
  for (const file of existing) {
    if (!/^faviens-.*\.(png|svg)$/.test(file) || /^faviens-photo-/.test(file)) continue;
    if (current.has(file)) continue;
    await unlink(join(dir, file));
    console.log(`${file} removed (no longer a target)`);
  }
}

/*
 * The photo banners, rendered only when a photograph is pointed at.
 *
 *   FAVIENS_PHOTO=~/pictures/alps.jpg pnpm brand
 *
 * The source image is not in the repository and should not be: it is a binary,
 * and this one is several megabytes. Naming it on the command line keeps it
 * wherever the maintainer actually keeps photographs, and means these targets
 * simply do not run when there is nothing to run them on.
 *
 * `horizon` is where the skyline sits in the photo and has to be measured for
 * each one, by eye or by looking for the row where variance jumps. `horizonAt`
 * is where it should sit in the output. Stated that way, one setting composes
 * the 4:1 banner and the 5.9:1 cover identically; a fixed crop does not, and
 * loses the subject entirely from the narrower of the two.
 */
const PHOTO = process.env.FAVIENS_PHOTO;
/*
 * Both at twice LinkedIn's published size, which LinkedIn accepts and scales
 * down. At 1x the ball is 104px on the banner and 62px on the cover, too small
 * for its strands to survive a high-density screen. No 1x copy is kept: the
 * destination does the downscale, and does it from more detail.
 */
const PHOTO_SCALE = 2;
const PHOTO_TARGETS = [
  {
    file: 'faviens-photo-banner-3168x792.png',
    width: 1584,
    height: 396,
    blockHeight: 104,
    inset: 110,
  },
  {
    file: 'faviens-photo-cover-2256x382.png',
    width: 1128,
    height: 191,
    blockHeight: 62,
    inset: 80,
  },
];
const PHOTO_SETTINGS = {
  treatment: process.env.FAVIENS_PHOTO_TREATMENT ?? 'light',
  horizon: Number(process.env.FAVIENS_PHOTO_HORIZON ?? 0.7),
  horizonAt: Number(process.env.FAVIENS_PHOTO_HORIZON_AT ?? 0.62),
};

async function renderPhotoTargets() {
  if (!PHOTO) {
    console.log('FAVIENS_PHOTO not set, skipping the photo banners');
    return;
  }
  for (const { file, width, height, blockHeight, inset } of PHOTO_TARGETS) {
    const r = await photoBanner({
      photo: PHOTO,
      align: 'right',
      ...PHOTO_SETTINGS,
      width: width * PHOTO_SCALE,
      height: height * PHOTO_SCALE,
      blockHeight: blockHeight * PHOTO_SCALE,
      inset: inset * PHOTO_SCALE,
      scale: PHOTO_SCALE,
    });
    await writeFile(join(logosDir, file), r.data);
    console.log(
      `${file} generated (${width * PHOTO_SCALE}x${height * PHOTO_SCALE}, veil ${(r.alpha * 100).toFixed(0)}%, ` +
        `letters ${r.letters.toFixed(1)}:1, accent ${r.accent.toFixed(1)}:1, ${r.data.length} bytes)`,
    );
  }
}

await mkdir(logosDir, { recursive: true });
await pruneStale(logosDir, new Set([...TARGETS, ...VECTOR_TARGETS].map((target) => target.file)));
for (const target of TARGETS) {
  await renderTarget(target);
}
for (const target of VECTOR_TARGETS) {
  await renderVector(target);
}
await renderPhotoTargets();
await writeFile(join(logosDir, MANIFEST), await buildManifest());
