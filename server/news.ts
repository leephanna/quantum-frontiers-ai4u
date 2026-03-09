/**
 * AI News Aggregator — News Router
 * Fetches RSS feeds from MIT News, TechCrunch AI, and AI Weekly,
 * parses articles, and stores them in the newsArticles table.
 * Duplicate links are silently ignored via the unique constraint.
 * © 2025 AI4U, LLC. All Rights Reserved. AI4Utech.com, Lee Hanna-Owner.
 */

import { XMLParser } from "fast-xml-parser";
import { nanoid } from "nanoid";
import { getDb } from "./db";
import { newsArticles, type InsertNewsArticle } from "../drizzle/schema";
import { sql } from "drizzle-orm";

// ─── RSS Feed Sources ────────────────────────────────────────────────────────

const RSS_FEEDS: Array<{ name: string; url: string }> = [
  {
    name: "MIT News",
    url: "https://news.mit.edu/rss/topic/artificial-intelligence2",
  },
  {
    name: "TechCrunch AI",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
  },
  {
    name: "AI Weekly",
    url: "https://aiweekly.co/issues.rss",
  },
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  "content:encoded"?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function parseDate(raw?: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

async function fetchFeed(url: string): Promise<RssItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "AI4U-NewsBot/1.0 (+https://ai4utech.com)" },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    const xml = await res.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      cdataPropName: "__cdata",
    });
    const parsed = parser.parse(xml);
    const channel = parsed?.rss?.channel ?? parsed?.feed ?? {};
    const items: RssItem[] = Array.isArray(channel.item)
      ? channel.item
      : channel.item
      ? [channel.item]
      : Array.isArray(channel.entry)
      ? channel.entry
      : channel.entry
      ? [channel.entry]
      : [];
    return items;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Core refresh logic (callable without tRPC context) ──────────────────────

export async function refreshNewsFeeds(): Promise<{ success: boolean; inserted: number; fetched: number; errors: string[] }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  let totalFetched = 0;
  let totalInserted = 0;
  const errors: string[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const items = await fetchFeed(feed.url);
      totalFetched += items.length;

      for (const item of items) {
        const rawLink = typeof item.link === "object"
          ? (item.link as Record<string, string>)?.["@_href"] ?? ""
          : String(item.link ?? "").trim();

        if (!rawLink) continue;

        const title = typeof item.title === "object"
          ? String((item.title as Record<string, string>)?.__cdata ?? "").trim()
          : String(item.title ?? "").trim();

        const rawDesc =
          typeof item["content:encoded"] === "object"
            ? String((item["content:encoded"] as Record<string, string>)?.__cdata ?? "")
            : typeof item.description === "object"
            ? String((item.description as Record<string, string>)?.__cdata ?? "")
            : String(item.description ?? "");

        const description = stripHtml(rawDesc).slice(0, 1000) || null;
        const publishedAt = parseDate(item.pubDate as string | undefined);

        const article: InsertNewsArticle = {
          id: nanoid(),
          title: title || "Untitled",
          link: rawLink.slice(0, 2048),
          description,
          source: feed.name,
          publishedAt: publishedAt ?? undefined,
        };

        try {
          await db.insert(newsArticles).values(article).onDuplicateKeyUpdate({
            set: { title: article.title },  // no-op update to satisfy MySQL syntax; duplicate is silently skipped
          });
          totalInserted++;
        } catch (insertErr: unknown) {
          // Duplicate key errors are expected and benign — skip silently
          const msg = insertErr instanceof Error ? insertErr.message : String(insertErr);
          if (!msg.toLowerCase().includes("duplicate")) {
            errors.push(`Insert error for ${rawLink}: ${msg}`);
          }
        }
      }
    } catch (feedErr: unknown) {
      const msg = feedErr instanceof Error ? feedErr.message : String(feedErr);
      errors.push(`Feed "${feed.name}" error: ${msg}`);
      console.error(`[NewsRefresh] Failed to fetch "${feed.name}":`, feedErr);
    }
  }

  console.log(`[NewsRefresh] Fetched ${totalFetched} items, inserted/updated ${totalInserted}.`);
  return { success: true, inserted: totalInserted, fetched: totalFetched, errors };
}

// ─── Count helper ─────────────────────────────────────────────────────────────

export async function getNewsArticleCount(): Promise<number> {
  const db = await getDb();
  if (!db) return 0;
  const result = await db.select({ count: sql<number>`COUNT(*)` }).from(newsArticles);
  return Number(result[0]?.count ?? 0);
}
