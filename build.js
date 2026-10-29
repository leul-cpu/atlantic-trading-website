#!/usr/bin/env node
/**
 * build.js
 * ─────────────────────────────────────────────────────────────────────
 * 1. Reads every *.json file inside content/products/ and merges them into
 *    products.json (full) and products.min.json (compact minified).
 * 2. Normalizes image references to high-performance WebP thumbnails.
 * 3. Reads content/categories/ and builds categories.json.
 * 4. Statically bakes the category chips, filter tabs, and initial 10 products
 *    directly into index.html so users on slow 3G get an instant first paint
 *    with zero spinner!
 */

const fs   = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "content", "products");
const CATEGORIES_DIR = path.join(__dirname, "content", "categories");
const OUTPUT_FILE = path.join(__dirname, "products.json");
const OUTPUT_MIN_FILE = path.join(__dirname, "products.min.json");
const CATEGORIES_OUTPUT_FILE = path.join(__dirname, "categories.json");
const INDEX_HTML_FILE = path.join(__dirname, "index.html");

if (!fs.existsSync(CONTENT_DIR)) {
  console.error("ERROR: content/products/ directory not found.");
  process.exit(1);
}

const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith(".json"));

if (files.length === 0) {
  console.warn("Warning: no .json files found in content/products/");
  fs.writeFileSync(OUTPUT_FILE, "[]", "utf8");
  process.exit(0);
}

function resolveWebpThumb(rawPath) {
  if (!rawPath) return "";
  if (rawPath.includes("-thumb.webp")) return rawPath;
  const match = rawPath.match(/assets\/products\/(.+)\.(jpe?g|png|webp)$/i);
  if (match) {
    const stem = match[1].replace(/-(thumb|full)$/, "");
    const thumbCandidate = `assets/products/${stem}-thumb.webp`;
    if (fs.existsSync(path.join(__dirname, thumbCandidate))) {
      return thumbCandidate;
    }
  }
  return rawPath;
}

function resolveWebpFull(rawPath) {
  if (!rawPath) return "";
  if (rawPath.includes("-full.webp")) return rawPath;
  const match = rawPath.match(/assets\/products\/(.+)\.(jpe?g|png|webp)$/i);
  if (match) {
    const stem = match[1].replace(/-(thumb|full)$/, "");
    const fullCandidate = `assets/products/${stem}-full.webp`;
    if (fs.existsSync(path.join(__dirname, fullCandidate))) {
      return fullCandidate;
    }
  }
  return rawPath;
}

const products = files.map(file => {
  const filePath = path.join(CONTENT_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const item = JSON.parse(raw);

    // Resolve optimal thumbnail and full images
    let primaryImage = "";
    if (item.images && item.images.length > 0) {
      primaryImage = typeof item.images[0] === "object" ? item.images[0].image : item.images[0];
    } else if (item.image_thumb) {
      primaryImage = item.image_thumb;
    } else if (item.image) {
      primaryImage = item.image;
    }

    item.image_thumb = resolveWebpThumb(primaryImage);
    item.image_full  = resolveWebpFull(primaryImage);

    // Clean up empty string prices or parse numeric strings
    if (item.price === "" || (typeof item.price === "string" && item.price.trim() === "")) {
      delete item.price;
    } else if (typeof item.price === "string" && /^\d+$/.test(item.price.trim())) {
      item.price = parseInt(item.price.trim(), 10);
    }

    return item;
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

// Save pretty JSON and minified JSON
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(products, null, 2), "utf8");
fs.writeFileSync(OUTPUT_MIN_FILE, JSON.stringify(products), "utf8");
console.log(`Built products.json & products.min.json — ${products.length} products.`);

// ─────────────────────────────────────────────────────────────────────
// Build categories.json
// ─────────────────────────────────────────────────────────────────────
let categories = [];
if (fs.existsSync(CATEGORIES_DIR)) {
  const catFiles = fs.readdirSync(CATEGORIES_DIR).filter(f => f.endsWith(".json"));
  categories = catFiles.map(file => {
    const filePath = path.join(CATEGORIES_DIR, file);
    try {
      const raw = fs.readFileSync(filePath, "utf8");
      const cat = JSON.parse(raw);
      if (cat.image) cat.image = resolveWebpThumb(cat.image);
      return cat;
    } catch (err) {
      console.error(`ERROR parsing ${file}: ${err.message}`);
      process.exit(1);
    }
  });

  categories.sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(CATEGORIES_OUTPUT_FILE, JSON.stringify(categories, null, 2), "utf8");
  console.log(`Built categories.json — ${categories.length} categories.`);
}

// ─────────────────────────────────────────────────────────────────────
// Pre-render static HTML into index.html
// ─────────────────────────────────────────────────────────────────────
if (fs.existsSync(INDEX_HTML_FILE)) {
  let html = fs.readFileSync(INDEX_HTML_FILE, "utf8");

  // 1. Pre-render Categories Scroll
  const categoriesHtml = categories.map(cat => `
      <div class="category-card" role="button" tabindex="0" onclick="selectCategory('${cat.id}')">
        <img src="${cat.image}" alt="${cat.name_en}" class="category-card-bg" loading="lazy" width="160" height="200" decoding="async">
        <div class="category-card-overlay">
          <h3 class="category-card-title" data-en="${cat.name_en}" data-am="${cat.name_am}">${cat.name_am}</h3>
        </div>
      </div>`).join("\n");

  // 2. Pre-render Filter Tabs
  const allTabs = [
    { id: "all", name_en: "All Products", name_am: "ሁሉም ምርቶች" },
    ...categories
  ];
  const tabsHtml = allTabs.map((cat, idx) => `
        <button class="filter-tab ${idx === 0 ? 'active' : ''}" onclick="selectCategory('${cat.id}')" data-cat="${cat.id}" data-en="${cat.name_en}" data-am="${cat.name_am}">${cat.name_am}</button>`).join("\n");

  // 3. Pre-render initial batch of products (first 10)
  const initialProducts = products.slice(0, 10);
  const productsHtml = initialProducts.map((prod, idx) => {
    const nameEn = (prod.name_en || "").replace(/"/g, '&quot;');
    const nameAm = (prod.name_am || prod.name_en || "").replace(/"/g, '&quot;');
    const tagEn = prod.tag_en || "";
    const tagAm = prod.tag_am || tagEn;

    const fallbackPriceEn = "Contact for price";
    const fallbackPriceAm = "ያግኙን";
    const priceTextRawEn = prod.price_display_en;
    const priceTextRawAm = prod.price_display_am || prod.price_display_en;
    const priceTextEn = priceTextRawEn || fallbackPriceEn;
    const priceTextAm = priceTextRawAm || fallbackPriceAm;
    const hasFromEn = priceTextRawEn && /^from\b/i.test(priceTextRawEn.trim());
    const hasFromAm = priceTextRawAm && priceTextRawAm.trim().startsWith("ከ");
    const priceLabelEn = (prod.price_type === "tiered" && priceTextRawEn && !hasFromEn) ? "From " : "";
    const priceLabelAm = (prod.price_type === "tiered" && priceTextRawAm && !hasFromAm) ? "ከ " : "";

    const isNegotiable = prod.negotiable !== false;
    const negStatusLabelEn = isNegotiable ? "Negotiable" : "Fixed Price";
    const negStatusLabelAm = isNegotiable ? "ድርድር አለው" : "የማይቀየር ዋጋ";
    const negStatusColor = isNegotiable ? "#10b981" : "#94a3b8";

    const thumbImg = prod.image_thumb || prod.image || "assets/logo.webp";
    const isPriority = idx < 2;

    return `
      <div class="product-card" tabindex="0" role="button" onclick="openPDP('${prod.id}')" data-id="${prod.id}" data-category="${prod.category}">
        <div class="product-card-image-wrap">
          ${tagAm ? `<div class="product-ribbon" data-en="${tagEn}" data-am="${tagAm}">${tagAm}</div>` : ""}
          <img src="${thumbImg}" alt="${nameAm}" class="product-card-img" ${isPriority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="280" height="280">
          <div class="product-card-overlay">
            <div class="product-card-details">
              <h3 class="product-card-title" data-en="${nameEn}" data-am="${nameAm}">${nameAm}</h3>
              <div class="product-card-footer">
                <span class="product-card-price" data-en="${priceLabelEn}${priceTextEn}" data-am="${priceLabelAm}${priceTextAm}">${priceLabelAm}${priceTextAm}</span>
                <span class="product-card-neg" style="color: ${negStatusColor};" data-en="${negStatusLabelEn}" data-am="${negStatusLabelAm}">${negStatusLabelAm}</span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }).join("\n");

  const loadMoreHtml = products.length > 10 ? `
      <div class="load-more-container" id="loadMoreContainer" style="grid-column: 1 / -1; text-align: center; margin-top: 1.5rem;">
        <button class="btn-secondary load-more-btn" id="loadMoreBtn" onclick="loadMoreProducts()" style="padding: 0.8rem 2rem; cursor: pointer;">
          <span class="load-more-text" data-en="Load more products" data-am="ተጨማሪ ምርቶችን አሳይ">ተጨማሪ ምርቶችን አሳይ</span>
        </button>
      </div>` : "";

  // Replace or inject content inside designated IDs cleanly using boundary markers
  if (html.includes("<!-- SSR_CATEGORIES_START -->")) {
    html = html.replace(
      /<!-- SSR_CATEGORIES_START -->[\s\S]*?<!-- SSR_CATEGORIES_END -->/,
      `<!-- SSR_CATEGORIES_START -->\n${categoriesHtml}\n    <!-- SSR_CATEGORIES_END -->`
    );
  } else {
    html = html.replace(
      /(<div class="categories-scroll" id="categoriesScroll">)[\s\S]*?(<\/div>\s*<\/section>)/,
      `$1\n    <!-- SSR_CATEGORIES_START -->\n${categoriesHtml}\n    <!-- SSR_CATEGORIES_END -->\n    </div>\n  </section>`
    );
  }

  if (html.includes("<!-- SSR_TABS_START -->")) {
    html = html.replace(
      /<!-- SSR_TABS_START -->[\s\S]*?<!-- SSR_TABS_END -->/,
      `<!-- SSR_TABS_START -->\n${tabsHtml}\n      <!-- SSR_TABS_END -->`
    );
  } else {
    html = html.replace(
      /(<div class="filter-tabs" id="filterTabs">)[\s\S]*?(<\/div>\s*<\/div>\s*<!-- 2-Column Product Grid -->)/,
      `$1\n      <!-- SSR_TABS_START -->\n${tabsHtml}\n      <!-- SSR_TABS_END -->\n      </div>\n    </div>\n\n    <!-- 2-Column Product Grid -->`
    );
  }

  if (html.includes("<!-- SSR_PRODUCTS_START -->")) {
    html = html.replace(
      /<!-- SSR_PRODUCTS_START -->[\s\S]*?<!-- SSR_PRODUCTS_END -->/,
      `<!-- SSR_PRODUCTS_START -->\n${productsHtml}\n${loadMoreHtml}\n    <!-- SSR_PRODUCTS_END -->`
    );
  } else {
    html = html.replace(
      /(<div class="product-grid" id="productGrid">)[\s\S]*?(<\/div>\s*<\/section>)/,
      `$1\n    <!-- SSR_PRODUCTS_START -->\n${productsHtml}\n${loadMoreHtml}\n    <!-- SSR_PRODUCTS_END -->\n    </div>\n  </section>`
    );
  }

  // Inject inlined initial data script before closing body
  const inlinedDataScript = `<script id="initial-products-data" type="application/json">${JSON.stringify(initialProducts)}</script>`;
  if (html.includes('id="initial-products-data"')) {
    html = html.replace(/<script id="initial-products-data" type="application\/json">[\s\S]*?<\/script>/, inlinedDataScript);
  } else {
    html = html.replace('<!-- Javascript Logic -->', `${inlinedDataScript}\n  <!-- Javascript Logic -->`);
  }

  fs.writeFileSync(INDEX_HTML_FILE, html, "utf8");
  console.log("Successfully pre-rendered categories and product cards into index.html!");
}
