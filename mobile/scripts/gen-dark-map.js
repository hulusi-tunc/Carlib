#!/usr/bin/env node
// Regenerates assets/images/find-shop-map-dark.png from the light asset.
//
// The iOS app renders one map texture and applies .colorInvert() in dark mode.
// React Native has no equivalent filter, so the inverted variant is baked ahead
// of time and swapped by theme in (driver)/home/index.tsx. Re-run this whenever
// find-shop-map.png is re-exported from Figma.
//
// Requires Python 3 with Pillow (already used to produce the checked-in asset).
const { execFileSync } = require('child_process');
const path = require('path');

const assets = path.join(__dirname, '../assets/images');
const script = `
from PIL import Image, ImageOps
im = Image.open(r"${path.join(assets, 'find-shop-map.png')}").convert("RGBA")
alpha = im.getchannel("A")
out = ImageOps.invert(im.convert("RGB")).convert("RGBA")
out.putalpha(alpha)
out.save(r"${path.join(assets, 'find-shop-map-dark.png')}")
print("wrote find-shop-map-dark.png", out.size)
`;

execFileSync('python3', ['-c', script], { stdio: 'inherit' });
