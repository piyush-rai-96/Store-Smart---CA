/**
 * One-way migration: raw px / weights in .css under src/ → --ia-* tokens.
 * Run: node scripts/apply-impact-typography.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const ROOT = 'src';
const SKIP = new Set(['impact-typography.css']);

/* Longest first so "12.5px" is not split */
const SIZE_MAP = [
  ['48px', 'var(--ia-text-48)'],
  ['44px', 'var(--ia-text-44)'],
  ['42px', 'var(--ia-text-42)'],
  ['36px', 'var(--ia-text-36)'],
  ['13.5px', 'var(--ia-text-13-5)'],
  ['12.5px', 'var(--ia-text-12-5)'],
  ['11.5px', 'var(--ia-text-11-5)'],
  ['10.5px', 'var(--ia-text-10-5)'],
  ['9.5px', 'var(--ia-text-9-5)'],
  ['32px', 'var(--ia-text-5xl)'],
  ['30px', 'var(--ia-text-30)'],
  ['28px', 'var(--ia-text-4xl)'],
  ['26px', 'var(--ia-text-26)'],
  ['24px', 'var(--ia-text-3xl)'],
  ['22px', 'var(--ia-text-2xl)'],
  ['21px', 'var(--ia-text-21)'],
  ['20px', 'var(--ia-text-xl)'],
  ['19px', 'var(--ia-text-19)'],
  ['18px', 'var(--ia-text-lg)'],
  ['17px', 'var(--ia-text-17)'],
  ['16px', 'var(--ia-text-md)'],
  ['15.5px', 'var(--ia-text-15-5)'],
  ['15px', 'var(--ia-text-15)'],
  ['14px', 'var(--ia-text-sm)'],
  ['13px', 'var(--ia-text-13)'],
  ['12px', 'var(--ia-text-xs)'],
  ['11px', 'var(--ia-text-2xs)'],
  ['10px', 'var(--ia-text-3xs)'],
  ['9px', 'var(--ia-text-9)'],
  ['8px', 'var(--ia-text-8)'],
];

const WEIGHT_MAP = [
  ['font-weight: 800', 'font-weight: var(--ia-font-weight-extrabold)'],
  ['font-weight: 700', 'font-weight: var(--ia-font-weight-bold)'],
  ['font-weight: 600', 'font-weight: var(--ia-font-weight-semibold)'],
  ['font-weight: 500', 'font-weight: var(--ia-font-weight-medium)'],
  ['font-weight: 400', 'font-weight: var(--ia-font-weight-regular)'],
];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (p.endsWith('.css')) out.push(p);
  }
  return out;
}

function processFile(file) {
  const base = file.split('/').pop();
  if (SKIP.has(base) || file.includes('node_modules')) return false;
  let s = readFileSync(file, 'utf8');
  const before = s;
  s = s.replace(/font-family:\s*'Inter'[^;]+;/g, 'font-family: var(--ia-font-sans);');
  s = s.replace(/font-family:\s*"Inter"[^;]+;/g, 'font-family: var(--ia-font-sans);');
  for (const [px, v] of SIZE_MAP) {
    s = s.replaceAll(`font-size: ${px};`, `font-size: ${v};`);
    s = s.replaceAll(`font-size: ${px} !important`, `font-size: ${v} !important`);
  }
  for (const [a, b] of WEIGHT_MAP) {
    s = s.replaceAll(`${a};`, `${b};`);
  }
  if (s !== before) {
    writeFileSync(file, s);
    return true;
  }
  return false;
}

let n = 0;
for (const f of walk(ROOT)) {
  if (processFile(f)) {
    n++;
    console.log('updated', f);
  }
}
console.log('done, files changed:', n);
