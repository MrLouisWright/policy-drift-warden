import type { Report, Rule } from './core.js';
export * from './core.js';
export interface PolicyOptions {
  baseUrl?: string; include?: string[]; exclude?: string[]; cleanUrls?: boolean;
  /** Policy file (HTML, Markdown or text) instead of a page in the build. */
  policyFile?: string;
  /** Globs of pages forming the policy. */
  policyPages?: string[];
  /** Days before the policy counts as outdated (default 365). */
  maxAgeDays?: number;
  /** Require disclosure of every third party (default true) or only trackers (false). */
  discloseAll?: boolean;
  now?: Date; toolVersion?: string; [option: string]: unknown;
}
export declare const RULES: Record<string, Rule>;
export declare const SITE_OPTIONS: Record<string, { type: 'string' | 'boolean'; multiple?: boolean }>;
export declare const SITE_HELP: string;
export declare function check(dir: string, opts?: PolicyOptions, config?: Record<string, unknown>, configFile?: string): Report;
export declare function analyze(site: unknown, opts?: PolicyOptions, config?: Record<string, unknown>): { findings: Report['findings']; info: Record<string, unknown>; summary: string };
export declare function inventory(site: unknown, config?: Record<string, unknown>): { id: string; name: string; category: string; sells: boolean; pages: string[] }[];
export declare function findPolicy(site: unknown, file?: string, globs?: string[]): { source: string; text: string; pages: unknown[] } | null;
export declare function mentions(text: string, vendor: { name: string; domains?: string[]; policyNames?: string[] }): boolean;
export declare function policyDate(text: string): Date | null;
