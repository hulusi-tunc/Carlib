#!/usr/bin/env node
// Derives the native splash mark and the Android adaptive-icon foreground from
// the shipped app icon (assets/images/icon-1024.png — white "Carlib" wordmark
// on black).
//
// splash: wordmark tinted brand yellow on transparent, so the native splash
// composites it on #1a1a1a and matches the animated JS splash exactly.
// android foreground: white wordmark on transparent, inside the adaptive-icon
// safe zone, over a black background colour (parity with the iOS icon).
//
// Requires Python 3 with Pillow.
const { execFileSync } = require('child_process');
const path = require('path');

const assets = path.join(__dirname, '../assets/images');
const p = (name) => JSON.stringify(path.join(assets, name));

const script = `
from PIL import Image

src = Image.open(${p('icon-1024.png')}).convert("RGB")
# The wordmark is white on black: luminance doubles as the alpha mask.
alpha = src.convert("L")
mark = alpha.crop(alpha.getbbox())

def tinted(mask, rgb, canvas, scale):
    w = int(canvas * scale)
    h = max(1, round(mask.height * (w / mask.width)))
    m = mask.resize((w, h), Image.LANCZOS)
    out = Image.new("RGBA", (canvas, canvas), (0, 0, 0, 0))
    layer = Image.new("RGBA", m.size, rgb + (255,))
    layer.putalpha(m)
    out.paste(layer, ((canvas - w) // 2, (canvas - h) // 2), layer)
    return out

# Brand yellow #F5B700, generous size — expo-splash-screen scales via imageWidth.
tinted(mark, (245, 183, 0), 1024, 0.80).save(${p('carlib-splash.png')})
# Adaptive icons clip to a circle; keep the mark inside the ~66% safe zone.
tinted(mark, (255, 255, 255), 1024, 0.58).save(${p('android-icon-foreground.png')})
print("wrote carlib-splash.png and android-icon-foreground.png")
`;

execFileSync('python3', ['-c', script], { stdio: 'inherit' });
