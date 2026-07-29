#!/bin/bash

# 03 - Gamme Étiquette 1
cat > 03-gamme-label-1.svg << 'SVG'
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1e293b"/>
  <text x="200" y="150" font-size="40" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG 03</text>
  <text x="200" y="210" font-size="18" fill="#64748b" text-anchor="middle" font-family="Arial">Gamme Étiquette 1</text>
</svg>
SVG

# 04 - Gamme Bouteille 2
cat > 04-gamme-bottle-2.svg << 'SVG'
<svg viewBox="0 0 300 480" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="480" fill="#1e293b"/>
  <text x="150" y="240" font-size="48" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG 04</text>
  <text x="150" y="320" font-size="20" fill="#64748b" text-anchor="middle" font-family="Arial">Gamme Bouteille 2</text>
  <text x="150" y="350" font-size="14" fill="#475569" text-anchor="middle" font-family="Arial">Format 9:16</text>
</svg>
SVG

# 05 - Gamme Étiquette 2
cat > 05-gamme-label-2.svg << 'SVG'
<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#1e293b"/>
  <text x="200" y="150" font-size="40" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG 05</text>
  <text x="200" y="210" font-size="18" fill="#64748b" text-anchor="middle" font-family="Arial">Gamme Étiquette 2</text>
</svg>
SVG

# 06 - Textures macro 1
cat > 06-textures-macro-1.svg << 'SVG'
<svg viewBox="0 0 800 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="320" fill="#1e293b"/>
  <text x="400" y="160" font-size="48" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG 06</text>
  <text x="400" y="240" font-size="20" fill="#64748b" text-anchor="middle" font-family="Arial">Textures Macro 1 (Bouchon liège)</text>
</svg>
SVG

# 07 - Textures macro 2
cat > 07-textures-macro-2.svg << 'SVG'
<svg viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="320" fill="#1e293b"/>
  <text x="160" y="160" font-size="40" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG 07</text>
  <text x="160" y="240" font-size="16" fill="#64748b" text-anchor="middle" font-family="Arial">Textures Macro 2</text>
  <text x="160" y="270" font-size="14" fill="#475569" text-anchor="middle" font-family="Arial">(Étiquette+Dorure)</text>
</svg>
SVG

# 08-11 - Tech Breakdown (4 carrés)
for i in 08 09 10 11; do
  num=${i:2:2}
  cat > "$i-tech-pass-$num.svg" << "SVG"
<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="300" height="300" fill="#1e293b"/>
  <text x="150" y="150" font-size="48" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG $i</text>
  <text x="150" y="220" font-size="16" fill="#64748b" text-anchor="middle" font-family="Arial">Tech Pass $num</text>
</svg>
SVG
done

# 12-15 - Packshots (4 images)
for i in 12 13 14 15; do
  num=$(($i - 11))
  cat > "$i-packshot-$num.svg" << "SVG"
<svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="600" fill="#1e293b"/>
  <text x="200" y="300" font-size="48" font-weight="bold" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" font-family="Arial">IMG $i</text>
  <text x="200" y="380" font-size="18" fill="#64748b" text-anchor="middle" font-family="Arial">Packshot $num</text>
  <text x="200" y="420" font-size="14" fill="#475569" text-anchor="middle" font-family="Arial">Portrait (2:3)</text>
</svg>
SVG
done

echo "✓ Tous les placeholders créés"
