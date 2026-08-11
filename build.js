#!/usr/bin/env node
/**
 * build.js
 * ─────────────────────────────────────────────────────────────────────
 * Reads every *.json file inside content/products/ and merges them into
 * a single products.json at the repo root.
 *
 * Run locally:   node build.js
 * Run in CI:     node build.js  (GitHub Action calls this automatically)
 */

const fs   = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "content", "products");
const OUTPUT_FILE = path.join(__dirname, "products.json");

if (!fs.existsSync(CONTENT_DIR)) {
  console.error(`ERROR: content/products/ directory not found.`);
  console.error(`Run migrate_data.py first to create the product files.`);
  process.exit(1);
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".json"));

if (files.length === 0) {
  console.warn("Warning: no .json files found in content/products/");
  fs.writeFileSync(OUTPUT_FILE, "[]", "utf8");
  process.exit(0);
}

const products = files.map(file => {
  const filePath = path.join(CONTENT_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`ERROR parsing ${file}: ${err.message}`);
    process.exit(1);
  }
});

// Sort: newest date_published first; ties fall back to category then id
products.sort((a, b) => {
  const da = (a.date_published && a.date_published.trim() !== "") ? new Date(a.date_published).getTime() : 0;
  const db = (b.date_published && b.date_published.trim() !== "") ? new Date(b.date_published).getTime() : 0;
  
  const timeDiff = (db || 0) - (da || 0);
  if (!isNaN(timeDiff) && timeDiff !== 0) return timeDiff;
  
  if (a.category < b.category) return -1;
  if (a.category > b.category) return  1;
  if (a.id < b.id) return -1;
  if (a.id > b.id) return  1;
  return 0;
});

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf8");
console.log(`Built products.json — ${products.length} products from ${files.length} files.`);
