#!/usr/bin/env python3
"""
migrate_data.py
────────────────────────────────────────────────────────────────────────
ONE-TIME migration script. Run from the repo root:

    python migrate_data.py

What it does:
  1. Reads the optimized_products.json from atlantic-scraper/ (source of truth
     with image_thumb / image_full already filled in).
  2. Writes each product as an individual JSON file to content/products/<id>.json
     (this is the format Decap CMS needs).
  3. Copies all images from atlantic-scraper/assets/products/
     to assets/products/ (the permanent home the CMS and app.js will use).
  4. Updates image_thumb / image_full paths in every JSON file to point at
     assets/products/ (the new location).

Run once. Commit the results.
"""

import json
import os
import shutil
import sys

SRC_JSON = "atlantic-scraper/optimized_products.json"
OUT_DIR   = "content/products"
IMG_SRC   = "atlantic-scraper/assets/products"
IMG_DST   = "assets/products"


def main():
    if not os.path.isfile(SRC_JSON):
        print(f"ERROR: source JSON not found at {SRC_JSON!r}")
        print("Make sure you run this from the repo root.")
        sys.exit(1)

    with open(SRC_JSON, "r", encoding="utf-8") as f:
        products = json.load(f)

    print(f"Loaded {len(products)} products from {SRC_JSON}")

    os.makedirs(OUT_DIR, exist_ok=True)
    os.makedirs(IMG_DST, exist_ok=True)

    # Copy images to permanent location
    copied = 0
    if os.path.isdir(IMG_SRC):
        for fname in os.listdir(IMG_SRC):
            src = os.path.join(IMG_SRC, fname)
            dst = os.path.join(IMG_DST, fname)
            if os.path.isfile(src) and not os.path.isfile(dst):
                shutil.copy2(src, dst)
                copied += 1
        print(f"Copied {copied} image files  {IMG_SRC}  ->  {IMG_DST}")
    else:
        print(f"Warning: image source folder not found: {IMG_SRC!r}")

    # Write individual product JSON files
    for product in products:
        pid = product.get("id")
        if not pid:
            print(f"  Skipping product with no 'id' field")
            continue

        # Fix image paths
        for key in ("image_thumb", "image_full"):
            if key in product and product[key]:
                path = product[key].replace("\\", "/")
                path = path.replace("atlantic-scraper/assets/products/", "assets/products/")
                product[key] = path

        out_path = os.path.join(OUT_DIR, f"{pid}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(product, f, ensure_ascii=False, indent=2)
        print(f"  ok  {out_path}")

    print(f"\nDone. {len(products)} product files written to {OUT_DIR}/")
    print("\nNext steps:")
    print("  1. Run `node build.js` to generate products.json")
    print("  2. Commit and push everything to main")


if __name__ == "__main__":
    main()
