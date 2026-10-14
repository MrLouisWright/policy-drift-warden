import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { check, mentions, policyDate, RULES } from '../src/index.js';
import { VENDORS } from '../src/vendors.js';

const fx = (n) => new URL(`./fixtures/${n}`, import.meta.url).pathname;
const rules = (r) => r.findings.map((f) => f.rule);
const site = (files) => { const d = mkdtempSync(join(tmpdir(), 'pd-')); for (const [p, c] of Object.entries(files)) { mkdirSync(join(d, p, '..'), { recursive: true }); writeFileSync(join(d, p), c); } return d; };
const page = (h, b = '<a href="/privacy.html">Privacy</a>') => `<!doctype html><html><head><title>t</title><link rel="canonical" href="https://me.example/">${h}</head><body>${b}</body></html>`;
const now = new Date('2026-10-14');

test('good fixture is clean', () => { assert.deepEqual(check(fx('good'), { now }).findings, []); });
test('bad fixture reports the drift rules', () => { const r = rules(check(fx('bad'), { now })); for (const k of Object.keys(RULES).filter((k) => !['policy-missing', 'policy-outdated'].includes(k))) assert.ok(r.includes(k), k); });
test('mentions: names, company aliases, domains, punctuation', () => {
  const meta = VENDORS.find((v) => v.id === 'meta-pixel');
  assert.ok(mentions('We use the Facebook pixel.', meta)); assert.ok(mentions('Data goes to connect.facebook.net', meta)); assert.ok(!mentions('We use nothing', meta));
});
test('policyDate formats', () => {
  assert.equal(policyDate('Last updated: 2026-09-01').toISOString().slice(0, 10), '2026-09-01');
  assert.equal(policyDate('Effective date: 3 March 2025').getFullYear(), 2025);
  assert.equal(policyDate('Last updated on January 5, 2024').getMonth(), 0);
  assert.equal(policyDate('Stand: 01.02.2023').toISOString().slice(0, 7), '2023-02');
  assert.equal(policyDate('no date'), null);
});
test('missing policy, outdated policy and explicit policy file', () => {
  assert.deepEqual(rules(check(site({ 'index.html': page('<script src="https://static.hotjar.com/x.js"></script>') }), { now })), ['policy-missing']);
  const d = site({ 'index.html': page(''), 'privacy.html': page('', '<p>Last updated: 2020-01-01</p>') });
  assert.deepEqual(rules(check(d, { now })), ['policy-outdated']);
  assert.deepEqual(rules(check(d, { now, maxAgeDays: 5000 })), []);
  const e = site({ 'index.html': page('<script src="https://static.hotjar.com/x.js"></script>', ''), 'POLICY.md': '# Privacy\nLast updated: 2026-10-01\nWe use Hotjar heatmaps (session recording).' });
  assert.deepEqual(rules(check(e, { now, policyFile: join(e, 'POLICY.md') })), []);
});
test('trackers-only mode skips fonts/payments', () => {
  const d = site({ 'index.html': page('<link rel="stylesheet" href="https://fonts.googleapis.com/css?x">'), 'privacy.html': page('', '<p>Last updated: 2026-10-01</p>') });
  assert.deepEqual(rules(check(d, { now })), ['policy-undisclosed-vendor']);
  assert.deepEqual(rules(check(d, { now, discloseAll: false })), []);
});
test('allowlist with expiry', () => {
  const d = site({ 'index.html': page('<script src="https://js.stripe.com/v3"></script>'), 'privacy.html': page('', '<p>Last updated: 2026-10-01</p>') });
  const r = check(d, { now }, { allowlist: [{ subject: 'stripe', reason: 'policy update in review', expires: '2026-11-01' }] });
  assert.equal(r.findings.length, 0); assert.equal(r.suppressed.length, 1);
});
test('CLI exit codes and formats', () => {
  const bin = new URL('../bin/policy-drift-warden.js', import.meta.url).pathname;
  const run = (...x) => spawnSync(process.execPath, [bin, ...x], { encoding: 'utf8' });
  assert.equal(run(fx('good'), '--fail-on', 'low').status, 0);
  assert.equal(run(fx('bad')).status, 1);
  assert.equal(run(fx('bad'), '--fail-on', 'none').status, 0);
  assert.equal(run(fx('good'), '--policy', '/nope.md').status, 2);
  assert.equal(run('/nonexistent-dir-xyz').status, 2);
  const s = JSON.parse(run(fx('bad'), '--format', 'sarif', '--fail-on', 'none').stdout); assert.equal(s.version, '2.1.0');
  assert.match(run(fx('bad'), '--format', 'markdown', '--fail-on', 'none').stdout, /\| Severity \|/);
});
