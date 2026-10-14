// policy-drift-warden: compare trackers observed in a built site with what the privacy policy declares. Louis Wright, MIT.
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { runBeacon, finder, SITE_OPTIONS, SITE_HELP, siteOptions, parseHtml, matchAny } from './site.js';
import { buildReport, UsageError } from './core.js';
import { VENDORS, TRACKING } from './vendors.js';
import { inventory } from './inventory.js';

export * from './core.js';
export { SITE_OPTIONS, SITE_HELP, siteOptions, inventory };

export const RULES = {
  'policy-missing': { severity: 'high', title: 'No privacy policy found (page or --policy file)' },
  'policy-undisclosed-vendor': { severity: 'high', title: 'A tracker or third party loaded by the site is not named in the privacy policy' },
  'policy-sale-share-undisclosed': { severity: 'high', title: 'Advertising vendors that sell/share data are used, but the policy never mentions selling, sharing or targeted advertising' },
  'policy-undisclosed-category': { severity: 'medium', title: 'A category of processing (advertising, session recording, analytics, social) is used but not described' },
  'policy-not-linked': { severity: 'medium', title: 'Pages do not link to the privacy policy' },
  'policy-stale-vendor': { severity: 'low', title: 'Policy names a known vendor that the site no longer loads' },
  'policy-date-missing': { severity: 'low', title: 'Policy has no "last updated" or effective date' },
  'policy-outdated': { severity: 'low', title: 'Policy was last updated before the newest tracker change window (default: over 12 months ago)' },
};
const CATEGORY_WORDS = {
  advertising: ['advertis', 'retarget', 'remarketing', 'marketing pixel', 'ad partner', 'interest-based', 'personalised ads', 'personalized ads'],
  'session-replay': ['session record', 'session replay', 'heatmap', 'heat map', 'screen record', 'records your interactions', 'mouse movement'],
  analytics: ['analytics', 'statistic', 'measure', 'audience measurement', 'usage data'],
  'tag-manager': ['tag manag', 'analytics'],
  social: ['social', 'share button', 'social media plugin', 'social plugin'],
  marketing: ['marketing', 'newsletter', 'email marketing', 'crm'],
};
const SALE_WORDS = ['sell', 'sale of', 'share your personal', 'sharing of personal', 'targeted advertising', 'cross-context behavio', 'do not sell', 'opt out of sale'];
const POLICY_PATH = /(^|\/)(privacy([-_]policy|[-_]notice|[-_]statement)?|datenschutz(erklaerung|erkl%c3%a4rung)?|politique[-_]de[-_]confidentialite|privacidad|privacy-and-cookies|cookie[-_]policy|cookies)(\/index)?\.html?$/i;
const norm = (s) => ` ${String(s).toLowerCase().replace(/[^\p{L}\p{N}.]+/gu, ' ').replace(/\.(?=\s|$)/g, ' ')} `;

/** Locate the policy text: explicit file (html/md/txt) or pages matching the policy path pattern. */
export function findPolicy(site, file, globs = []) {
  if (file) { const f = resolve(file); if (!existsSync(f)) throw new UsageError(`Policy file not found: ${file}`); const raw = readFileSync(f, 'utf8'); return { source: file, text: /\.html?$/i.test(f) ? parseHtml(raw).text : raw, pages: [] }; }
  const pages = site.pages.filter((p) => (globs.length ? matchAny(globs, p.path) || matchAny(globs, p.file) : POLICY_PATH.test(p.file)));
  if (!pages.length) return null;
  return { source: pages.map((p) => p.file).join(', '), text: pages.map((p) => p.doc.text).join('\n'), pages };
}
export function mentions(text, vendor) {
  const t = norm(text);
  const names = [...(vendor.policyNames || []), vendor.name, ...(vendor.domains || [])].filter(Boolean).map((n) => norm(n).trim());
  return names.some((n) => n && t.includes(` ${n} `) || (n.includes('.') && t.includes(n)));
}
export function policyDate(text) {
  const m = /(last\s+(?:updated|modified|revised|reviewed)|effective(?:\s+date)?|updated(?:\s+on)?|stand|version)\s*[:\-–]?\s*(?:on\s+)?([0-9]{1,2}(?:st|nd|rd|th)?\s+[a-z]+\.?\s+[0-9]{4}|[a-z]+\.?\s+[0-9]{1,2}(?:st|nd|rd|th)?,?\s+[0-9]{4}|[0-9]{4}-[0-9]{2}-[0-9]{2}|[0-9]{1,2}[./][0-9]{1,2}[./][0-9]{4})/i.exec(text);
  if (!m) return null;
  let s = m[2].replace(/(st|nd|rd|th)\b/i, ''); const dmY = /^(\d{1,2})[./](\d{1,2})[./](\d{4})$/.exec(s); if (dmY) s = `${dmY[3]}-${dmY[2].padStart(2, '0')}-${dmY[1].padStart(2, '0')}`;
  const d = new Date(s); return Number.isNaN(d.getTime()) ? null : d;
}

export function analyze(site, opts = {}, config = {}) {
  const { findings, add } = finder(RULES);
  const inv = inventory(site, config).filter((e) => !e.unknown || e.category === 'unknown');
  const pol = findPolicy(site, opts.policyFile ?? config.policyFile, [...(config.policyPages || []), ...(opts.policyPages || [])]);
  const ignore = (config.ignoreVendors || []).map((x) => x.toLowerCase());
  const relevant = inv.filter((e) => !ignore.includes(e.id) && (TRACKING.has(e.category) || e.unknown || (config.discloseAll ?? opts.discloseAll ?? true)));
  if (!pol) { add('policy-missing', 'privacy-policy', `No privacy policy page found${relevant.length ? ` (the site loads ${relevant.length} third part${relevant.length === 1 ? 'y' : 'ies'})` : ''}`, 'Publish /privacy.html (or pass --policy / set "policyPages").', {}); return { findings, info: { vendors: inv.length }, summary: `${site.pages.length} page(s); no privacy policy` }; }
  const pf = pol.pages[0]?.file || pol.source;
  for (const e of relevant) {
    const v = VENDORS.find((x) => x.id === e.id) || { name: e.name, domains: [e.name], policyNames: [] };
    if (!mentions(pol.text, v)) add('policy-undisclosed-vendor', e.id, `${e.name}${e.company ? ` (${e.company})` : ''} [${e.category}] is loaded on ${e.pages.length} page(s) but not named in the policy`, `Name ${e.name}${e.company ? ` / ${e.company}` : ''}, its purpose and legal basis in the privacy policy, or remove it.`, { file: e.pages[0] ? site.find(e.pages[0])?.file : undefined });
  }
  const t = pol.text.toLowerCase();
  for (const cat of [...new Set(relevant.map((e) => e.category))]) { const w = CATEGORY_WORDS[cat]; if (w && !w.some((x) => t.includes(x))) add('policy-undisclosed-category', cat, `The site uses ${cat} (${relevant.filter((e) => e.category === cat).map((e) => e.name).join(', ')}) but the policy does not describe it`, `Add a section explaining ${cat} processing and how to opt out.`, { file: pf }); }
  if (relevant.some((e) => e.sells) && !SALE_WORDS.some((x) => t.includes(x))) add('policy-sale-share-undisclosed', 'sale-share', `Vendors that sell/share data (${relevant.filter((e) => e.sells).map((e) => e.name).join(', ')}) are used, but the policy does not mention selling, sharing or targeted advertising`, 'Disclose sale/sharing for targeted advertising and the opt-out (CCPA/CPRA, GDPR Art. 13).', { file: pf });
  const seen = new Set(inv.map((e) => e.id));
  for (const v of VENDORS) if (!seen.has(v.id) && TRACKING.has(v.category) && (v.policyNames || []).some((n) => n.length > 5 && norm(pol.text).includes(` ${n} `)) && !(config.ignoreStale || []).includes(v.id)) add('policy-stale-vendor', v.id, `Policy names ${v.name} but the site does not load it`, 'Remove it from the policy if it is no longer used (or ignore if it runs server-side or in apps).', { file: pf });
  const d = policyDate(pol.text);
  if (!d) add('policy-date-missing', 'date', 'Policy has no "Last updated" date', 'Add "Last updated: YYYY-MM-DD" near the top.', { file: pf });
  else { const age = ((opts.now || new Date()) - d) / 864e5; const max = opts.maxAgeDays ?? config.maxAgeDays ?? 365; if (age > max) add('policy-outdated', 'date', `Policy last updated ${d.toISOString().slice(0, 10)} (${Math.round(age)} days ago)`, 'Review the policy against the current tracker inventory and update the date.', { file: pf }); }
  if (pol.pages.length) {
    const unlinked = site.pages.filter((p) => !pol.pages.includes(p) && !p.doc.anchors.some((a) => { const u = site.resolve(p, a.href); return u && pol.pages.includes(site.find(u)); }));
    if (unlinked.length) add('policy-not-linked', 'link', `${unlinked.length} page(s) do not link to the privacy policy, e.g. ${unlinked.slice(0, 3).map((p) => p.path).join(', ')}`, 'Link the policy from the site footer on every page.', { file: unlinked[0].file });
  }
  return { findings, info: { vendors: inv.length, policy: pol.source, policyDate: d ? d.toISOString().slice(0, 10) : null }, summary: `${site.pages.length} page(s); ${inv.length} third part${inv.length === 1 ? 'y' : 'ies'}; policy: ${pol.source}` };
}

export function check(dir, opts = {}, config = {}, configFile) {
  const tool = { name: 'policy-drift-warden', version: opts.toolVersion || '1.0.0', rules: RULES, emoji: '📜', defaultFile: 'privacy.html' };
  return runBeacon(tool, dir, { ...opts, UsageError }, config, configFile, analyze, buildReport);
}
