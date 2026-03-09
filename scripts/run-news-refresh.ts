/**
 * Standalone script: invoke the news.refresh mutation logic directly.
 * This is what the tRPC news.refresh mutation calls internally.
 * Run with: npx tsx scripts/run-news-refresh.ts
 * Requires DATABASE_URL in environment.
 * © 2025 AI4U, LLC. All Rights Reserved. AI4Utech.com, Lee Hanna-Owner.
 */

import "dotenv/config";
import { refreshNewsFeeds, getNewsArticleCount } from "../server/news";

async function main() {
  console.log("=== AI News Aggregator — news.refresh ===");
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log("Sources: MIT News, TechCrunch AI, AI Weekly\n");

  const before = await getNewsArticleCount();
  console.log(`Articles in DB before refresh: ${before}`);

  console.log("Fetching RSS feeds...");
  const result = await refreshNewsFeeds();

  const after = await getNewsArticleCount();
  const newArticles = after - before;

  console.log("\n=== Refresh Complete ===");
  console.log(`Success:          ${result.success}`);
  console.log(`Items fetched:    ${result.fetched}`);
  console.log(`Rows inserted:    ${result.inserted}`);
  console.log(`New (net):        ${newArticles}`);
  console.log(`Total in DB now:  ${after}`);

  if (result.errors.length > 0) {
    console.warn("\nErrors encountered:");
    result.errors.forEach(e => console.warn(" -", e));
  }

  process.exit(0);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
