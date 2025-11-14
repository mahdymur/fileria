import { readFile } from "node:fs/promises";
import path from "node:path";
import { __TEST_ONLY__ } from "@/lib/ingestion/pipeline";

async function main() {
  const [, , inputPath] = process.argv;
  const pdfPath = path.resolve(process.cwd(), inputPath ?? "fixtures/sample-text.pdf");
  process.env.RAG_ENABLE_PDF_OCR ??= "true";
  const buffer = await readFile(pdfPath);
  const { text, pageCount } = await __TEST_ONLY__.extractText(buffer, "application/pdf");
  __TEST_ONLY__.guardAgainstBinaryGarbage(text);
  console.log("Verified PDF:", pdfPath);
  console.log("Page count:", pageCount);
  console.log("Preview:\n", text.slice(0, 500));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("PDF extraction verification failed", error);
    process.exit(1);
  });
