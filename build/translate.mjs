// Piano Compass translation sync.
//
// The editor (/admin) saves the English copy for each page to
// content/pages/*.json. This script finds every text field whose English no
// longer matches locales/en.json (or that a language has no translation for
// yet) and hands that work to Claude Code, then writes the translations back
// into locales/<lang>.json and records the new English in locales/en.json,
// so the next run only picks up fields that change again.
//
// Run by .github/workflows/translate.yml whenever content/pages/ changes on
// main; the workflow runs Claude Code between the two steps below, commits
// the updated locales, and Netlify redeploys.
//
//   node build/translate.mjs --plan <dir>    write <dir>/<lang>.json listing the
//                                            fields to translate (no dir when
//                                            nothing to do)
//   node build/translate.mjs --apply <dir>   write <dir>/<lang>.json translations
//                                            into locales
//   node build/translate.mjs                 list what needs translating

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.resolve(ROOT, p), 'utf8'));
const writeJson = (p, o) => fs.writeFileSync(path.resolve(ROOT, p), JSON.stringify(o, null, 2) + '\n');

const LANGUAGE_NAMES = { nl: 'Dutch', de: 'German', es: 'Spanish', ru: 'Russian', uk: 'Ukrainian' };

const get = (obj, key) => key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
function set(obj, key, value) {
  const parts = key.split('.');
  let o = obj;
  for (const k of parts.slice(0, -1)) {
    if (!o[k] || typeof o[k] !== 'object') o[k] = {};
    o = o[k];
  }
  o[parts.at(-1)] = value;
}

// Flatten page copy into dotted keys, skipping `images` and blank fields —
// the same rules build/generate.mjs uses when it overlays the copy.
function flatten(obj, prefix = '', out = new Map()) {
  for (const [k, v] of Object.entries(obj || {})) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) flatten(v, key, out);
    else if (typeof v === 'string' && v.trim() !== '') out.set(key, v);
  }
  return out;
}

function loadPageCopy() {
  const copy = new Map();
  for (const f of fs.readdirSync(path.join(ROOT, 'content/pages')).filter((n) => n.endsWith('.json')).sort()) {
    const { images, ...text } = readJson(`content/pages/${f}`);
    for (const [k, v] of flatten(text)) copy.set(k, v);
  }
  return copy;
}

// A language needs a field translated when its English changed, or when the
// field has never been translated into it (so it shows English there).
function buildPlan() {
  const en = readJson('locales/en.json');
  const copy = [...loadPageCopy()];
  const changed = copy.filter(([key, text]) => get(en, key) !== text).map(([key]) => key);
  const languages = {};
  for (const f of fs.readdirSync(path.join(ROOT, 'locales'))) {
    if (!f.endsWith('.json') || f === 'en.json') continue;
    const lang = f.replace(/\.json$/, '');
    const locale = readJson(`locales/${lang}.json`);
    const fields = copy
      .filter(([key]) => changed.includes(key) || get(locale, key) == null)
      .map(([key, english]) => ({
        key,
        english,
        previousEnglish: get(locale, key) == null ? null : get(en, key) ?? null,
        previousTranslation: get(locale, key) ?? null,
      }));
    if (fields.length) languages[lang] = { language: LANGUAGE_NAMES[lang] || lang, fields };
  }
  return { changed, languages };
}

function summarise(plan) {
  if (plan.changed.length) console.log(`[translate] English changed: ${plan.changed.join(', ')}`);
  for (const [lang, { fields }] of Object.entries(plan.languages)) {
    console.log(`[translate] ${lang}: ${fields.length} field(s) to translate`);
  }
}

// Check every planned field has a translation before writing anything, so a
// partial result leaves the locales untouched and the next run retries.
function apply(dir) {
  const plan = buildPlan();
  const translations = {};
  for (const lang of Object.keys(plan.languages)) {
    const f = path.join(dir, `${lang}.json`);
    translations[lang] = fs.existsSync(path.resolve(ROOT, f)) ? readJson(f) : {};
  }
  for (const [lang, { fields }] of Object.entries(plan.languages)) {
    for (const { key } of fields) {
      const text = translations[lang]?.[key];
      if (typeof text !== 'string' || !text.trim()) throw new Error(`no ${lang} translation for ${key}`);
    }
  }
  for (const [lang, { fields }] of Object.entries(plan.languages)) {
    const locale = readJson(`locales/${lang}.json`);
    for (const { key } of fields) set(locale, key, translations[lang][key]);
    writeJson(`locales/${lang}.json`, locale);
    console.log(`[translate] updated locales/${lang}.json (${fields.length} field(s))`);
  }
  if (plan.changed.length) {
    const en = readJson('locales/en.json');
    const copy = loadPageCopy();
    for (const key of plan.changed) set(en, key, copy.get(key));
    writeJson('locales/en.json', en);
  }
}

try {
  const [mode, target] = process.argv.slice(2);
  if (mode === '--apply') {
    apply(target);
  } else {
    const plan = buildPlan();
    if (!Object.keys(plan.languages).length) {
      console.log('[translate] all languages are up to date with the page copy');
    } else {
      summarise(plan);
      if (mode === '--plan') {
        fs.mkdirSync(path.resolve(ROOT, target), { recursive: true });
        for (const [lang, entry] of Object.entries(plan.languages)) writeJson(path.join(target, `${lang}.json`), entry);
      }
    }
  }
} catch (err) {
  console.error(`[translate] ${err.message}`);
  process.exit(1);
}
