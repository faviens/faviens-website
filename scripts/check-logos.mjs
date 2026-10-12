#!/usr/bin/env node
/**
 * Asserts that the committed logos in `logos/` are what `pnpm brand` would
 * write from the current sources. See `logo-manifest.mjs` for how.
 */
import { manifestProblems } from './logo-manifest.mjs';

const problems = await manifestProblems();
if (problems.length > 0) {
  console.error('logos: out of date\n' + problems.map((p) => `  ${p}`).join('\n'));
  process.exit(1);
}
console.log('logos: match their sources');
