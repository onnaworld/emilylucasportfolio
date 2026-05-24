#!/bin/bash
# Resizes + recompresses every JPG under public/work/ in place.
# Max width 1600px (plenty for retina at the sizes shown), JPEG quality 70.
# Uses macOS built-in `sips` so no extra installs needed.

set -e

MAX_WIDTH=1600
QUALITY=70

echo "Before:"
du -sh public/work
echo ""

count=0
saved_bytes=0

while IFS= read -r -d '' file; do
  before=$(stat -f%z "$file")
  # Resize (only shrinks; -Z = max dimension, preserves aspect)
  sips -Z "$MAX_WIDTH" -s format jpeg -s formatOptions "$QUALITY" "$file" --out "$file" > /dev/null
  after=$(stat -f%z "$file")
  saved=$((before - after))
  saved_bytes=$((saved_bytes + saved))
  count=$((count + 1))
  printf "  %s  %dKB → %dKB\n" "$file" $((before / 1024)) $((after / 1024))
done < <(find public/work -type f \( -name "*.jpg" -o -name "*.jpeg" \) -print0)

echo ""
echo "Optimised $count files, saved $((saved_bytes / 1024 / 1024)) MB"
echo ""
echo "After:"
du -sh public/work
