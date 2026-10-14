// Third-party inventory (shared with tracker-warden). Louis Wright, MIT.
import { thirdPartyResources } from "./vendors.js";

/** Build the inventory: [{ id, name, company, category, sells, pages:[], urls:[], kinds:[] }]. */
export function inventory(site, config = {}) {
  const siteHost = site.origin ? new URL(site.origin).host : (config.firstParty?.[0] ?? null);
  const fpExtra = (config.firstParty || []).map((h) => h.toLowerCase());
  const inv = new Map();
  for (const pg of site.pages) {
    for (const r of thirdPartyResources(pg.doc, siteHost)) {
      if (fpExtra.some((h) => r.host === h || r.host.endsWith('.' + h))) continue;
      const v = r.vendor || { id: `domain:${r.host}`, name: r.host, company: null, category: (r.kind === 'script' || r.kind === 'iframe') ? 'unknown' : 'other', sells: false, unknown: true };
      if (!inv.has(v.id)) inv.set(v.id, { id: v.id, name: v.name, company: v.company, category: v.category, sells: !!v.sells, cookieless: !!v.cookieless, unknown: !!v.unknown, pages: new Set(), urls: new Set(), kinds: new Set(), first: { file: pg.file, line: r.line } });
      const e = inv.get(v.id); e.pages.add(pg.path); if (r.url) e.urls.add(r.url); e.kinds.add(r.kind);
      if (r.kind === 'pixel') e.pixel = true;
    }
  }
  return [...inv.values()].map((e) => ({ ...e, pages: [...e.pages].sort(), urls: [...e.urls].sort(), kinds: [...e.kinds].sort() })).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}
