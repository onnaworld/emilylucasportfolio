#!/bin/bash
# Downloads all media assets from onna.world into public/work/<slug>/
# Needs a browser User-Agent to bypass Wordfence on onna.world.
# Re-runnable: skips files that already exist.

set -e

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
BASE="https://onna.world/media/2026/01"

dl() {
  local url="$1"
  local dest="$2"
  if [ -f "$dest" ]; then
    echo "  skip (exists): $dest"
    return
  fi
  echo "  fetch: $url"
  curl -sf -A "$UA" -o "$dest" "$url" || { echo "    FAILED: $url"; rm -f "$dest"; }
}

# Aman (KSA)
dl "$BASE/aman.mp4"        "public/work/aman/hero.mp4"
dl "$BASE/8-aman-dubai.jpg" "public/work/aman/hero.jpg"
dl "$BASE/4.jpg"  "public/work/aman/1.jpg"
dl "$BASE/5.jpg"  "public/work/aman/2.jpg"
dl "$BASE/7.jpg"  "public/work/aman/3.jpg"
dl "$BASE/6.jpg"  "public/work/aman/4.jpg"
dl "$BASE/2.jpg"  "public/work/aman/5.jpg"
dl "$BASE/3.jpg"  "public/work/aman/6.jpg"

# Nike Vomero 18
dl "$BASE/nike-vomero-1080p.mp4" "public/work/nike-vomero/hero.mp4"
dl "$BASE/4-1.jpg" "public/work/nike-vomero/1.jpg"
dl "$BASE/5-1.jpg" "public/work/nike-vomero/2.jpg"
dl "$BASE/7-1.jpg" "public/work/nike-vomero/3.jpg"
dl "$BASE/6-1.jpg" "public/work/nike-vomero/4.jpg"

# Vogue Arabia Relaunch
dl "$BASE/4-2.jpg" "public/work/vogue-relaunch/hero.jpg"
dl "$BASE/1b.jpg"  "public/work/vogue-relaunch/1.jpg"
dl "$BASE/1a.jpg"  "public/work/vogue-relaunch/2.jpg"
dl "$BASE/2-1.jpg" "public/work/vogue-relaunch/3.jpg"
dl "$BASE/3-1.jpg" "public/work/vogue-relaunch/4.jpg"

# J.Crew Abraham Moon
dl "$BASE/jcrew-x-abraham-moon-1080p.mp4" "public/work/abraham-moon/hero.mp4"
dl "$BASE/3-8.jpg" "public/work/abraham-moon/hero.jpg"
dl "$BASE/2-8.jpg" "public/work/abraham-moon/1.jpg"
dl "$BASE/3-8.jpg" "public/work/abraham-moon/2.jpg"

# Mastercard SailGP
dl "$BASE/mastercard-x-sail-gp-1080p.mp4" "public/work/mastercard-sailgp/hero.mp4"
dl "$BASE/mastercard.jpg"                  "public/work/mastercard-sailgp/hero.jpg"

# One&Only Moonlight Basin
dl "$BASE/oneonly-moonlight-basin-1080p.mp4" "public/work/moonlight-basin/hero.mp4"
dl "$BASE/7-3.jpg" "public/work/moonlight-basin/hero.jpg"
dl "$BASE/3-9.jpg" "public/work/moonlight-basin/1.jpg"
dl "$BASE/5-2.jpg" "public/work/moonlight-basin/2.jpg"
dl "$BASE/7-3.jpg" "public/work/moonlight-basin/3.jpg"
dl "$BASE/6-3.jpg" "public/work/moonlight-basin/4.jpg"

# Mr. C Residences (Cipriani)
dl "$BASE/1.mp4"   "public/work/mr-c-residences/hero.mp4"
dl "$BASE/2-5.jpg" "public/work/mr-c-residences/hero.jpg"
dl "$BASE/2-5.jpg" "public/work/mr-c-residences/1.jpg"
dl "$BASE/3-5.jpg" "public/work/mr-c-residences/2.jpg"
dl "$BASE/4-5.jpg" "public/work/mr-c-residences/3.jpg"
dl "$BASE/5-4.jpg" "public/work/mr-c-residences/4.jpg"
dl "$BASE/7-5.jpg" "public/work/mr-c-residences/5.jpg"
dl "$BASE/6-5.jpg" "public/work/mr-c-residences/6.jpg"

# Yasmin Mansour
dl "$BASE/2-9.jpg" "public/work/yasmin-mansour/hero.jpg"
dl "$BASE/1-2.jpg" "public/work/yasmin-mansour/1.jpg"
dl "$BASE/2-9.jpg" "public/work/yasmin-mansour/2.jpg"
dl "$BASE/3-9.jpg" "public/work/yasmin-mansour/3.jpg"

# Vogue x Bvlgari
dl "$BASE/1b-2.jpg" "public/work/vogue-bvlgari/hero.jpg"
dl "$BASE/1a-2.jpg" "public/work/vogue-bvlgari/1.jpg"
dl "$BASE/1b-2.jpg" "public/work/vogue-bvlgari/2.jpg"
dl "$BASE/4-6.jpg"  "public/work/vogue-bvlgari/3.jpg"
dl "$BASE/5-5.jpg"  "public/work/vogue-bvlgari/4.jpg"

# Louis Vuitton x Glass Magazine
dl "$BASE/4.jpeg" "public/work/glass-magazine/hero.jpg"
dl "$BASE/4.jpeg" "public/work/glass-magazine/1.jpg"
dl "$BASE/5.jpeg" "public/work/glass-magazine/2.jpg"

# MR PORTER In America
dl "$BASE/6-mr-porter.jpg" "public/work/mr-porter-in-america/hero.jpg"

echo ""
echo "Done."
du -sh public/work/* | sort
