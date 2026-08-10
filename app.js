// ──────────────────────────────────────
// Product Catalog Data
// ──────────────────────────────────────
const products = [
  {
    id: "dustbin-tiered",
    name_en: "Heavy-Duty Dustbin (Garbage Can)",
    name_am: "የቆሻሻ መጣያ (dustbin)",
    category: "bins",
    tag_en: "Bestseller",
    tag_am: "ተፈላጊ",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
    description_en: "Highly durable commercial plastic bins for hospitals, cafés, homes, and public parks. Weatherproof and impact-resistant.",
    description_am: "ለሆስፒታሎች፣ ካፌዎች፣ ቤቶች እና መናፈሻዎች የሚሆን እጅግ ጠንካራ የፕላስቲክ ባልዲ። የአየር ፀባይ የማይበግረው።",
    features_en: [
      "Heavy-duty industrial grade plastic",
      "Available in multiple colors (Blue, Green, Yellow, Red)",
      "Secure lid to prevent odor leak",
      "Large sizes include premium heavy-duty wheels"
    ],
    features_am: [
      "እጅግ ጠንካራ የኢንዱስትሪ ደረጃ ፕላስቲክ",
      "በተለያየ ቀለም የሚገኝ (ሰማያዊ፣ አረንጓዴ፣ ቢጫ፣ ቀይ)",
      "ሽታ እንዳያወጣ ጥብቅ ክዳን ያለው",
      "ትላልቆቹ መጠኖች አስተማማኝ ተንቀሳቃሽ ጎማ አላቸው"
    ],
    price_type: "tiered",
    price_display_en: "From 800 ETB",
    price_display_am: "ከ 800 ብር ጀምሮ",
    price_tiers: [
      { size: "10L",   price: 800 },
      { size: "15L",   price: 2300 },
      { size: "20L",   price: 3100 },
      { size: "30L",   price: 5000 },
      { size: "50L",   price: 7000 },
      { size: "80L",   price: 7500 },
      { size: "100L",  price: 8000 },
      { size: "240L",  price: 19500 },
      { size: "660L",  price: 70000 },
      { size: "1100L", price: 80000 }
    ]
  },
  {
    id: "3x3m-umbrella",
    name_en: "3x3m Cantilever Shade Umbrella",
    name_am: "3x3 ሜትር የፀሐይ መከላከያ ጥላ",
    category: "umbrellas",
    tag_en: "Premium",
    tag_am: "ልዩ ምርት",
    image: "https://images.unsplash.com/photo-1572085312048-a006c9a92892?auto=format&fit=crop&q=80&w=600",
    description_en: "360° rotating outdoor umbrella with water-fillable base. Perfect for cafés, hotels, villas, and garden seating.",
    description_am: "360 ዲግሪ መዞር የሚችል፣ በውሃ ወይም በአሸዋ የሚሞላ ቤዝ ያለው ለካፌዎች፣ ሆቴሎች እና የአትክልት ስፍራዎች ተስማሚ ጥላ።",
    features_en: [
      "360° rotating cantilever system",
      "Heavy-duty water-fillable base for wind resistance",
      "No light fitting — sleek and dependable",
      "High UV-protection fabric"
    ],
    features_am: [
      "360 ዲግሪ የሚዞር ዘመናዊ መዋቅር",
      "ነፋስ እንዲቋቋም በውሃ የሚሞላ ጠንካራ ቤዝ",
      "መብራት የሌለው አስተማማኝ እና ዘላቂ ግንባታ",
      "ፀሐይና አልትራቫዮሌት ጨረር የሚከላከል ጨርቅ"
    ],
    price_type: "flat",
    price: 99000,
    price_display_en: "99,000 ETB",
    price_display_am: "99,000 ብር"
  },
  {
    id: "market-parasol",
    name_en: "Market Parasol Umbrella",
    name_am: "የገበያ ጥላ ፓራሶል",
    category: "umbrellas",
    tag_en: "New",
    tag_am: "አዲስ",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
    description_en: "Classic centre-pole parasol for cafés, restaurants, and market stalls. Sturdy aluminium frame with crank opening.",
    description_am: "ለካፌዎች፣ ምግብ ቤቶች እና የገበያ ቦታዎች የሚሆን ክላሲክ ጥላ። ጠንካራ አሉሚኒየም ፍሬም ያለው።",
    features_en: [
      "Sturdy aluminium centre pole",
      "Easy crank-open mechanism",
      "Wind vents prevent flipping",
      "Available in multiple canopy colors"
    ],
    features_am: [
      "ጠንካራ አሉሚኒየም ምሰሶ",
      "በቀላሉ የሚከፈት ሜካኒዝም",
      "ነፋስ ጥላ እንዳያነሳ ቀዳዳዎች አሉ",
      "የተለያዩ ቀለሞች ይገኛሉ"
    ],
    price_type: "flat",
    price: 45000,
    price_display_en: "45,000 ETB",
    price_display_am: "45,000 ብር"
  },
  {
    id: "strong-chair",
    name_en: "Strong Outdoor Plastic Chair",
    name_am: "ጠንካራ አዲስ ወንበር",
    category: "chairs-tables",
    tag_en: "New",
    tag_am: "አዲስ",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=600",
    description_en: "Extremely durable, wind-resistant plastic dining chair. Ideal for cafés, restaurants, gardens, and home balconies.",
    description_am: "እጅግ ጠንካራና ንፋስ የማይበግረው የፕላስቲክ ወንበር። ለካፌዎች፣ ምግብ ቤቶች፣ የአትክልት ስፍራዎች እና ለቤት የሚሆን።",
    features_en: [
      "Heavy-weight, wind-resistant design",
      "Stackable for easy storage",
      "UV-protected — prevents color fade",
      "Ergonomic, comfortable seat profile"
    ],
    features_am: [
      "ከባድ እና ነፋስ የሚቋቋም ቅርፅ",
      "ለማስቀመጥ ምቹ እንዲሆን ተደራራቢ",
      "ፀሐይ ቀለም እንዳያጠፋው የተሰራ",
      "ለሰውነት ምቹ የሆነ አቀማመጥ"
    ],
    price_type: "flat",
    price: 1900,
    price_display_en: "1,900 ETB",
    price_display_am: "1,900 ብር"
  },
  {
    id: "premium-cafe-table",
    name_en: "Square Outdoor Cafe Table",
    name_am: "ካሬ የውጪ ጠረጴዛ",
    category: "chairs-tables",
    tag_en: "Made to Order",
    tag_am: "በትእዛዝ የሚሰራ",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=600",
    description_en: "Sturdy square plastic table for four. Weatherproof, easy to wipe clean, umbrella hole in the centre.",
    description_am: "ለአራት ሰው የሚሆን ጠንካራ ካሬ ጠረጴዛ። የአየር ፀባይ የሚቋቋምና በቀላሉ የሚጸዳ።",
    features_en: [
      "4-leg base with stabilising feet",
      "Scratch-resistant textured top",
      "Centre umbrella hole",
      "Easy assembly and disassembly"
    ],
    features_am: [
      "አስተማማኝ 4 እግር ያለው",
      "ጭረት የሚቋቋም የጠረጴዛ ገጽታ",
      "መሃል ላይ የጥላ ማስገቢያ ቀዳዳ ያለው",
      "በቀላሉ የሚገጣጠም እና የሚፈታ"
    ],
    price_type: "flat",
    price: 6500,
    price_display_en: "6,500 ETB",
    price_display_am: "6,500 ብር"
  },
  {
    id: "folding-table",
    name_en: "Folding Portable Table",
    name_am: "የሚታጠፍ ተሸካሚ ጠረጴዛ",
    category: "chairs-tables",
    tag_en: "Bestseller",
    tag_am: "ተፈላጊ",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600",
    description_en: "Lightweight foldable table for events, gardens, and outdoor setups. Folds flat for easy transport.",
    description_am: "ለዝግጅቶች፣ ለአትክልት ስፍራ እና ለውጪ ቦታዎች የሚሆን ቀላል ተሸካሚ ጠረጴዛ።",
    features_en: [
      "Lightweight plastic and metal frame",
      "Folds flat in seconds",
      "Non-slip rubber feet",
      "Holds up to 80kg"
    ],
    features_am: [
      "ቀላል ፕላስቲክ እና ብረት ፍሬም",
      "በጥቂት ሰኮንድ ይታጠፋል",
      "የማትንሸራተት ጎማ እግሮች",
      "እስከ 80 ኪግ ሸክም ይችላል"
    ],
    price_type: "flat",
    price: 4200,
    price_display_en: "4,200 ETB",
    price_display_am: "4,200 ብር"
  },
  {
    id: "gazebo-tent",
    name_en: "3x3m Garden Gazebo Tent",
    name_am: "3x3 ሜትር የአትክልት ዳስ ድንኳን",
    category: "tents",
    tag_en: "Made to Order",
    tag_am: "በትእዛዝ የሚሰራ",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
    description_en: "Heavy-duty pop-up gazebo for gardens, events, and outdoor dining. Water-resistant canopy with powder-coated steel frame.",
    description_am: "ለአትክልት ስፍራ፣ ዝግጅቶች እና ውጪ ምግብ ቤቶች የሚሆን ድንኳን። ውሃ ጠላፊ ጨርቅ እና ጠንካራ ብረት ፍሬም ያለው።",
    features_en: [
      "Powder-coated steel frame — rust resistant",
      "Water-resistant PVC-coated canopy",
      "Adjustable height legs",
      "Includes carry bag for easy transport"
    ],
    features_am: [
      "ዝገት የማይበግረው ቀለም የተቀባ ብረት ፍሬም",
      "ውሃ ጠላፊ PVC የተሸፈነ ጨርቅ",
      "ቁመቱ ሊስተካከል የሚችሉ እግሮች",
      "ለትራንስፖርት ምቹ ቦርሳ ይካተታል"
    ],
    price_type: "flat",
    price: 55000,
    price_display_en: "55,000 ETB",
    price_display_am: "55,000 ብር"
  },
  {
    id: "plastic-basin-multi",
    name_en: "Multi-Purpose Heavy Duty Basin",
    name_am: "ለተለያዩ አገልግሎቶች የሚሆን ጠንካራ ተፋ",
    category: "plastics",
    tag_en: "Bestseller",
    tag_am: "ተፈላጊ",
    image: "https://images.unsplash.com/photo-1610557892470-76d74cd120a2?auto=format&fit=crop&q=80&w=600",
    description_en: "High-density flexible plastic basins for washing and storage. Thick rim for easy lifting and carrying.",
    description_am: "ለዕቃ ማጠቢያ እና ለተለያዩ ማከማቻዎች የሚሆን እጅግ ጠንካራ የፕላስቲክ ተፋ። ለመያዝ ምቹ የሆነ ጠርዝ ያለው።",
    features_en: [
      "High-density polyethylene construction",
      "Flexible yet virtually unbreakable",
      "Non-toxic, food-grade plastic",
      "Multiple capacities available"
    ],
    features_am: [
      "ከፍተኛ ጥራት ካለው ፖሊኢትሊን የተሰራ",
      "የሚተጣጠፍ ግን የማይሰበር",
      "መርዝ የሌለው፣ ለምግብ ተስማሚ ፕላስቲክ",
      "በተለያየ መጠንና ሊትር የሚገኝ"
    ],
    price_type: "tiered",
    price_display_en: "From 600 ETB",
    price_display_am: "ከ 600 ብር ጀምሮ",
    price_tiers: [
      { size: "30L", price: 600 },
      { size: "50L", price: 1100 },
      { size: "85L", price: 2000 }
    ]
  },
  {
    id: "storage-container",
    name_en: "Plastic Storage Container",
    name_am: "የፕላስቲክ ማከማቻ",
    category: "plastics",
    tag_en: "New",
    tag_am: "አዲስ",
    image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&q=80&w=600",
    description_en: "Airtight stackable plastic storage containers. Great for shops, homes, and restaurants to organise supplies.",
    description_am: "አየር ጠላፊ የፕላስቲክ ማከማቻ ሳጥኖች። ለሱቆች፣ ቤቶች እና ምግብ ቤቶች ዕቃዎችን ለማስተካከል ተስማሚ።",
    features_en: [
      "Airtight, locking lid",
      "Stackable space-saving design",
      "BPA-free food-safe plastic",
      "Crystal-clear body for easy visibility"
    ],
    features_am: [
      "አየር ጠላፊ ክዳን ያለው",
      "ቦታ ቆጣቢ ተደራራቢ ዲዛይን",
      "BPA ነፃ ለምግብ ተስማሚ ፕላስቲክ",
      "ይዘቱ ለማየት ምቹ ግልጽ ቀለም"
    ],
    price_type: "tiered",
    price_display_en: "From 350 ETB",
    price_display_am: "ከ 350 ብር ጀምሮ",
    price_tiers: [
      { size: "5L",  price: 350 },
      { size: "10L", price: 600 },
      { size: "20L", price: 950 },
      { size: "40L", price: 1600 }
    ]
  }
];

// ──────────────────────────────────────
// Categories
// ──────────────────────────────────────
const categories = [
  { id: "all",           name_en: "All Products",    name_am: "ሁሉም ምርቶች" },
  { id: "bins",          name_en: "Garbage Cans",    name_am: "የቆሻሻ መጣያ",    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=400" },
  { id: "umbrellas",     name_en: "Shade Umbrellas", name_am: "የፀሐይ ጥላዎች",   image: "https://images.unsplash.com/photo-1572085312048-a006c9a92892?auto=format&fit=crop&q=80&w=400" },
  { id: "chairs-tables", name_en: "Chairs & Tables", name_am: "ወንበርና ጠረጴዛ",  image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?auto=format&fit=crop&q=80&w=400" },
  { id: "tents",         name_en: "Tents & Gazebos", name_am: "ድንኳኖች",        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400" },
  { id: "plastics",      name_en: "Plastic Goods",   name_am: "የፕላስቲክ ዕቃዎች", image: "https://images.unsplash.com/photo-1610557892470-76d74cd120a2?auto=format&fit=crop&q=80&w=400" }
];

// ──────────────────────────────────────
// Translation Dictionary
// ──────────────────────────────────────
const dictionary = {
  en: {
    "hero-badge":         "TRUSTED SUPPLIER",
    "hero-title-main":    "Quality Outdoor & Plastic Gear",
    "hero-title-sub":     "For Your Business & Home",
    "hero-subtitle":      "Premium shade umbrellas, tents, plastic chairs, and garbage cans in Addis Ababa.",
    "hero-cta":           "Browse Catalog",
    "hero-tg-cta":        "Order on Telegram",
    "call-now":           "Call to Order",
    "section-categories": "Browse Categories",
    "section-catalog":    "Our Product Catalog",
    "search-placeholder": "Search products...",
    "pdp-key-features":   "Key Specifications",
    "pdp-pricing-table":  "Size & Price Tiers",
    "th-size":            "Capacity / Size",
    "th-price":           "Price (ETB)",
    "order-telegram":     "Order via Telegram",
    "order-call":         "Call to Order",
    "footer-contact-us":  "Get in Touch",
    "footer-location":    "Addis Ababa, Ethiopia",
    "footer-follow-us":   "Follow Us",
    "footer-rights":      "All Rights Reserved.",
    "sticky-tg":          "Order on Telegram",
    "sticky-call":        "Call",
    "price-from":         "From",
    "nav-join-tg":        "Join Channel",
    "no-results":         "No products found. Try a different search."
  },
  am: {
    "hero-badge":         "ታማኝ አቅራቢ",
    "hero-title-main":    "ጥራት ያላቸው የውጪና ፕላስቲክ ዕቃዎች",
    "hero-title-sub":     "ለቤትዎ እና ለንግድዎ",
    "hero-subtitle":      "ምርጥ የፀሐይ ጥላዎች፣ ድንኳኖች፣ የፕላስቲክ ወንበሮች እና የቆሻሻ መጣያ ባልዲዎች በአዲስ አበባ።",
    "hero-cta":           "ካታሎግ ይመልከቱ",
    "hero-tg-cta":        "በቴሌግራም እዘዝ",
    "call-now":           "ደውለው ይዘዙ",
    "section-categories": "ምድቦች",
    "section-catalog":    "የምርት ዝርዝር",
    "search-placeholder": "ዕቃዎችን ይፈልጉ...",
    "pdp-key-features":   "ዋና መለያዎች",
    "pdp-pricing-table":  "የመጠን እና የዋጋ ዝርዝር",
    "th-size":            "መጠን / ሊትር",
    "th-price":           "ዋጋ (ብር)",
    "order-telegram":     "በቴሌግራም እዘዝ",
    "order-call":         "ደውለው ለማዘዝ",
    "footer-contact-us":  "ያግኙን",
    "footer-location":    "አዲስ አበባ፣ ኢትዮጵያ",
    "footer-follow-us":   "ይከተሉን",
    "footer-rights":      "መብቱ በህግ የተጠበቀ ነው።",
    "sticky-tg":          "በቴሌግራም እዘዝ",
    "sticky-call":        "ደውል",
    "price-from":         "ከ",
    "nav-join-tg":        "ቴሌግራም ቻናል",
    "no-results":         "ምንም ምርት አልተገኘም። ሌላ ቃል ይሞክሩ።"
  }
};

// ──────────────────────────────────────
// App State
// ──────────────────────────────────────
let currentLang = "en";
let currentCategory = "all";
let searchQuery = "";

// ──────────────────────────────────────
// Init
// ──────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderFilterTabs();
  renderProducts();
  applyLanguage(currentLang);
  initScrollAnimations();
  // Start sticky bar hidden
  const bar = document.querySelector(".sticky-cta-bar");
  if (bar) bar.style.transform = "translateY(100%)";
  window.addEventListener("scroll", handleScrollCTA);
});

// ──────────────────────────────────────
// Language
// ──────────────────────────────────────
function applyLanguage(lang) {
  currentLang = lang;
  const btn = document.getElementById("langToggleBtn");
  if (btn) {
    btn.innerHTML = lang === "en"
      ? `<span class="active-lang">EN</span><span class="divider">/</span><span class="inactive-lang">አማ</span>`
      : `<span class="inactive-lang">EN</span><span class="divider">/</span><span class="active-lang">አማ</span>`;
  }
  document.querySelectorAll("[data-key]").forEach(el => {
    const key = el.getAttribute("data-key");
    if (dictionary[lang][key]) el.textContent = dictionary[lang][key];
  });
  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    const key = el.getAttribute("data-key-placeholder");
    if (dictionary[lang][key]) el.setAttribute("placeholder", dictionary[lang][key]);
  });
  renderCategories();
  renderFilterTabs();
  renderProducts();
}

function toggleLanguage() {
  applyLanguage(currentLang === "en" ? "am" : "en");
}

// ──────────────────────────────────────
// Render Categories
// ──────────────────────────────────────
function renderCategories() {
  const container = document.getElementById("categoriesScroll");
  if (!container) return;
  container.innerHTML = "";
  categories.filter(c => c.id !== "all").forEach(cat => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.onclick = () => selectCategory(cat.id);
    card.innerHTML = `
      <img src="${cat.image}" alt="${cat.name_en}" class="category-card-bg" loading="lazy">
      <div class="category-card-overlay">
        <h3 class="category-card-title">${currentLang === "en" ? cat.name_en : cat.name_am}</h3>
        <span class="category-card-amharic">${currentLang === "en" ? cat.name_am : cat.name_en}</span>
      </div>
    `;
    container.appendChild(card);
  });
}

// ──────────────────────────────────────
// Render Filter Tabs
// ──────────────────────────────────────
function renderFilterTabs() {
  const container = document.getElementById("filterTabs");
  if (!container) return;
  container.innerHTML = "";
  categories.forEach(cat => {
    const tab = document.createElement("button");
    tab.className = `filter-tab ${currentCategory === cat.id ? "active" : ""}`;
    tab.onclick = () => selectCategory(cat.id);
    tab.textContent = currentLang === "en" ? cat.name_en : cat.name_am;
    container.appendChild(tab);
  });
}

function selectCategory(categoryId) {
  currentCategory = categoryId;
  renderFilterTabs();
  renderProducts();
  document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
}

function handleSearch() {
  searchQuery = document.getElementById("searchInput").value.toLowerCase();
  renderProducts();
}

// ──────────────────────────────────────
// Render Products
// ──────────────────────────────────────
function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const filtered = products.filter(prod => {
    const matchCat    = currentCategory === "all" || prod.category === currentCategory;
    const matchSearch = prod.name_en.toLowerCase().includes(searchQuery)
                     || prod.name_am.includes(searchQuery)
                     || prod.description_en.toLowerCase().includes(searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.innerHTML = `
      <div class="empty-icon">🔍</div>
      <p>${dictionary[currentLang]["no-results"]}</p>
      <button onclick="selectCategory('all')" class="filter-tab active" style="margin-top:1rem;">
        ${currentLang === "en" ? "Show all products" : "ሁሉም ምርቶች ይታዩ"}
      </button>
    `;
    grid.appendChild(empty);
    return;
  }

  filtered.forEach((prod, idx) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${idx * 0.05}s`;
    card.onclick = () => openPDP(prod.id);

    const name       = currentLang === "en" ? prod.name_en        : prod.name_am;
    const desc       = currentLang === "en" ? prod.description_en : prod.description_am;
    const priceText  = currentLang === "en" ? prod.price_display_en : prod.price_display_am;
    const tag        = currentLang === "en" ? prod.tag_en         : prod.tag_am;
    const priceLabel = prod.price_type === "tiered" ? (currentLang === "en" ? "From" : "ከ") : "";

    card.innerHTML = `
      <div class="product-card-image-wrap">
        ${prod.tag_en ? `<div class="product-ribbon">${tag}</div>` : ""}
        <img src="${prod.image}" alt="${name}" class="product-card-img" loading="lazy">
        <div class="product-card-overlay">
          <div class="product-card-details">
            <h3 class="product-card-title">${name}</h3>
            <p class="product-card-desc">${desc}</p>
            <div class="product-card-footer">
              <span class="product-card-price">${priceLabel} ${priceText}</span>
              <span class="product-card-action">View details</span>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ──────────────────────────────────────
// Product Detail Modal (PDP)
// ──────────────────────────────────────
function openPDP(productId) {
  const prod = products.find(p => p.id === productId);
  if (!prod) return;

  document.getElementById("pdpMainImage").src = prod.image;
  document.getElementById("pdpMainImage").alt = currentLang === "en" ? prod.name_en : prod.name_am;
  document.getElementById("pdpTagContainer").innerHTML = prod.tag_en
    ? `<span class="hero-badge-ribbon">${currentLang === "en" ? prod.tag_en : prod.tag_am}</span>` : "";
  document.getElementById("pdpTitle").textContent       = currentLang === "en" ? prod.name_en        : prod.name_am;
  document.getElementById("pdpPrice").textContent       = currentLang === "en" ? prod.price_display_en : prod.price_display_am;
  document.getElementById("pdpDescription").textContent = currentLang === "en" ? prod.description_en : prod.description_am;

  const featuresList = document.getElementById("pdpFeaturesList");
  featuresList.innerHTML = "";
  (currentLang === "en" ? prod.features_en : prod.features_am).forEach(feat => {
    const li = document.createElement("li");
    li.textContent = feat;
    featuresList.appendChild(li);
  });

  const tiersContainer = document.getElementById("pdpTiersContainer");
  const tiersBody      = document.getElementById("pdpTiersBody");
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

  const msg = `Hello Atlantic Trading, I would like to order: ${prod.name_en} (${prod.price_display_en})`;
  document.getElementById("pdpTelegramCta").href = `https://t.me/Atlantictradingplc1?text=${encodeURIComponent(msg)}`;

  document.getElementById("pdpModal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closePDP() {
  document.getElementById("pdpModal").classList.remove("active");
  document.body.style.overflow = "";
}

// Close with Escape key
document.addEventListener("keydown", e => { if (e.key === "Escape") closePDP(); });

// ──────────────────────────────────────
// Sticky CTA Bar
// ──────────────────────────────────────
function handleScrollCTA() {
  const bar  = document.querySelector(".sticky-cta-bar");
  const hero = document.querySelector(".hero-section");
  if (!bar || !hero) return;
  const heroBottom = hero.offsetTop + hero.offsetHeight;
  bar.style.transform = window.scrollY > heroBottom - 60 ? "translateY(0)" : "translateY(100%)";
}

// ──────────────────────────────────────
// Scroll entrance animations
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
  }, { threshold: 0.1 });

  document.querySelectorAll(".section-header, .categories-section, .products-section").forEach(el => {
    el.classList.add("fade-in-up");
    observer.observe(el);
  });
}
