#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { mainCli, check, RULES, SITE_OPTIONS, SITE_HELP, UsageError, splitList } from '../src/index.js';

const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
mainCli({
  name: 'policy-drift-warden', version: pkg.version, configKey: 'policyDriftWarden', rules: RULES,
  tagline: 'compare trackers on your site with what your privacy policy declares',
  usage: 'Usage: policy-drift-warden [site-dir] [options]',
  help: `${SITE_HELP}Policy
      --policy <file>          Privacy policy file (HTML, Markdown or text) instead of a page in the build
      --policy-pages <globs>   Pages that make up the policy (default: privacy*, cookie-policy, datenschutz, ...)
      --max-age-days <n>       Report the policy as outdated after n days (default 365)
      --trackers-only          Only require disclosure of tracking vendors (not fonts/CDN/video/payments)
`,
  options: { ...SITE_OPTIONS, policy: { type: 'string' }, 'policy-pages': { type: 'string', multiple: true }, 'max-age-days': { type: 'string' }, 'trackers-only': { type: 'boolean' } },
  run: async ({ dir, values: o, config, configFile }) => {
    let age; if (o['max-age-days'] != null) { age = Number(o['max-age-days']); if (!(age > 0)) throw new UsageError('--max-age-days must be a positive number'); }
    return check(dir, { cli: o, policyFile: o.policy, policyPages: splitList(o['policy-pages']), maxAgeDays: age, discloseAll: o['trackers-only'] ? false : undefined, toolVersion: pkg.version }, config, configFile);
  },
});
