#!/usr/bin/env node
import "dotenv/config";
import { ingestFiling } from "@/lib/ingestion/pipeline";

const [, , filingId] = process.argv;

if (!filingId) {
  console.error("Usage: npm run ingest -- <filingId>");
  process.exit(1);
}

(async () => {
  try {
    const result = await ingestFiling(filingId);
    console.log("Ingestion completed", result);
    process.exit(0);
  } catch (error) {
    console.error("Ingestion failed", error);
    process.exit(1);
  }
})();
