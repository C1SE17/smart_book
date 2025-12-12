#!/usr/bin/env node

/**
 * Export bookstore glossary and parallel corpus from MySQL using existing backend config.
 */

const fs = require("fs/promises");
const path = require("path");

// Load environment variables (reuse backend .env if present)
const envPath = path.resolve(__dirname, "..", "backend", ".env");
require("dotenv").config({ path: envPath });

const db = require("../backend/config/db");

const DEFAULT_OUTPUT_DIR = "ai/resources";

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {
    outputDir: DEFAULT_OUTPUT_DIR,
    bookLimit: null,
    reviewLimit: 2000,
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    switch (arg) {
      case "--output-dir":
        result.outputDir = args[i + 1];
        i += 1;
        break;
      case "--book-limit":
        result.bookLimit = Number(args[i + 1]);
        i += 1;
        break;
      case "--review-limit":
        result.reviewLimit = Number(args[i + 1]);
        i += 1;
        break;
      default:
        break;
    }
  }

  return result;
}

function normalizeText(value) {
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim().replace(/\s+/g, " ");
}

async function query(sql, params = []) {
  const [rows] = await db.promise().query(sql, params);
  return rows;
}

function hasColumn(row, column) {
  return Object.prototype.hasOwnProperty.call(row, column);
}

async function buildGlossary(outputPath) {
  const glossary = [];

  const categories = await query("SELECT * FROM categories ORDER BY category_id ASC");
  for (const row of categories) {
    const vi = normalizeText(row.name);
    if (!vi) continue;
    const en = hasColumn(row, "name_en") ? normalizeText(row.name_en) : "";
    glossary.push({ vi, en, note: "category" });
  }

  const publishers = await query("SELECT * FROM publishers ORDER BY publisher_id ASC");
  for (const row of publishers) {
    const vi = normalizeText(row.name);
    if (!vi) continue;
    const en = hasColumn(row, "name_en") ? normalizeText(row.name_en) : "";
    glossary.push({ vi, en, note: "publisher" });
  }

  const authors = await query("SELECT * FROM authors ORDER BY author_id ASC");
  for (const row of authors) {
    const vi = normalizeText(row.name);
    if (!vi) continue;
    const en = hasColumn(row, "name_en") ? normalizeText(row.name_en) : "";
    glossary.push({ vi, en, note: "author" });
  }

  const orderStatuses = await query(
    "SELECT DISTINCT status FROM orders WHERE status IS NOT NULL ORDER BY status ASC"
  );
  for (const row of orderStatuses) {
    const vi = normalizeText(row.status);
    if (!vi) continue;
    glossary.push({ vi, en: "", note: "order_status" });
  }

  await fs.writeFile(outputPath, JSON.stringify(glossary, null, 2), "utf8");
  return glossary.length;
}

async function buildParallelCorpus(outputPath, { bookLimit, reviewLimit }) {
  const results = [];

  const candidates = [
    ["title_en", "title", "book_title"],
    ["subtitle_en", "subtitle", "book_subtitle"],
    ["short_description_en", "short_description", "book_short_description"],
    ["description_en", "description", "book_description"],
  ];

  for (const [enCol, viCol, label] of candidates) {
    const hasViColumn = await hasColumnInTable("books", viCol);
    if (!hasViColumn) {
      continue;
    }
    const hasEnColumn = await hasColumnInTable("books", enCol);

    const selectFields = [
      "book_id",
      `\`${viCol}\` AS vi_text`,
      hasEnColumn ? `\`${enCol}\` AS en_text` : "'' AS en_text",
    ];

    let sql = `
      SELECT ${selectFields.join(", ")}
      FROM books
      WHERE \`${viCol}\` IS NOT NULL AND TRIM(\`${viCol}\`) <> ''
    `;
    if (bookLimit) {
      sql += ` LIMIT ${Number(bookLimit)}`;
    }

    const rows = await query(sql);

    for (const row of rows) {
      const vi = normalizeText(row.vi_text);
      if (!vi) continue;
      const en = normalizeText(row.en_text);
      results.push({
        en,
        vi,
        meta: {
          book_id: row.book_id,
          source: label,
        },
      });
    }
  }

  const reviews = await query(
    `
      SELECT review_id, review_text
      FROM reviews
      WHERE review_text IS NOT NULL AND TRIM(review_text) <> ''
      ORDER BY review_id DESC
      ${reviewLimit ? `LIMIT ${Number(reviewLimit)}` : ""}
    `
  );

  for (const row of reviews) {
    const vi = normalizeText(row.review_text);
    if (!vi) continue;
    results.push({
      en: "",
      vi,
      meta: {
        review_id: row.review_id,
        source: "customer_review",
      },
    });
  }

  await fs.writeFile(outputPath, JSON.stringify(results, null, 2), "utf8");
  return results.length;
}

const tableColumnCache = new Map();

async function getTableColumns(table) {
  if (tableColumnCache.has(table)) {
    return tableColumnCache.get(table);
  }
  const rows = await query(`SHOW COLUMNS FROM ${table}`);
  const columns = new Set(rows.map((row) => row.Field));
  tableColumnCache.set(table, columns);
  return columns;
}

async function hasColumnInTable(table, column) {
  const columns = await getTableColumns(table);
  return columns.has(column);
}

async function main() {
  const { outputDir, bookLimit, reviewLimit } = parseArgs();
  const resolvedOutputDir = path.resolve(outputDir);
  await fs.mkdir(resolvedOutputDir, { recursive: true });

  const glossaryPath = path.join(resolvedOutputDir, "book_glossary.json");
  const corpusPath = path.join(resolvedOutputDir, "book_parallel.json");

  const glossaryCount = await buildGlossary(glossaryPath);
  const corpusCount = await buildParallelCorpus(corpusPath, { bookLimit, reviewLimit });

  await fs.writeFile(
    path.join(resolvedOutputDir, "export_summary.json"),
    JSON.stringify(
      {
        glossary_path: glossaryPath,
        glossary_entries: glossaryCount,
        corpus_path: corpusPath,
        corpus_entries: corpusCount,
        generated_at: new Date().toISOString(),
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(
    JSON.stringify(
      {
        glossary_path: glossaryPath,
        glossary_entries: glossaryCount,
        corpus_path: corpusPath,
        corpus_entries: corpusCount,
      },
      null,
      2
    )
  );
}

main()
  .catch((err) => {
    console.error("Export failed:", err);
    process.exitCode = 1;
  })
  .finally(() => {
    try {
      db.end();
    } catch (error) {
      // ignore
    }
  });

