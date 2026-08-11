#!/usr/bin/env python3
"""
Product Image Optimizer (hardened)
────────────────────────────────────────────────────
Takes the "image" field from a products JSON file — which can be either
a real URL or a local file path — and generates two locally-hosted,
optimized versions of each photo:

  - a THUMBNAIL for the product grid card   (small, loads fast on scroll)
  - a DETAIL image for the PDP modal        (bigger, still compressed)

WHAT'S DIFFERENT FROM THE ORIGINAL SCRIPT:
  - Records with a missing/placeholder image (e.g. "PASTE_IMAGE_PATH",
    empty string, or None) are SKIPPED with a single clean line instead
    of crashing/spamming an error per record.
  - The "image" field can be a local file path (e.g. downloaded from
    Telegram some other way) as well as an http(s) URL.
  - A final summary tells you exactly how many succeeded / were skipped
    (no source yet) / failed (source present but broken).

USAGE:
  pip install pillow requests --break-system-packages
  python3 optimize_images.py scraped_products.json

OUTPUT:
  assets/products/<id>-thumb.webp   (~480px wide,  quality 72)
  assets/products/<id>-full.webp    (~960px wide,  quality 80)
  optimized_products.json           (same records + new local image paths)
"""

import sys
import os
import json
import re
from io import BytesIO

try:
    import requests
except ImportError:
    print("Missing dependency: run `pip install pillow requests --break-system-packages`")
    sys.exit(1)

try:
    from PIL import Image
except ImportError:
    print("Missing dependency: run `pip install pillow requests --break-system-packages`")
    sys.exit(1)

OUT_DIR = "assets/products"
THUMB_WIDTH = 480
FULL_WIDTH = 960
THUMB_QUALITY = 72
FULL_QUALITY = 80

# Any of these values (case-insensitive) count as "no real image yet"
PLACEHOLDER_VALUES = {"", "paste_image_path", "todo", "tbd", "none", "null"}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
}


def slugify(text, fallback):
    if not text:
        return fallback
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", text.strip().lower()).strip("-")
    return slug or fallback


def is_placeholder(value):
    if not value or not isinstance(value, str):
        return True
    return value.strip().lower() in PLACEHOLDER_VALUES


def load_image(source):
    """Load an image from either a URL or a local file path."""
    if re.match(r"^https?://", source, re.IGNORECASE):
        resp = requests.get(source, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        return Image.open(BytesIO(resp.content)).convert("RGB")
    else:
        if not os.path.isfile(source):
            raise FileNotFoundError(f"local file not found: {source}")
        return Image.open(source).convert("RGB")


def resized(img, target_width):
    if img.width <= target_width:
        return img  # never upscale — a small source stays small
    ratio = target_width / img.width
    new_size = (target_width, round(img.height * ratio))
    return img.resize(new_size, Image.LANCZOS)


def save_webp(img, path, quality):
    img.save(path, "WEBP", quality=quality, method=6)
    return os.path.getsize(path)


def process_record(record, index, out_dir, stats):
    source = record.get("image")

    if is_placeholder(source):
        label = record.get("id") or record.get("name_guess") or f"record #{index}"
        print(f"  ⏭️  skipped {label}: no real image source yet (still \"{source}\")")
        stats["skipped"] += 1
        return record

    slug = slugify(record.get("id") or record.get("name_guess"), f"product-{index}")

    try:
        original = load_image(source)
    except Exception as e:
        print(f"  ⚠️  failed {slug}: {e}")
        stats["failed"] += 1
        return record

    thumb_path = os.path.join(out_dir, f"{slug}-thumb.webp")
    full_path = os.path.join(out_dir, f"{slug}-full.webp")

    thumb_size = save_webp(resized(original, THUMB_WIDTH), thumb_path, THUMB_QUALITY)
    full_size = save_webp(resized(original, FULL_WIDTH), full_path, FULL_QUALITY)

    print(f"  ✓ {slug}: thumb {thumb_size/1024:.0f}KB, full {full_size/1024:.0f}KB")

    record["image_thumb"] = thumb_path
    record["image_full"] = full_path
    stats["succeeded"] += 1
    return record


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 optimize_images.py <products.json>")
        sys.exit(1)

    input_path = sys.argv[1]
    with open(input_path, "r", encoding="utf-8") as f:
        records = json.load(f)

    os.makedirs(OUT_DIR, exist_ok=True)

    stats = {"succeeded": 0, "skipped": 0, "failed": 0}

    print(f"Processing {len(records)} records...")
    updated = [process_record(r, i, OUT_DIR, stats) for i, r in enumerate(records)]

    with open("optimized_products.json", "w", encoding="utf-8") as f:
        json.dump(updated, f, ensure_ascii=False, indent=2)

    print("\nDone. Saved -> optimized_products.json")
    print(f"Images saved under -> {OUT_DIR}/")
    print(f"\nSummary: {stats['succeeded']} converted, "
          f"{stats['skipped']} skipped (no image source yet), "
          f"{stats['failed']} failed (source present but couldn't load).")

    if stats["skipped"]:
        print("\n⚠️  Some products still need a real image before you can convert them.")
        print("   Fill in the \"image\" field with either:")
        print("     - a direct https:// URL to the photo, or")
        print("     - a local file path to an already-downloaded image")
        print("   then re-run this script.")

    if stats["succeeded"]:
        print("\nNext: commit the assets/products/ folder to your repo, then update")
        print("each converted product's `image` field in app.js to use image_thumb")
        print("(grid card) and image_full (PDP modal) instead of the old external URL.")


if __name__ == "__main__":
    main()
