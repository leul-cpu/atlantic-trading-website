#!/usr/bin/env python3
"""
Telegram Public Channel -> Product Catalog Scraper
────────────────────────────────────────────────────
Scrapes a PUBLIC Telegram channel's web preview (https://t.me/s/<channel>)
and pulls out: post text, image URL, post date, and post link.

No login, no bot token, no API keys needed — this only works because public
channels expose a lightweight HTML preview at t.me/s/<channel> for search
engines / non-logged-in viewers.

LIMITATIONS (read before trusting the output):
  - The preview page only serves the last ~20 messages per request. This
    script paginates backwards using Telegram's `before=<id>` param to walk
    further back in history, but very old messages may eventually stop
    being served without a real login session.
  - Price/description/name extraction is done with regex heuristics on the
    raw text, not real NLP. It works reasonably well on posts that look like
    your dustbin/umbrella/chair listings, but will be wrong or partial on
    posts that are announcements, multi-product bundles, or plain chatter.
  - ALWAYS review scraped_products.json by hand before using it to update
    app.js. Treat this as a first draft generator, not a source of truth.

USAGE:
  pip install requests beautifulsoup4 --break-system-packages
  python3 telegram_catalog_scraper.py atlantictradingtent

OUTPUT:
  scraped_posts.json      -> every post, raw (text, image, date, link)
  scraped_products.json   -> best-effort structured guess at product fields
"""

import sys
import re
import json
import time
import requests
from bs4 import BeautifulSoup

BASE = "https://t.me/s/{channel}"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
}

# Matches "800 ETB", "800ETB", "800 birr", "800 ብር", "99,000 ETB", etc.
PRICE_RE = re.compile(
    r"([\d,]{2,}(?:\.\d+)?)\s*(?:ETB|Birr|birr|ብር)", re.IGNORECASE
)
# Matches size-like tokens: 10L, 3x3m, 3X3, 240 L
SIZE_RE = re.compile(r"\b(\d+(?:\.\d+)?\s?[xX]\s?\d+(?:\.\d+)?\s?m|\d+\s?L)\b")


def fetch_page(channel, before=None):
    url = BASE.format(channel=channel)
    params = {"before": before} if before else {}
    resp = requests.get(url, headers=HEADERS, params=params, timeout=15)
    resp.raise_for_status()
    return resp.text


def parse_messages(html):
    soup = BeautifulSoup(html, "html.parser")
    messages = soup.select("div.tgme_widget_message")
    parsed = []

    for msg in messages:
        post_id = msg.get("data-post")  # e.g. "atlantictradingtent/123"
        if not post_id:
            continue

        # --- text ---
        text_div = msg.select_one("div.tgme_widget_message_text")
        text = ""
        if text_div:
            # convert <br> to newlines before extracting text
            for br in text_div.find_all("br"):
                br.replace_with("\n")
            text = text_div.get_text().strip()

        # --- image ---
        image_url = None
        photo_wrap = msg.select_one("a.tgme_widget_message_photo_wrap")
        if photo_wrap and photo_wrap.get("style"):
            m = re.search(r"background-image:url\('(.+?)'\)", photo_wrap["style"])
            if m:
                image_url = m.group(1)

        # --- date ---
        time_tag = msg.select_one("time.time")
        date = time_tag.get("datetime") if time_tag else None

        parsed.append({
            "id": post_id,
            "link": f"https://t.me/{post_id}",
            "date": date,
            "text": text,
            "image": image_url,
        })

    return parsed


def scrape_channel(channel, max_pages=15, delay_sec=1.0):
    all_posts = {}
    before = None

    for _ in range(max_pages):
        html = fetch_page(channel, before=before)
        batch = parse_messages(html)
        if not batch:
            break

        new_count = 0
        for post in batch:
            if post["id"] not in all_posts:
                all_posts[post["id"]] = post
                new_count += 1

        if new_count == 0:
            break  # no new posts found, likely hit the start of the channel

        # Telegram's `before` param wants the numeric id of the oldest
        # message seen so far, to page further back in history.
        oldest_id = min(int(p["id"].split("/")[-1]) for p in batch)
        before = oldest_id
        time.sleep(delay_sec)  # be polite, avoid hammering the endpoint

    return sorted(all_posts.values(), key=lambda p: p["date"] or "", reverse=True)


def guess_product_fields(post):
    """Best-effort heuristic extraction. Review manually before trusting."""
    text = post["text"]
    if not text:
        return None

    lines = [l.strip() for l in text.split("\n") if l.strip()]
    name_guess = lines[0] if lines else None

    prices = PRICE_RE.findall(text)
    sizes = SIZE_RE.findall(text)

    price_tiers = None
    if len(prices) > 1 and len(sizes) == len(prices):
        price_tiers = [
            {"size": s, "price": int(p.replace(",", ""))}
            for s, p in zip(sizes, prices)
        ]

    return {
        "source_post": post["link"],
        "date": post["date"],
        "image": post["image"],
        "name_guess": name_guess,
        "full_text": text,
        "price_type_guess": "tiered" if price_tiers else ("flat" if prices else "unknown"),
        "price_guess": int(prices[0].replace(",", "")) if prices and not price_tiers else None,
        "price_tiers_guess": price_tiers,
    }


def main():
    if len(sys.argv) < 2:
        print("Usage: python3 telegram_catalog_scraper.py <channel_username>")
        print("Example: python3 telegram_catalog_scraper.py atlantictradingtent")
        sys.exit(1)

    channel = sys.argv[1].lstrip("@")
    print(f"Scraping public channel: {channel} ...")

    posts = scrape_channel(channel)
    print(f"Fetched {len(posts)} posts.")

    with open("scraped_posts.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print("Saved raw posts -> scraped_posts.json")

    products = [guess_product_fields(p) for p in posts]
    products = [p for p in products if p]  # drop empty-text posts
    with open("scraped_products.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    print("Saved product guesses -> scraped_products.json")
    print("\n⚠️  Review scraped_products.json by hand before using it to update app.js.")


if __name__ == "__main__":
    main()
