/**
 * The manifest that ties the committed logos to the sources they came from.
 *
 * `logos/` is generated but tracked, so it can fall behind: a palette change or
 * an edited template leaves the committed PNGs showing the old logo with
 * nothing to say so. Regenerating in `pnpm verify` and comparing bytes is not
 * an option, because the rasteriser's anti-aliasing is not guaranteed to be
 * identical on a Mac and on the CI runner. So the generator records two things
 * instead, and verify checks both:
 *
 *   - one digest over everything the logos are made from: the templates, the
 *     palette, the font, and the scripts that compose them;
 *   - the digest of every file it wrote.
 *
 * A changed input means the logos are stale; a changed, missing or extra file
 * means someone edited `logos/` by hand. Either way the fix is `pnpm brand`.
 */
import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { paletteFrom } from './tokens.mjs';
import { FONT_FILE } from './outline.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

export const LOGOS_DIR = join(ROOT, 'logos');
export const MANIFEST = 'MANIFEST';

/** The manifest line for the inputs digest, in the place of a file name. */
const INPUTS = '(sources)';

/** Everything that shapes a logo, relative to the repository root. */
const INPUT_FILES = [
  'scripts/assets/brand-wordmark.svg',
  'scripts/assets/brand-mark.svg',
  'scripts/assets/descriptor.svg',
  'src/lib/globe.mjs',
  'scripts/generate-brand.mjs',
  'scripts/lockup.mjs',
  'scripts/photo-banner.mjs',
  'scripts/vector-lockup.mjs',
  'scripts/outline.mjs',
  'scripts/tight-render.mjs',
  'scripts/template.mjs',
  'scripts/tokens.mjs',
];

const sha256 = (data) => createHash('sha256').update(data).digest('hex');

/** One digest over the inputs. The palette, not the whole stylesheet, so a
 *  layout change on the site does not mark the logos stale. */
export async function inputsDigest() {
  const hash = createHash('sha256');
  for (const file of INPUT_FILES) {
    hash.update(file).update(await readFile(join(ROOT, file)));
  }
  const css = await readFile(join(ROOT, 'src/styles/global.css'), 'utf8');
  hash.update(JSON.stringify(paletteFrom(css)));
  hash.update(await readFile(FONT_FILE));
  return hash.digest('hex');
}

/** The manifest text for the files now in `logos/`. */
export async function buildManifest() {
  const files = (await readdir(LOGOS_DIR)).filter((file) => file !== MANIFEST).sort();
  const lines = [`${await inputsDigest()}  ${INPUTS}`];
  for (const file of files) {
    lines.push(`${sha256(await readFile(join(LOGOS_DIR, file)))}  ${file}`);
  }
  return lines.join('\n') + '\n';
}

/**
 * Compares `logos/` with its manifest.
 * @returns {Promise<string[]>} one line per problem, empty when current
 */
export async function manifestProblems() {
  const recorded = await readFile(join(LOGOS_DIR, MANIFEST), 'utf8').catch(() => null);
  if (recorded === null) return ['logos/MANIFEST is missing'];
  const current = await buildManifest();
  if (recorded === current) return [];

  const parse = (text) =>
    new Map(
      text
        .trim()
        .split('\n')
        .map((line) => line.split(/\s+/).reverse()),
    );
  const was = parse(recorded);
  const now = parse(current);
  const problems = [];
  if (was.get(INPUTS) !== now.get(INPUTS)) {
    problems.push('a source changed since the logos were generated');
  }
  for (const name of new Set([...was.keys(), ...now.keys()])) {
    if (name === INPUTS || was.get(name) === now.get(name)) continue;
    if (!now.has(name)) problems.push(`logos/${name} is listed but missing`);
    else if (!was.has(name)) problems.push(`logos/${name} is not in the manifest`);
    else problems.push(`logos/${name} differs from what was generated`);
  }
  return problems;
}
