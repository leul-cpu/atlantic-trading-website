// ──────────────────────────────────────
// Atlantic Trading PLC - High-Performance Application Logic
// Optimized for mobile networks in Ethiopia (3G / slow 4G, high latency)
// ──────────────────────────────────────

let products = [];
let categories = [];
let currentLang = localStorage.getItem("atlantic_lang") || "am";
let currentCategory = "all";
let searchQuery = "";
let searchDebounceTimer = null;
let visibleCount = 10;
const BATCH_SIZE = 10;
const CACHE_KEY = "atlantic_catalog_v2";

const dictionary = {
  en: {
    "hero-badge": "TRUSTED SUPPLIER",
    "hero-title-main": "Quality Outdoor & Plastic Gear",
    "hero-title-sub": "For Your Business & Home",
    "hero-subtitle": "Premium shade umbrellas, tents, plastic chairs, and garbage cans in Addis Ababa.",
    "hero-cta": "Browse Catalog",
    "hero-tg-cta": "Order on Telegram",
    "call-now": "Call to Order",
    "section-categories": "Browse Categories",
    "section-catalog": "Our Product Catalog",
    "search-placeholder": "Search products...",
    "pdp-key-features": "Key Specifications",
    "pdp-pricing-table": "Size & Price Tiers",
    "th-size": "Capacity / Size",
    "th-price": "Price (ETB)",
    "order-telegram": "Order via Telegram",
    "order-call": "Call to Order",
    "footer-contact-us": "Get in Touch",
    "footer-loc-1": "Mercato, Anwar Mosque front, Wajidi Market Ctr, 1st floor shop no. 123 & 124",
    "footer-loc-2": "Nigat Birhan Market Center, Shop No. G015",
    "footer-follow-us": "Follow Us",
    "footer-rights": "All Rights Reserved.",
    "sticky-tg": "Order on Telegram",
    "sticky-call": "Call",
    "price-from": "From",
    "nav-join-tg": "Join Channel",
    "no-results": "No products found. Try a different search.",
    "pdp-negotiable": "Negotiable",
    "pdp-fixed": "Fixed Price",
    "load-more": "Load more products",
    "offline-error": "Network issue. Please check your connection or order directly via Phone / Telegram:",
    "retry": "Retry"
  },
  am: {
    "hero-badge": "ታማኝ አቅራቢ",
    "hero-title-main": "አትላንቲክ ትሬዲንግ",
    "hero-title-sub": "ጥራት ያላቸው የውጪና ፕላስቲክ ዕቃዎች",
    "hero-subtitle": "ለቤትዎ እና ለንግድዎ። ምርጥ የፀሐይ ጥላዎች፣ ድንኳኖች፣ የፕላስቲክ ወንበሮች እና የቆሻሻ መጣያ ባልዲዎች በአዲስ አበባ።",
    "hero-cta": "ካታሎግ ይመልከቱ",
    "hero-tg-cta": "በቴሌግራም እዘዝ",
    "call-now": "ደውለው ይዘዙ",
    "section-categories": "ምድቦች",
    "section-catalog": "የምርት ዝርዝር",
    "search-placeholder": "ዕቃዎችን ይፈልጉ...",
    "pdp-key-features": "ዋና መለያዎች",
    "pdp-pricing-table": "የመጠን እና የዋጋ ዝርዝር",
    "th-size": "መጠን / ሊትር",
    "th-price": "ዋጋ (ብር)",
    "order-telegram": "በቴሌግራም እዘዝ",
    "order-call": "ደውለው ለማዘዝ",
    "footer-contact-us": "ያግኙን",
    "footer-loc-1": "መርካቶ አንዋር መስጂድ ፊለፊት ዋጂዲ የገበያ መዐከል 1ኛ floor shop no. 123 & 124",
    "footer-loc-2": "ንጋት ብርሀን የገበያ መዐከል G015 ቁጥር",
    "footer-follow-us": "ይከተሉን",
    "footer-rights": "መብቱ በህግ የተጠበቀ ነው።",
    "sticky-tg": "በቴሌግራም እዘዝ",
    "sticky-call": "ደውል",
    "price-from": "ከ",
    "nav-join-tg": "ቴሌግራም ቻናል",
    "no-results": "ምንም ምርት አልተገኘም። ሌላ ቃል ይሞክሩ።",
    "pdp-negotiable": "ድርድር አለው",
    "pdp-fixed": "የማይቀየር ዋጋ",
    "load-more": "ተጨማሪ ምርቶችን አሳይ",
    "offline-error": "የኢንተርኔት ግንኙነት ተቋርጧል። እባክዎ እንደገና ይሞክሩ ወይም በቀጥታ በስልክ/ቴሌግራም ይዘዙ፡",
    "retry": "እንደገና ሞክር"
  }
};

// ──────────────────────────────────────
// In-App Browser Escape
// ──────────────────────────────────────
function isInAppBrowser() {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|musical_ly|BytedanceWebview|TikTok|LinkedInApp|Snapchat/i.test(ua);
}

function tryEscapeInAppBrowser() {
  if (!isInAppBrowser()) return;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const currentUrl = window.location.href;

  function showManualEscapeOverlay(url) {
    if (document.getElementById("iab-overlay")) return;
    const overlay = document.createElement("div");
    overlay.id = "iab-overlay";
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background-color: #ffffff; z-index: 100000; display: flex;
      flex-direction: column; align-items: center; justify-content: center;
      padding: 2rem; box-sizing: border-box; font-family: sans-serif; color: #111e3c;
    `;

    overlay.innerHTML = `
      <div style="position: absolute; top: 10px; right: 20px; font-size: 2.5rem; color: #1a73e8; animation: bounce 1.5s infinite;">↗</div>
      
      <div style="max-width: 420px; width: 100%; text-align: center; background: #f8fafc; padding: 2rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; max-height: 90vh; overflow-y: auto;">
        <h2 style="font-size: 1.3rem; margin-bottom: 0.5rem; font-weight: 700; color: #1e293b;">ሊንኩን ለመክፈት እነዚህን ደረጃዎች ይከተሉ</h2>
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem; font-weight: 700; color: #475569; font-style: italic;">Follow the steps to access this link</h3>
        
        <p style="font-size: 0.85rem; color: #64748b; margin-bottom: 1.5rem; line-height: 1.4;">
          ይህ ገጽ ሙሉ በሙሉ እንዲሰራ በስልክዎ መደበኛ ማሰሻ መከፈት አለበት።<br>
          <span style="font-style: italic;">This link must be opened in your native browser to work correctly.</span>
        </p>
        
        <div style="text-align: left; margin-bottom: 1.5rem; font-size: 0.9rem; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 1.2rem 0;">
          <div style="display: flex; align-items: flex-start; margin-bottom: 1.2rem;">
            <span style="background: #1a73e8; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">1</span>
            <div>
              <div style="font-weight: 600; color: #1e293b;">በላይኛው ቀኝ በኩል ያለውን <strong>•••</strong> ይጫኑ።</div>
              <div style="font-size: 0.8rem; color: #64748b; font-style: italic; margin-top: 2px;">Tap the <strong>•••</strong> icon at the top right.</div>
            </div>
          </div>
          
          <div style="display: flex; align-items: flex-start;">
            <span style="background: #1a73e8; color: white; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">2</span>
            <div>
              <div style="font-weight: 600; color: #1e293b;">በመቀጠል <strong>"Open in Browser"</strong> ወይም <strong>"Open in Safari"</strong> ይምረጡ።</div>
              <div style="font-size: 0.8rem; color: #64748b; font-style: italic; margin-top: 2px;">Choose <strong>"Open in Browser"</strong> or <strong>"Open in Safari"</strong>.</div>
            </div>
          </div>
        </div>

        <button id="iab-copy-btn" style="width: 100%; padding: 12px; background-color: #111e3c; color: white; border: none; border-radius: 8px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
          <span>ሊንኩን ኮፒ ያድርጉ</span>
          <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.85;">Copy link</span>
        </button>
        
        <button onclick="this.closest('#iab-overlay').remove()" style="margin-top: 1.2rem; background: none; border: none; color: #ef4444; font-size: 0.85rem; font-weight: 600; cursor: pointer; display: flex; flex-direction: column; align-items: center;">
          <span>በዚህ ይቆዩ</span>
          <span style="font-size: 0.75rem; font-weight: normal; opacity: 0.85; margin-top: 1px;">Stay here</span>
        </button>
      </div>

      <style>
        @keyframes bounce {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(8px); }
        }
      </style>
    `;
    document.body.appendChild(overlay);

    const copyBtn = overlay.querySelector("#iab-copy-btn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(url).then(() => {
          copyBtn.textContent = "ኮፒ ተደርጓል! (Copied!)";
          copyBtn.style.backgroundColor = "#10b981";
          setTimeout(() => {
            copyBtn.textContent = "ሊንኩን ኮፒ ያድርጉ (Copy link)";
            copyBtn.style.backgroundColor = "#111e3c";
          }, 2000);
        }).catch(() => {});
      };
    }
  }

  if (isAndroid) {
    const cleanUrl = currentUrl.replace(/^https?:\/\//, "");
    const intentUrl = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;end`;
    window.location.href = intentUrl;
    setTimeout(() => {
      if (!document.hidden) {
        showManualEscapeOverlay(currentUrl);
      }
    }, 1000);
  } else {
    showManualEscapeOverlay(currentUrl);
  }
}

// Helper: open Telegram link safely
function openTelegramLink(tgSchemeUrl, httpsFallbackUrl) {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  iframe.src = tgSchemeUrl;

  setTimeout(() => {
    if (iframe.parentNode) document.body.removeChild(iframe);
    if (!document.hidden) {
      window.open(httpsFallbackUrl, "_blank");
    }
  }, 600);
}

// ──────────────────────────────────────
// Initialization & Hydration
// ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  tryEscapeInAppBrowser();
  initScrollAnimations();
  window.addEventListener("scroll", handleScroll, { passive: true });
  initApp();
});

async function initApp() {
  // 1. Read pre-rendered initial data embedded in HTML
  const initialScript = document.getElementById("initial-products-data");
  if (initialScript) {
    try {
      const initialBatch = JSON.parse(initialScript.textContent);
      if (Array.isArray(initialBatch) && initialBatch.length > 0) {
        products = initialBatch;
      }
    } catch (e) {
      console.warn("Failed to parse initial products", e);
    }
  }

  // 2. Read cached full dataset from localStorage for instant offline / repeat visits
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      if (Array.isArray(parsed) && parsed.length > 0) {
        products = parsed;
      }
    }
  } catch (e) {}

  // 3. Apply persisted language preference
  applyLanguage(currentLang, false);

  // 4. Stale-while-revalidate: Fetch fresh products.min.json silently in the background
  fetchCatalogWithRetry("products.min.json", 3)
    .then(freshProducts => {
      if (Array.isArray(freshProducts) && freshProducts.length > 0) {
        const isChanged = JSON.stringify(freshProducts) !== JSON.stringify(products);
        products = freshProducts;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(freshProducts));
        } catch (e) {}

        // If user has filtered or searched, or loaded more, re-render with fresh data
        if (currentCategory !== "all" || searchQuery || isChanged) {
          renderProducts();
        }
      }
    })
    .catch(err => {
      console.warn("Could not refresh products in background:", err);
    });

  // 5. Fetch categories if needed
  fetch("categories.json")
    .then(res => res.ok ? res.json() : [])
    .then(cats => {
      if (Array.isArray(cats) && cats.length > 0) {
        categories = [{ id: "all", name_en: "All Products", name_am: "ሁሉም ምርቶች" }, ...cats];
      }
    })
    .catch(() => {});
}

// Robust fetch with timeout and exponential backoff retry
async function fetchCatalogWithRetry(url, retries = 2, delay = 800) {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, delay * Math.pow(2, i)));
    }
  }
}

// ──────────────────────────────────────
// Language
// ──────────────────────────────────────
function applyLanguage(lang, triggerRender = true) {
  currentLang = lang;
  document.documentElement.lang = lang;
  try {
    localStorage.setItem("atlantic_lang", lang);
  } catch (e) {}

  const btn = document.getElementById("langToggleBtn");
  if (btn) {
    btn.innerHTML = lang === "en"
      ? `<span class="active-lang">EN</span><span class="divider">/</span><span class="inactive-lang">አማ</span>`
      : `<span class="inactive-lang">EN</span><span class="divider">/</span><span class="active-lang">አማ</span>`;
  }

  // Update text nodes with data-key
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (dictionary[lang] && dictionary[lang][key]) {
      el.textContent = dictionary[lang][key];
    }
  });

  // Update elements with bilingual data attributes (SSR nodes)
  document.querySelectorAll("[data-en][data-am]").forEach(el => {
    el.textContent = lang === "en" ? el.getAttribute("data-en") : el.getAttribute("data-am");
  });

  // Update search placeholder
  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    const key = el.getAttribute("data-key-placeholder");
    if (dictionary[lang] && dictionary[lang][key]) {
      el.setAttribute("placeholder", dictionary[lang][key]);
    }
  });

  if (triggerRender) {
    renderProducts();
  }
}

function toggleLanguage() {
  applyLanguage(currentLang === "en" ? "am" : "en", true);
}

// ──────────────────────────────────────
// Filtering & Search
// ──────────────────────────────────────
function selectCategory(categoryId) {
  currentCategory = categoryId;
  visibleCount = BATCH_SIZE;

  // Update tab active classes
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.classList.toggle("active", tab.getAttribute("data-cat") === categoryId);
  });

  renderProducts();

  // Smooth scroll to catalog section
  const section = document.getElementById("products");
  if (section) {
    const offset = section.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }
}

function handleSearch() {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    const input = document.getElementById("searchInput");
    searchQuery = input ? input.value.trim().toLowerCase() : "";
    visibleCount = BATCH_SIZE;
    renderProducts();
  }, 150);
}

function resetFilters() {
  searchQuery = "";
  const searchInput = document.getElementById("searchInput");
  if (searchInput) searchInput.value = "";
  selectCategory("all");
}

function loadMoreProducts() {
  visibleCount += BATCH_SIZE;
  renderProducts();
}

// ──────────────────────────────────────
// Render Products Grid
// ──────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const filtered = products.filter(prod => {
    const matchCat = currentCategory === "all" || prod.category === currentCategory;
    if (!matchCat) return false;
    if (!searchQuery) return true;

    const nameEn = (prod.name_en || "").toLowerCase();
    const nameAm = prod.name_am || "";
    const descEn = (prod.description_en || "").toLowerCase();
    const descAm = prod.description_am || "";
    return nameEn.includes(searchQuery)
      || nameAm.includes(searchQuery)
      || descEn.includes(searchQuery)
      || descAm.includes(searchQuery);
  });

  // Empty state
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <div class="empty-icon" style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <p style="color: var(--text-muted); font-size: 1rem;">${dictionary[currentLang]["no-results"]}</p>
        <button onclick="resetFilters()" class="filter-tab active" style="margin-top: 1rem; padding: 0.6rem 1.5rem;">
          ${currentLang === "en" ? "Show all products" : "ሁሉም ምርቶች ይታዩ"}
        </button>
      </div>
    `;
    return;
  }

  const itemsToRender = filtered.slice(0, visibleCount);
  const fragment = document.createDocumentFragment();

  itemsToRender.forEach((prod, idx) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.onclick = () => openPDP(prod.id);
    card.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPDP(prod.id);
      }
    };

    const nameEn = prod.name_en || "";
    const nameAm = prod.name_am || prod.name_en || "";
    const name = currentLang === "en" ? nameEn : nameAm;

    const fallbackPrice = currentLang === "en" ? "Contact for price" : "ያግኙን";
    const priceTextRaw = currentLang === "en" ? prod.price_display_en : (prod.price_display_am || prod.price_display_en);
    const priceText = priceTextRaw || fallbackPrice;
    const hasFrom = priceTextRaw && (currentLang === "en" ? /^from\b/i.test(priceTextRaw.trim()) : priceTextRaw.trim().startsWith("ከ"));
    const priceLabel = (prod.price_type === "tiered" && priceTextRaw && !hasFrom) ? (currentLang === "en" ? "From " : "ከ ") : "";

    const tagEn = prod.tag_en || "";
    const tagAm = prod.tag_am || tagEn;
    const tag = currentLang === "en" ? tagEn : tagAm;

    const isNegotiable = prod.negotiable !== false;
    const negStatusLabel = isNegotiable ? dictionary[currentLang]["pdp-negotiable"] : dictionary[currentLang]["pdp-fixed"];
    const negStatusColor = isNegotiable ? "#10b981" : "#94a3b8";

    const thumbImg = prod.image_thumb || prod.image || "assets/logo.webp";

    card.innerHTML = `
      <div class="product-card-image-wrap">
        ${tag ? `<div class="product-ribbon" data-en="${tagEn}" data-am="${tagAm}">${tag}</div>` : ""}
        <img src="${thumbImg}" alt="${name}" class="product-card-img" loading="${idx < 4 ? 'eager' : 'lazy'}" decoding="async" width="280" height="280">
        <div class="product-card-overlay">
          <div class="product-card-details">
            <h3 class="product-card-title" data-en="${nameEn}" data-am="${nameAm}">${name}</h3>
            <div class="product-card-footer">
              <span class="product-card-price">${priceLabel}${priceText}</span>
              <span class="product-card-neg" style="color: ${negStatusColor};">${negStatusLabel}</span>
            </div>
          </div>
        </div>
      </div>
    `;
    fragment.appendChild(card);
  });

  // Load more button
  if (filtered.length > visibleCount) {
    const loadMoreContainer = document.createElement("div");
    loadMoreContainer.id = "loadMoreContainer";
    loadMoreContainer.style.cssText = "grid-column: 1 / -1; text-align: center; margin-top: 1.5rem;";
    loadMoreContainer.innerHTML = `
      <button class="btn-secondary load-more-btn" onclick="loadMoreProducts()" style="padding: 0.8rem 2rem; cursor: pointer;">
        <span>${dictionary[currentLang]["load-more"]}</span>
      </button>
    `;
    fragment.appendChild(loadMoreContainer);
  }

  grid.innerHTML = "";
  grid.appendChild(fragment);
}

// ──────────────────────────────────────
// Product Detail Modal (PDP)
// ──────────────────────────────────────
function openPDP(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  const gallery = document.getElementById("pdpGallery");
  const dotsEl = document.getElementById("pdpGalleryDots");
  gallery.innerHTML = "";
  dotsEl.innerHTML = "";

  const rawImages = prod.images && prod.images.length ? prod.images : [];
  const imgSrcs = rawImages.length
    ? rawImages.map(img => typeof img === "object" ? img.image : img).filter(Boolean)
    : [prod.image_full || prod.image_thumb || prod.image].filter(Boolean);

  const altText = currentLang === "en" ? prod.name_en : prod.name_am;

  const prevBtn = document.getElementById("pdpGalleryPrev");
  const nextBtn = document.getElementById("pdpGalleryNext");

  if (prevBtn && nextBtn) {
    if (imgSrcs.length > 1) {
      prevBtn.style.display = "flex";
      nextBtn.style.display = "flex";

      prevBtn.onclick = () => {
        const idx = Math.round(gallery.scrollLeft / gallery.offsetWidth);
        const newIdx = Math.max(0, idx - 1);
        gallery.scrollTo({ left: gallery.offsetWidth * newIdx, behavior: "smooth" });
      };

      nextBtn.onclick = () => {
        const idx = Math.round(gallery.scrollLeft / gallery.offsetWidth);
        const newIdx = Math.min(imgSrcs.length - 1, idx + 1);
        gallery.scrollTo({ left: gallery.offsetWidth * newIdx, behavior: "smooth" });
      };
    } else {
      prevBtn.style.display = "none";
      nextBtn.style.display = "none";
    }
  }

  imgSrcs.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = altText;
    img.className = "pdp-main-img";
    img.loading = i === 0 ? "eager" : "lazy";
    img.decoding = "async";
    gallery.appendChild(img);

    if (imgSrcs.length > 1) {
      const dot = document.createElement("span");
      dot.className = "pdp-gallery-dot" + (i === 0 ? " active" : "");
      dot.onclick = () => {
        gallery.scrollTo({ left: gallery.offsetWidth * i, behavior: "smooth" });
      };
      dotsEl.appendChild(dot);
    }
  });

  gallery.onscroll = () => {
    const idx = Math.round(gallery.scrollLeft / gallery.offsetWidth);
    dotsEl.querySelectorAll(".pdp-gallery-dot").forEach((d, i) => {
      d.classList.toggle("active", i === idx);
    });
  };

  document.getElementById("pdpTagContainer").innerHTML = prod.tag_en
    ? `<span class="hero-badge-ribbon">${currentLang === "en" ? prod.tag_en : prod.tag_am}</span>` : "";
  document.getElementById("pdpTitle").textContent = currentLang === "en" ? prod.name_en : prod.name_am;

  const fallbackPrice = currentLang === "en" ? "Contact for price" : "ያግኙን";
  const pdpPriceTextRaw = currentLang === "en" ? prod.price_display_en : (prod.price_display_am || prod.price_display_en);
  const pdpPriceText = pdpPriceTextRaw || fallbackPrice;
  const pdpPriceLabel = (prod.price_type === "tiered" && pdpPriceTextRaw) ? (currentLang === "en" ? "From " : "ከ ") : "";
  document.getElementById("pdpPrice").textContent = pdpPriceLabel + pdpPriceText;

  const negEl = document.getElementById("pdpNegotiable");
  if (negEl) {
    negEl.textContent = prod.negotiable ? dictionary[currentLang]["pdp-negotiable"] : "";
    negEl.style.display = prod.negotiable ? "block" : "none";
  }

  document.getElementById("pdpDescription").textContent = currentLang === "en" ? prod.description_en : prod.description_am;

  const tiktokContainer = document.getElementById("pdpTiktokContainer");
  const tiktokBtn = document.getElementById("pdpTiktokBtn");
  if (prod.tiktok_review && prod.tiktok_review.trim() !== "") {
    tiktokContainer.style.display = "block";
    tiktokBtn.href = prod.tiktok_review;
  } else {
    tiktokContainer.style.display = "none";
    tiktokBtn.href = "#";
  }

  const featuresList = document.getElementById("pdpFeaturesList");
  featuresList.innerHTML = "";
  const features = currentLang === "en" ? prod.features_en : prod.features_am;
  if (Array.isArray(features)) {
    features.forEach(feat => {
      const li = document.createElement("li");
      li.textContent = feat;
      featuresList.appendChild(li);
    });
  }

  const tiersContainer = document.getElementById("pdpTiersContainer");
  const tiersBody = document.getElementById("pdpTiersBody");
  if (prod.price_type === "tiered" && prod.price_tiers) {
    tiersContainer.style.display = "block";
    tiersBody.innerHTML = "";
    prod.price_tiers.forEach(tier => {
      const row = document.createElement("tr");
      row.innerHTML = `<td><strong>${tier.size}</strong></td><td>${tier.price.toLocaleString()} ETB</td>`;
      tiersBody.appendChild(row);
    });
  } else {
    tiersContainer.style.display = "none";
  }

  // Telegram order link formatting
  const baseUrl = document.baseURI.replace(/\/[^/]*$/, "");
  let imagePath = "";
  for (const src of imgSrcs) {
    if (src && !src.startsWith("data:")) {
      imagePath = src;
      break;
    }
  }

  const photoLabel = currentLang === "en" ? "Photo:" : "ፎቶ፡";
  let photoLine = "";
  if (imagePath) {
    photoLine = imagePath.startsWith("http") ? `${photoLabel} ${imagePath}` : `${photoLabel} ${baseUrl}/${imagePath}`;
  }

  const rawNameEn = prod.name_en || prod.name_am || "";
  const rawNameAm = prod.name_am || prod.name_en || "";
  const cleanNameEn = rawNameEn.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
  const cleanNameAm = rawNameAm.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim();
  const cleanName = currentLang === "en" ? cleanNameEn : cleanNameAm;
  const priceDisplay = currentLang === "en" ? (prod.price_display_en || "") : (prod.price_display_am || prod.price_display_en || "");

  const greeting = currentLang === "en" ? "Hello Atlantic Trading! I'd like to order:" : "ሰላም አትላንቲክ ትሬዲንግ! ይህንን ማዘዝ እፈልጋለሁ፡";
  const prodLabel = currentLang === "en" ? "Product:" : "ምርት፡";
  const priceLabelText = currentLang === "en" ? "Price:" : "ዋጋ፡";
  const confirmSize = currentLang === "en" ? "(please confirm size)" : "(እባክዎ መጠኑን ያሳውቁ)";
  const footerText = currentLang === "en" ? "Please let me know the next steps. Thank you!" : "እባክዎ ቀጣይ እርምጃዎችን ያሳውቁኝ። እናመሰግናለን!";

  const msgArr = [
    greeting,
    "",
    `${prodLabel} ${cleanName}`,
    prod.price_type === "flat"
      ? `${priceLabelText} ${priceDisplay}`
      : `${priceLabelText} ${priceDisplay} ${confirmSize}`
  ];

  if (photoLine) msgArr.push("", photoLine);
  msgArr.push("", footerText);

  const msg = msgArr.join("\n");
  const tgScheme = `tg://resolve?domain=Atlantictradingplc1&text=${encodeURIComponent(msg)}`;
  const tgHttps = `https://t.me/Atlantictradingplc1?text=${encodeURIComponent(msg)}`;
  const ctaBtn = document.getElementById("pdpTelegramCta");
  ctaBtn.href = tgScheme;
  ctaBtn.onclick = function (e) {
    e.preventDefault();
    openTelegramLink(tgScheme, tgHttps);
  };

  document.getElementById("pdpModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePDP() {
  document.getElementById("pdpModal").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", e => { if (e.key === "Escape") closePDP(); });

// ──────────────────────────────────────
// Sticky CTA & Nav Scroll
// ──────────────────────────────────────
let ticking = false;
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const navBar = document.querySelector(".nav-bar");
      const bar = document.querySelector(".sticky-cta-bar");
      const hero = document.querySelector(".hero-section");

      if (navBar) {
        navBar.classList.toggle("scrolled", window.scrollY > 50);
      }

      if (bar && hero) {
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        bar.style.transform = window.scrollY > heroBottom - 60 ? "translateY(0)" : "translateY(100%)";
      }
      ticking = false;
    });
    ticking = true;
  }
}

// ──────────────────────────────────────
// Intersection Observer Entrance Animations
// ──────────────────────────────────────
function initScrollAnimations() {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.02 });

  document.querySelectorAll(".section-header, .categories-section").forEach(el => {
    el.classList.add("fade-in-up");
    observer.observe(el);
  });
}

// ──────────────────────────────────────
// Register Service Worker for Offline & Speed
// ──────────────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

