#!/usr/bin/env node
// Regenerates assets/icons/remixicon-glyphmap.json from the iOS app's generated
// RemixIcon.swift enum (the original remixicon.glyph.json is not in the repo).
// Keys are the Swift enum case names so RN code mirrors the iOS call sites
// (RemixIcon.homeLine -> <RemixIcon name="homeLine" />).
const fs = require('fs');
const path = require('path');

const SWIFT_SOURCE = path.join(__dirname, '../../Carlib/DesignSystem/RemixIcon.swift');
const OUT = path.join(__dirname, '../assets/icons/remixicon-glyphmap.json');

const swift = fs.readFileSync(SWIFT_SOURCE, 'utf8');
const caseRe = /case\s+(\w+)\s*=\s*"\\u\{([0-9A-Fa-f]+)\}"/g;

const glyphMap = {};
let m;
while ((m = caseRe.exec(swift)) !== null) {
  glyphMap[m[1]] = parseInt(m[2], 16);
}

const count = Object.keys(glyphMap).length;
if (count < 3000) {
  throw new Error(`Parsed only ${count} glyphs — RemixIcon.swift format changed?`);
}

fs.writeFileSync(OUT, JSON.stringify(glyphMap, null, 0) + '\n');
console.log(`Wrote ${count} glyphs to ${path.relative(process.cwd(), OUT)}`);
