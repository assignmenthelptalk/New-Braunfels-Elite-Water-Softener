#!/usr/bin/env python3
"""
SERP Heading Extractor
======================
Given a keyword, fetches the top 5 ranking pages and extracts:
  - Meta Title
  - H1s, H2s, H3s

Usage:
  python serp_headings.py "your keyword here"
  python serp_headings.py "your keyword here" --results 7

Install dependencies first:
  pip install ddgs requests beautifulsoup4 lxml
"""

import sys
import argparse
import time
from collections import Counter
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup
from ddgs import DDGS

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# Domains to skip — mostly aggregators, not article pages
SKIP_DOMAINS = {
    "youtube.com", "reddit.com", "quora.com", "amazon.com",
    "pinterest.com", "twitter.com", "facebook.com", "instagram.com",
    "tiktok.com", "linkedin.com",
}


def search_top_urls(keyword: str, needed: int = 5) -> list[dict]:
    """Use DuckDuckGo to get organic results, skipping social/video domains."""
    results = []
    with DDGS() as ddgs:
        for r in ddgs.text(keyword, max_results=20):
            domain = urlparse(r["href"]).netloc.replace("www.", "")
            if any(skip in domain for skip in SKIP_DOMAINS):
                continue
            results.append({
                "url": r["href"],
                "domain": domain,
            })
            if len(results) >= needed:
                break
    return results


def fetch_page(url: str, timeout: int = 12) -> BeautifulSoup | None:
    """Fetch a URL and return a BeautifulSoup object, or None on failure."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        resp.raise_for_status()
        return BeautifulSoup(resp.text, "lxml")
    except Exception:
        return None


def extract_headings(soup: BeautifulSoup) -> dict:
    """Extract meta title, H1s, H2s, H3s from a parsed page."""
    title_tag = soup.find("title")
    meta_title = title_tag.get_text(strip=True) if title_tag else "—"

    BOILERPLATE = {
        "related posts", "subscribe", "newsletter", "you may also like",
        "share this", "leave a comment", "categories", "tags",
    }

    def clean_tags(tag: str) -> list[str]:
        headings = []
        for t in soup.find_all(tag):
            text = t.get_text(" ", strip=True)
            if not text:
                continue
            if any(bp in text.lower() for bp in BOILERPLATE):
                continue
            headings.append(text)
        return headings

    return {
        "meta_title": meta_title,
        "h1": clean_tags("h1"),
        "h2": clean_tags("h2"),
        "h3": clean_tags("h3"),
    }


def divider(char="=", width=72):
    print(char * width)


def print_result(n: int, entry: dict, data: dict):
    print()
    divider()
    print(f"  Result {n}  |  {entry['domain']}")
    divider()
    print(f"  URL: {entry['url']}")
    print()
    print(f"  Meta Title : {data['meta_title']}")
    print()

    print(f"  H1:")
    for h in data["h1"] or ["  (none)"]:
        print(f"    {h}")
    print()

    print(f"  H2s:")
    for h in data["h2"] or ["  (none)"]:
        print(f"    • {h}")
    print()

    print(f"  H3s:")
    for h in data["h3"] or ["  (none)"]:
        print(f"    · {h}")


def print_summary(results: list[dict], total: int):
    print()
    divider("=")
    print("  SUMMARY TABLE")
    divider("-")
    print(f"  {'#':<3} {'Domain':<28} {'Meta Title':<40} H1")
    divider("-")
    for i, r in enumerate(results, 1):
        if r.get("error"):
            print(f"  {i:<3} {r['domain']:<28} ❌ {r['error']}")
            continue
        d = r["data"]
        h1 = (d["h1"][0] if d["h1"] else "—")[:45]
        print(f"  {i:<3} {r['domain']:<28} {d['meta_title'][:39]:<40} {h1}")
    divider()

    # Count how many pages each heading appears on
    page_occurrence: Counter = Counter()
    for r in results:
        if r.get("error"):
            continue
        seen = set()
        for h in r["data"]["h2"] + r["data"]["h3"]:
            key = h.lower().strip()
            if key not in seen:
                page_occurrence[key] += 1
                seen.add(key)

    recurring = [(h, c) for h, c in page_occurrence.items() if c >= 2]
    recurring.sort(key=lambda x: -x[1])

    print()
    print("  RECURRING THEMES  (found in 2+ pages = must-cover sections)")
    divider("-")
    if recurring:
        for heading, count in recurring:
            bar = "█" * count
            print(f"  {bar:<6} [{count}/{total}]  {heading.title()}")
    else:
        print("  No exact recurring headings. Review H2s above for thematic overlap.")
    divider()


def main():
    parser = argparse.ArgumentParser(
        description="SERP Heading Extractor — extract H1/H2/H3s from top ranking pages"
    )
    parser.add_argument("keyword", nargs="+", help="Keyword to research")
    parser.add_argument(
        "--results", type=int, default=5,
        help="Number of pages to analyse (default: 5)"
    )
    args = parser.parse_args()

    keyword = " ".join(args.keyword)
    n = args.results

    print()
    print(f"  🔍  Keyword  : \"{keyword}\"")
    print(f"  📄  Pages    : {n}")
    print(f"  Searching DuckDuckGo...")

    try:
        urls = search_top_urls(keyword, needed=n)
    except Exception as e:
        print(f"\n❌ Search failed: {e}")
        sys.exit(1)

    if not urls:
        print("❌ No results found. Try a different keyword.")
        sys.exit(1)

    results = []
    for i, entry in enumerate(urls, 1):
        print(f"  [{i}/{n}] Fetching {entry['url'][:65]}...")
        soup = fetch_page(entry["url"])
        if soup is None:
            print(f"         ❌ Could not fetch — skipping.")
            entry["error"] = "blocked or timeout"
            results.append(entry)
        else:
            data = extract_headings(soup)
            entry["data"] = data
            results.append(entry)
            print_result(i, entry, data)
        time.sleep(0.8)   # be polite

    print_summary(results, total=n)
    ok = sum(1 for r in results if not r.get("error"))
    print(f"\n  ✅  Done — analysed {ok} of {n} pages.\n")


if __name__ == "__main__":
    main()
