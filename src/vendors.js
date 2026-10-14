// Known third-party vendors: domains, inline-script signatures, category, sale/share flag, typical script weight (KB, compressed). Louis Wright, MIT.
// category: analytics | advertising | social | tag-manager | session-replay | marketing | chat | consent | cdn | fonts | video | maps | payments | security | other
export const VENDORS = [
  { id: 'google-analytics', name: 'Google Analytics', company: 'Google', category: 'analytics', domains: ['google-analytics.com', 'analytics.google.com'], globals: ['gtag(', 'ga(', 'GoogleAnalyticsObject'], scripts: ['gtag/js', 'analytics.js'], sells: false, kb: 55, policyNames: ['google analytics'] },
  { id: 'google-tag-manager', name: 'Google Tag Manager', company: 'Google', category: 'tag-manager', domains: ['googletagmanager.com'], globals: ['dataLayer.push', 'GTM-'], sells: false, kb: 90, policyNames: ['google tag manager', 'google analytics'] },
  { id: 'google-ads', name: 'Google Ads / DoubleClick', company: 'Google', category: 'advertising', domains: ['doubleclick.net', 'googleadservices.com', 'googlesyndication.com', 'adservice.google.com', 'pagead2.googlesyndication.com'], globals: ['adsbygoogle', 'AW-'], sells: true, kb: 120, policyNames: ['google ads', 'doubleclick', 'adsense', 'google advertising'] },
  { id: 'meta-pixel', name: 'Meta Pixel', company: 'Meta', category: 'advertising', domains: ['connect.facebook.net', 'facebook.com/tr', 'facebook.net'], globals: ['fbq(', '_fbq'], sells: true, kb: 75, policyNames: ['facebook', 'meta pixel', 'meta platforms', 'meta'] },
  { id: 'tiktok-pixel', name: 'TikTok Pixel', company: 'TikTok', category: 'advertising', domains: ['analytics.tiktok.com'], globals: ['ttq.', 'TiktokAnalyticsObject'], sells: true, kb: 80, policyNames: ['tiktok'] },
  { id: 'linkedin-insight', name: 'LinkedIn Insight Tag', company: 'LinkedIn', category: 'advertising', domains: ['snap.licdn.com', 'px.ads.linkedin.com'], globals: ['_linkedin_partner_id', 'lintrk('], sells: true, kb: 30, policyNames: ['linkedin'] },
  { id: 'x-pixel', name: 'X (Twitter) Pixel', company: 'X', category: 'advertising', domains: ['static.ads-twitter.com', 'analytics.twitter.com', 't.co/i/adsct'], globals: ['twq('], sells: true, kb: 35, policyNames: ['twitter', 'x corp', 'x pixel'] },
  { id: 'pinterest-tag', name: 'Pinterest Tag', company: 'Pinterest', category: 'advertising', domains: ['s.pinimg.com/ct', 'ct.pinterest.com'], globals: ['pintrk('], sells: true, kb: 40, policyNames: ['pinterest'] },
  { id: 'snap-pixel', name: 'Snap Pixel', company: 'Snap', category: 'advertising', domains: ['sc-static.net', 'tr.snapchat.com'], globals: ['snaptr('], sells: true, kb: 40, policyNames: ['snapchat', 'snap inc'] },
  { id: 'microsoft-ads', name: 'Microsoft Advertising UET', company: 'Microsoft', category: 'advertising', domains: ['bat.bing.com'], globals: ['uetq'], sells: true, kb: 25, policyNames: ['microsoft advertising', 'bing ads', 'bing'] },
  { id: 'criteo', name: 'Criteo', company: 'Criteo', category: 'advertising', domains: ['criteo.com', 'criteo.net'], globals: ['criteo_q'], sells: true, kb: 45, policyNames: ['criteo'] },
  { id: 'taboola', name: 'Taboola', company: 'Taboola', category: 'advertising', domains: ['taboola.com'], globals: ['_tfa'], sells: true, kb: 90, policyNames: ['taboola'] },
  { id: 'hotjar', name: 'Hotjar', company: 'Hotjar', category: 'session-replay', domains: ['hotjar.com', 'hotjar.io'], globals: ['hj(', '_hjSettings'], sells: false, kb: 70, policyNames: ['hotjar'] },
  { id: 'clarity', name: 'Microsoft Clarity', company: 'Microsoft', category: 'session-replay', domains: ['clarity.ms'], globals: ['clarity('], sells: false, kb: 60, policyNames: ['clarity', 'microsoft clarity'] },
  { id: 'fullstory', name: 'FullStory', company: 'FullStory', category: 'session-replay', domains: ['fullstory.com'], globals: ['_fs_org', 'FS.identify'], sells: false, kb: 85, policyNames: ['fullstory'] },
  { id: 'mixpanel', name: 'Mixpanel', company: 'Mixpanel', category: 'analytics', domains: ['mixpanel.com', 'mxpnl.com'], globals: ['mixpanel.init'], sells: false, kb: 45, policyNames: ['mixpanel'] },
  { id: 'segment', name: 'Segment', company: 'Twilio', category: 'analytics', domains: ['cdn.segment.com', 'api.segment.io'], globals: ['analytics.load('], sells: false, kb: 60, policyNames: ['segment', 'twilio'] },
  { id: 'amplitude', name: 'Amplitude', company: 'Amplitude', category: 'analytics', domains: ['amplitude.com'], globals: ['amplitude.getInstance', 'amplitude.init'], sells: false, kb: 50, policyNames: ['amplitude'] },
  { id: 'heap', name: 'Heap', company: 'Heap', category: 'analytics', domains: ['heapanalytics.com', 'heap-api.com'], globals: ['heap.load('], sells: false, kb: 50, policyNames: ['heap'] },
  { id: 'plausible', name: 'Plausible', company: 'Plausible', category: 'analytics', domains: ['plausible.io'], globals: ['plausible('], sells: false, cookieless: true, kb: 1, policyNames: ['plausible'] },
  { id: 'fathom', name: 'Fathom', company: 'Fathom', category: 'analytics', domains: ['usefathom.com'], globals: [], sells: false, cookieless: true, kb: 2, policyNames: ['fathom'] },
  { id: 'hubspot', name: 'HubSpot', company: 'HubSpot', category: 'marketing', domains: ['hs-scripts.com', 'hs-analytics.net', 'hubspot.com', 'hsforms.net', 'hs-banner.com'], globals: ['_hsq'], sells: false, kb: 110, policyNames: ['hubspot'] },
  { id: 'mailchimp', name: 'Mailchimp', company: 'Intuit', category: 'marketing', domains: ['chimpstatic.com', 'list-manage.com'], globals: [], sells: false, kb: 30, policyNames: ['mailchimp'] },
  { id: 'intercom', name: 'Intercom', company: 'Intercom', category: 'chat', domains: ['intercom.io', 'intercomcdn.com', 'widget.intercom.io'], globals: ['Intercom('], sells: false, kb: 200, policyNames: ['intercom'] },
  { id: 'drift', name: 'Drift', company: 'Salesloft', category: 'chat', domains: ['drift.com', 'driftt.com'], globals: ['drift.load'], sells: false, kb: 180, policyNames: ['drift'] },
  { id: 'zendesk', name: 'Zendesk', company: 'Zendesk', category: 'chat', domains: ['zdassets.com', 'zendesk.com'], globals: ['zE('], sells: false, kb: 160, policyNames: ['zendesk'] },
  { id: 'youtube', name: 'YouTube embed', company: 'Google', category: 'video', domains: ['youtube.com', 'youtube-nocookie.com', 'ytimg.com'], globals: [], sells: false, kb: 500, policyNames: ['youtube'] },
  { id: 'vimeo', name: 'Vimeo embed', company: 'Vimeo', category: 'video', domains: ['player.vimeo.com', 'vimeocdn.com'], globals: [], sells: false, kb: 250, policyNames: ['vimeo'] },
  { id: 'google-maps', name: 'Google Maps', company: 'Google', category: 'maps', domains: ['maps.googleapis.com', 'maps.google.com', 'google.com/maps'], globals: [], sells: false, kb: 250, policyNames: ['google maps'] },
  { id: 'google-fonts', name: 'Google Fonts', company: 'Google', category: 'fonts', domains: ['fonts.googleapis.com', 'fonts.gstatic.com'], globals: [], sells: false, kb: 20, policyNames: ['google fonts'] },
  { id: 'adobe-fonts', name: 'Adobe Fonts', company: 'Adobe', category: 'fonts', domains: ['use.typekit.net', 'p.typekit.net'], globals: [], sells: false, kb: 30, policyNames: ['adobe fonts', 'typekit', 'adobe'] },
  { id: 'stripe', name: 'Stripe', company: 'Stripe', category: 'payments', domains: ['js.stripe.com', 'm.stripe.network'], globals: [], sells: false, essential: true, kb: 120, policyNames: ['stripe'] },
  { id: 'paypal', name: 'PayPal', company: 'PayPal', category: 'payments', domains: ['paypal.com', 'paypalobjects.com'], globals: [], sells: false, essential: true, kb: 100, policyNames: ['paypal'] },
  { id: 'recaptcha', name: 'Google reCAPTCHA', company: 'Google', category: 'security', domains: ['google.com/recaptcha', 'gstatic.com/recaptcha', 'recaptcha.net'], globals: ['grecaptcha'], sells: false, essential: true, kb: 150, policyNames: ['recaptcha'] },
  { id: 'hcaptcha', name: 'hCaptcha', company: 'Intuition Machines', category: 'security', domains: ['hcaptcha.com'], globals: ['hcaptcha'], sells: false, essential: true, kb: 90, policyNames: ['hcaptcha'] },
  { id: 'cloudflare-insights', name: 'Cloudflare Web Analytics', company: 'Cloudflare', category: 'analytics', domains: ['static.cloudflareinsights.com'], globals: [], sells: false, cookieless: true, kb: 6, policyNames: ['cloudflare'] },
  { id: 'cookiebot', name: 'Cookiebot', company: 'Usercentrics', category: 'consent', domains: ['consent.cookiebot.com', 'consentcdn.cookiebot.com'], globals: ['Cookiebot'], sells: false, essential: true, kb: 40, policyNames: ['cookiebot', 'usercentrics'] },
  { id: 'onetrust', name: 'OneTrust', company: 'OneTrust', category: 'consent', domains: ['cdn.cookielaw.org', 'onetrust.com'], globals: ['OneTrust', 'OptanonWrapper'], sells: false, essential: true, kb: 90, policyNames: ['onetrust'] },
  { id: 'usercentrics', name: 'Usercentrics', company: 'Usercentrics', category: 'consent', domains: ['app.usercentrics.eu', 'usercentrics.eu'], globals: ['UC_UI'], sells: false, essential: true, kb: 80, policyNames: ['usercentrics'] },
  { id: 'jsdelivr', name: 'jsDelivr CDN', company: 'jsDelivr', category: 'cdn', domains: ['cdn.jsdelivr.net'], globals: [], sells: false, essential: true, kb: 0, policyNames: ['jsdelivr'] },
  { id: 'unpkg', name: 'unpkg CDN', company: 'unpkg', category: 'cdn', domains: ['unpkg.com'], globals: [], sells: false, essential: true, kb: 0, policyNames: ['unpkg'] },
  { id: 'cdnjs', name: 'cdnjs', company: 'Cloudflare', category: 'cdn', domains: ['cdnjs.cloudflare.com'], globals: [], sells: false, essential: true, kb: 0, policyNames: ['cdnjs', 'cloudflare'] },
  { id: 'addthis', name: 'AddThis', company: 'Oracle', category: 'social', domains: ['addthis.com', 'addthisedge.com'], globals: ['addthis'], sells: true, kb: 150, policyNames: ['addthis'] },
  { id: 'sharethis', name: 'ShareThis', company: 'ShareThis', category: 'social', domains: ['sharethis.com'], globals: [], sells: true, kb: 100, policyNames: ['sharethis'] },
  { id: 'disqus', name: 'Disqus', company: 'Disqus', category: 'social', domains: ['disqus.com', 'disquscdn.com'], globals: ['disqus_config'], sells: true, kb: 300, policyNames: ['disqus'] },
];
export const TRACKING = new Set(['analytics', 'advertising', 'social', 'tag-manager', 'session-replay', 'marketing']);
const hostOf = (u) => { try { return new URL(u, 'https://x.invalid').host.toLowerCase(); } catch { return ''; } };
/** Match a URL to a vendor (domain suffix or domain+path prefix). */
export function vendorForUrl(url) {
  let u; try { u = new URL(url, 'https://x.invalid'); } catch { return null; }
  const host = u.host.toLowerCase().replace(/^www\./, ''); const hp = host + u.pathname;
  for (const v of VENDORS) for (const d of v.domains) { if (d.includes('/') ? hp.startsWith(d) || hp.includes('.' + d) : host === d || host.endsWith('.' + d)) return v; }
  return null;
}
/** Vendors referenced by inline script text. */
export function vendorsInScript(code) { const out = new Set(); for (const v of VENDORS) { if (v.globals.some((g) => code.includes(g))) out.add(v); for (const d of v.domains) if (code.includes(d)) out.add(v); } return [...out]; }
export { hostOf };
/** Third-party resources on a parsed page: [{ kind, url, host, vendor, line, el, inline }]. siteHost = first-party host (or null). */
export function thirdPartyResources(doc, siteHost) {
  const out = []; const fp = (h) => !h || h === 'x.invalid' || (siteHost && (h === siteHost || h.endsWith('.' + siteHost.replace(/^www\./, '')) || h.replace(/^www\./, '') === siteHost.replace(/^www\./, '')));
  const push = (kind, url, el, extra = {}) => { if (!url || /^(data|blob|javascript|mailto|tel):/i.test(url)) return; const host = hostOf(url); if (fp(host) && !/^\/\//.test(url) && !/^https?:/i.test(url)) return; if (fp(host)) return; out.push({ kind, url, host, vendor: vendorForUrl(url), line: el.line, el, ...extra }); };
  const inNoscript = (el) => { for (let n = el.parent; n; n = n.parent) if (n.tag === 'noscript') return true; return false; };
  for (const el of doc.all) {
    const a = el.attrs;
    if (el.tag === 'script' && a.src) push('script', a.src, el);
    else if (el.tag === 'script' && el.rawText && !/json/i.test(a.type || '')) for (const v of vendorsInScript(el.rawText)) out.push({ kind: 'inline', url: null, host: v.domains[0], vendor: v, line: el.line, el, inline: true });
    else if (el.tag === 'iframe' && a.src) push('iframe', a.src, el);
    else if (el.tag === 'img' && a.src) { const px = (a.width === '1' && a.height === '1') || /display\s*:\s*none/.test(a.style || '') || inNoscript(el); push(px ? 'pixel' : 'image', a.src, el); }
    else if (el.tag === 'link' && a.href && /stylesheet|preconnect|dns-prefetch|preload|prefetch/i.test(a.rel || '')) push(/stylesheet/i.test(a.rel) ? 'stylesheet' : 'hint', a.href, el);
    else if ((el.tag === 'video' || el.tag === 'audio' || el.tag === 'source' || el.tag === 'embed' || el.tag === 'object') && (a.src || a.data)) push('media', a.src || a.data, el);
  }
  return out;
}
