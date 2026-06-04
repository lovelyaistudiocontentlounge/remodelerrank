#!/bin/bash
# Photo processing script for RemodelerRank client photos
# Converts, resizes, and organizes photos for web use
#
# Prerequisites: brew install webp
# Usage: ./scripts/process-photos.sh [client-slug] [source-folder]
# Example: ./scripts/process-photos.sh coda-construction ~/Downloads/coda-photos

set -e

CLIENT=${1:-"client"}
SOURCE=${2:-.}
DEST="./clients/$CLIENT/photos"

mkdir -p "$DEST"

echo "Processing photos for: $CLIENT"
echo "Source: $SOURCE"
echo "Output: $DEST"
echo ""

# ─── Hero images (full-bleed, 2000px wide) ──────────────────────────────────
process_hero() {
  local input="$1"
  local outname="$2"
  cwebp -q 85 -resize 2000 0 "$input" -o "$DEST/$outname.webp" -metadata none
  echo "  [hero]    $outname.webp"
}

# ─── Project gallery images (1200px wide) ────────────────────────────────────
process_project() {
  local input="$1"
  local outname="$2"
  cwebp -q 82 -resize 1200 0 "$input" -o "$DEST/$outname.webp" -metadata none
  echo "  [project] $outname.webp"
}

# ─── Thumbnails / cards (600px wide) ─────────────────────────────────────────
process_thumb() {
  local input="$1"
  local outname="$2"
  cwebp -q 80 -resize 600 0 "$input" -o "$DEST/$outname.webp" -metadata none
  echo "  [thumb]   $outname.webp"
}

# ─── Batch: convert all JPG/PNG/HEIC in source to project-sized WebP ─────────
batch_convert() {
  local n=1
  for f in "$SOURCE"/*.{jpg,jpeg,JPG,JPEG,png,PNG,heic,HEIC} 2>/dev/null; do
    [ -f "$f" ] || continue
    padded=$(printf "%02d" $n)
    outname="${CLIENT}_project_${padded}"
    process_project "$f" "$outname"
    ((n++))
  done
  echo ""
  echo "Done. $((n-1)) photos converted to $DEST"
}

# ─── SEO rename helper ────────────────────────────────────────────────────────
# Prints the recommended public-facing SEO filename for a given photo.
# Usage: seo_name "kitchen" "white cabinets" "walnut-creek" "1"
seo_name() {
  local service="$1"   # e.g. kitchen-remodel
  local detail="$2"    # e.g. white-shaker-cabinets
  local city="$3"      # e.g. walnut-creek
  local seq="$4"       # e.g. 1
  echo "${service}-${detail}-${city}-${seq}.webp" | tr ' ' '-' | tr '[:upper:]' '[:lower:]'
}

# ─── Run batch conversion ─────────────────────────────────────────────────────
batch_convert

echo ""
echo "SEO filename reminder:"
echo "  Public upload name format: [service]-[detail]-[city]-[number].webp"
echo "  Example: kitchen-remodel-walnut-creek-1.webp"
echo "  Alt text format: \"Kitchen remodel with white shaker cabinets in Walnut Creek, CA\""
echo ""
echo "Never upload files named: IMG_4829.jpg, DSC0012.jpg, photo (1).jpg"
