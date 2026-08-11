# Atlantic Trading Website

A modern, static e-commerce storefront for Atlantic Trading PLC. It features a responsive grid, dual-language support (English and Amharic), product search and filtering, and a direct-to-Telegram order flow.

## 🛠 Tech Stack

- **Frontend:** HTML, Vanilla CSS, Vanilla JavaScript (No heavy frameworks)
- **Content Management:** Decap CMS (v3)
- **Data Storage:** JSON files committed directly to the GitHub repository
- **Hosting:** GitHub Pages
- **Image Processing:** Automated via GitHub Actions (Python script using Pillow)

---

## 📦 How to Manage Products (Admin Guide)

You don't need to touch any code to add or edit products. Everything is managed through a beautiful admin dashboard!

1. Go to the Admin Dashboard: [https://chimerical-swan-9d4302.netlify.app/admin/](https://chimerical-swan-9d4302.netlify.app/admin/)
2. Click **"Login with GitHub"**
3. Once inside, you can:
   - Create new products
   - Edit existing product details (prices, features, descriptions)
   - Upload new product photos (just upload standard JPGs or PNGs)

### What happens when you hit "Publish"?

When you save a product in the CMS, it automatically commits the changes to the `main` branch of this repository. This triggers a GitHub Action in the background that:
1. Converts your uploaded images into highly optimized WebP format (creating both a full-size version and a tiny thumbnail).
2. Compiles all individual product data into a single `products.json` file.
3. Automatically deploys the updated site to GitHub Pages!

**Note:** It takes about 1-2 minutes for the GitHub Action to finish processing images and deploying the site. If you don't see your changes immediately on the live site, just wait a minute and refresh!

---

## 💻 Local Development

If you want to run the site locally to test code or CSS changes:

1. Clone the repository:
   ```bash
   git clone https://github.com/leul-cpu/atlantic-trading-website.git
   cd atlantic-trading-website
   ```

2. Run a local server. You can use Python or Node:
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```
   *Then visit `http://localhost:8000` in your browser.*

### Re-building the JSON locally
If you manually edit a product JSON file inside `content/products/` while testing locally, you must run the build script to update the master `products.json` file:

```bash
node build.js
```

*(You do NOT need to do this when using the CMS — GitHub Actions handles this automatically!)*

---

## 🗂 Project Structure

```text
├── index.html            # Main storefront HTML
├── index.css             # Main stylesheet
├── app.js                # Frontend logic (Search, Filters, Modal, JSON fetching)
├── products.json         # Auto-generated file containing ALL products
├── build.js              # Node script that compiles products.json
├── content/
│   └── products/         # Individual JSON files for each product managed by the CMS
├── assets/
│   └── products/         # Product images (optimized webp files)
├── admin/
│   ├── index.html        # Decap CMS entry point
│   └── config.yml        # Decap CMS schema and configuration
└── .github/
    └── workflows/
        └── build.yml     # The automation pipeline
```
