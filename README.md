# policy-drift-warden

> Compare the trackers and third parties your built site actually loads with what its privacy policy says, and fail CI when they drift apart.

Privacy policies are written once and sites keep changing. Marketing adds a Meta pixel, product adds Hotjar, and the policy still only mentions Google Analytics. Regulators and complainants check exactly this gap. `policy-drift-warden` builds the third-party inventory from your built HTML (the same detection as tracker-warden), reads your privacy policy page or file, and reports every vendor, category or sale/share practice that is not disclosed, with a **concrete fix**.

CLI, library and GitHub Action. Node.js 18+, **zero runtime dependencies**. Works on any static build output (Astro, Next.js `output: 'export'`, Eleventy, Hugo, Jekyll, Docusaurus, VitePress, plain HTML) and runs offline: point it at the folder your build writes. By Louis Wright.

## Features

- **Vendor disclosure:** each loaded vendor must be named in the policy by name, company alias ("Facebook" for Meta Pixel) or domain. Unknown third-party domains must be named too.
- **Category disclosure:** advertising, session recording/heatmaps, analytics and social plugins must be described.
- **Sale/sharing:** if vendors that sell or share data for advertising are present, the policy must mention selling, sharing or targeted advertising.
- **Stale disclosures:** tracking vendors named in the policy that the site no longer loads.
- **Freshness:** "Last updated" / effective date present (ISO, `3 March 2025`, `January 5, 2024`, `01.02.2023`) and not older than `--max-age-days` (365).
- **Reachability:** every page links to the policy.
- Finds the policy automatically (`privacy.html`, `privacy-policy/`, `cookie-policy`, `datenschutz`, ...) or reads `--policy POLICY.md`.
- Text/JSON/SARIF/Markdown output, `--fail-on`, exit codes 0/1/2, allowlist with expiry, severity overrides, GitHub Action with job summary.

### Scope

policy-drift-warden checks disclosure, not legal adequacy; it is not legal advice. The tracker inventory itself is tracker-warden, consent behaviour is consent-warden.

## Rules

| Rule | Default severity | What it means |
|---|---|---|
| `policy-missing` | high | No privacy policy found (page or --policy file) |
| `policy-undisclosed-vendor` | high | A tracker or third party loaded by the site is not named in the privacy policy |
| `policy-sale-share-undisclosed` | high | Advertising vendors that sell/share data are used, but the policy never mentions selling, sharing or targeted advertising |
| `policy-undisclosed-category` | medium | A category of processing (advertising, session recording, analytics, social) is used but not described |
| `policy-not-linked` | medium | Pages do not link to the privacy policy |
| `policy-stale-vendor` | low | Policy names a known vendor that the site no longer loads |
| `policy-date-missing` | low | Policy has no "last updated" or effective date |
| `policy-outdated` | low | Policy was last updated before the newest tracker change window (default: over 12 months ago) |
| `allowlist-expired` | medium | An allowlist entry is past its `expires` date |
| `allowlist-unused` | info | An allowlist entry matched nothing |

## Install and run

```bash
npx policy-drift-warden dist
npx policy-drift-warden dist --policy legal/privacy.md --fail-on medium
npx policy-drift-warden public --trackers-only --max-age-days 180
npx policy-drift-warden out --policy-pages "/legal/privacy/**" --format sarif > policy.sarif
```

Pages are mapped to URLs the way static hosts serve them: `index.html` → `/`, `blog/index.html` → `/blog/`, `about.html` → `/about.html` (or `/about` with `--clean-urls`). Pass `--base-url` with your public URL, or let it be inferred from canonical / `og:url` tags. Meta-refresh redirect stubs and `404.html` are skipped. `X-Robots-Tag` and `Link` headers are read from Netlify/Cloudflare `_headers` and `vercel.json`.

### Sample output

```text
policy-drift-warden — https://acme.example
3 page(s); 3 third parties; policy: privacy-policy.html

HIGH     index.html Meta Pixel (Meta) [advertising] is loaded on 1 page(s) but not named in the policy [policy-undisclosed-vendor]
         ↳ fix: Name Meta Pixel / Meta, its purpose and legal basis in the privacy policy, or remove it.
HIGH     index.html Hotjar (Hotjar) [session-replay] is loaded on 1 page(s) but not named in the policy [policy-undisclosed-vendor]
         ↳ fix: Name Hotjar / Hotjar, its purpose and legal basis in the privacy policy, or remove it.
HIGH     privacy-policy.html Vendors that sell/share data (Meta Pixel) are used, but the policy does not mention selling, sharing or targeted advertising [policy-sale-share-undisclosed]
         ↳ fix: Disclose sale/sharing for targeted advertising and the opt-out (CCPA/CPRA, GDPR Art. 13).
MEDIUM   index.html 2 page(s) do not link to the privacy policy, e.g. /, /shop.html [policy-not-linked]
```

## Options

```text
policy-drift-warden 1.0.0 — compare trackers on your site with what your privacy policy declares

Usage: policy-drift-warden [site-dir] [options]

Site
      --base-url <url>        Public URL of the site, e.g. https://example.com (default: inferred from canonical/og:url)
      --include <globs>       Only check these pages (file or URL path globs, comma-separated)
      --exclude <globs>       Skip these pages
      --clean-urls            Pages are served without .html (about.html -> /about)
Policy
      --policy <file>          Privacy policy file (HTML, Markdown or text) instead of a page in the build
      --policy-pages <globs>   Pages that make up the policy (default: privacy*, cookie-policy, datenschutz, ...)
      --max-age-days <n>       Report the policy as outdated after n days (default 365)
      --trackers-only          Only require disclosure of tracking vendors (not fonts/CDN/video/payments)

Common
  -c, --config <file>     JSON config (default: .policy-drift-warden.json or "policyDriftWarden" in package.json)
  -f, --format <fmt>      text (default) | json | sarif | markdown
      --json <file>       Also write a JSON report
      --sarif <file>      Also write SARIF 2.1.0
      --markdown <file>   Also write Markdown (e.g. for a job summary)
      --fail-on <sev>     critical | high | medium | low | info | none (default: high)
      --list-rules        Print rules and default severities
      --no-fixes          Hide fix suggestions in text output
      --no-color          Disable colours
  -v, --version / -h, --help

Exit codes: 0 = passed, 1 = findings at or above --fail-on, 2 = usage, config or read error.
```

## Configuration and allowlist

Options can live in `.policy-drift-warden.json` (or a `"policyDriftWarden"` key in `package.json`, or `--config <file>`):

```json
{
  "failOn": "medium",
  "severity": {
    "policy-missing": "low"
  },
  "allowlist": [
    {
      "rule": "policy-undisclosed-vendor",
      "subject": "youtube",
      "reason": "Covered in the embedded-content section, rename pending",
      "expires": "2027-03-31"
    }
  ],
  "policyPages": [
    "/legal/privacy.html"
  ],
  "maxAgeDays": 365,
  "ignoreVendors": [
    "stripe"
  ]
}
```

- **`severity`** changes a rule's severity, or turns it `"off"`.
- **`allowlist`** entries suppress matching findings. Each needs a `reason` and matches on any combination of `rule`, `file`, `subject` (globs with `*`) and `match` (a substring of the message). Add `expires` (`YYYY-MM-DD`) so the exception is time-boxed: once it lapses the finding comes back along with an `allowlist-expired` finding (medium). Entries that no longer match anything are reported as `allowlist-unused` (info).

Config can also set `baseUrl`, `include`, `exclude` and `cleanUrls`. The config file is looked up in the site directory first, then in the current directory, so `.policy-drift-warden.json` can live at your repository root. Other keys: `policyFile`, `policyPages`, `maxAgeDays`, `discloseAll` (default true), `ignoreVendors`, `ignoreStale` and `firstParty`.

## Output and exit codes

- `--format text` (default), `json`, `sarif` (SARIF 2.1.0 for GitHub code scanning) or `markdown` (for job summaries and PR comments). `--json`, `--sarif` and `--markdown` write extra report files in the same run.
- `--fail-on <severity>` sets the threshold (`critical`, `high`, `medium`, `low`, `info`, `none`; default `high`).
- Exit codes: **0** passed, **1** findings at or above `--fail-on`, **2** usage, config or read error.

## GitHub Action

```yaml
permissions:
  contents: read
  security-events: write   # only needed for the SARIF upload
jobs:
  policy-drift-warden:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@11d5960a326750d5838078e36cf38b85af677262 # v4
        with: { persist-credentials: false }
      - run: npm ci && npm run build   # produce the static site first
      - uses: MrLouisWright/policy-drift-warden@v1
        with:
          path: dist
          fail-on: high
          sarif: policy-drift-warden.sarif
      - uses: github/codeql-action/upload-sarif@v3
        if: always()
        with: { sarif_file: policy-drift-warden.sarif }
```

| Input | Description | Default |
|---|---|---|
| `path` | Built site directory (e.g. dist, public, _site) | `.` |
| `base-url` | Public URL of the site, e.g. https://example.com | |
| `fail-on` | Failure threshold | `high` |
| `config` | Config file path | |
| `sarif` / `json` | Write SARIF / JSON report to this path | |
| `job-summary` | Add the Markdown report to the job summary | `true` |
| `args` | Extra CLI arguments | |

The action runs the bundled CLI with Node 20; it has no dependencies to install. Pin it to a commit SHA if your policy requires it.

## Library

```js
import { check, policyDate } from "policy-drift-warden";
const report = check("dist", { policyFile: "legal/privacy.md" });
console.log(report.info.policy, report.findings);
```

Types are included.

## Requirements

Node.js 18 or newer. Zero runtime dependencies.

## Licence

MIT © Louis Wright. See [LICENSE](LICENSE).
