// Renders the New Braunfels Elite Water Softener logo (drop + name + orange ELITE tag).
// Usage: node make-logo.mjs <out-folder>   (needs sharp from the site project; system fonts: Segoe UI or Arial)
import fs from "node:fs";
import { createRequire } from "node:module";
const SITE = "C:/Users/lenevo/waterSoftenerProjects/newbraunfelselitewatersoftener";
const sharp = createRequire(SITE + "/")("sharp");
const NAVY = "#1A3C5E", DARK = "#12293F", ORANGE = "#E87722";
const FONT = "Segoe UI, Arial, Helvetica, sans-serif";
const DROP = "M50 3 C50 3 15 40 15 64 A35 35 0 0 0 85 64 C85 40 50 3 50 3 Z";
const mark = (id, ring) => `<defs><clipPath id="${id}"><path d="${DROP}"/></clipPath><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A5A8C"/><stop offset="1" stop-color="${NAVY}"/></linearGradient></defs>
<path d="${DROP}" fill="url(#${id}g)" ${ring ? 'stroke="#FFFFFF" stroke-width="3"' : ""}/><g clip-path="url(#${id})"><path d="M5 66 C20 54 34 56 48 65 C62 74 76 72 95 58 L95 100 L5 100 Z" fill="${ORANGE}"/><path d="M5 80 C20 70 36 72 50 80 C64 88 78 86 95 74 L95 100 L5 100 Z" fill="${ring ? "#FFFFFF" : "#CFE0F0"}"/><path d="M5 92 C22 85 38 87 52 93 C66 99 80 97 95 88 L95 100 L5 100 Z" fill="${DARK}"/></g>
<path d="M31 44 C27 51 26 58 28 65" fill="none" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round" opacity="0.9"/>`;
const T = (x, y, s, size, w, fill, ls, extra = "") => `<text x="${x}" y="${y}" ${extra} font-family="${FONT}" font-size="${size}" font-weight="${w}" letter-spacing="${ls}" fill="${fill}">${s}</text>`;
const lockup = (reversed) => {
  const name = reversed ? "#FFFFFF" : NAVY;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
<g transform="translate(6 6) scale(2.88)">${mark(reversed ? "r" : "n", reversed)}</g>
${T(318, 130, "NEW BRAUNFELS", 100, 800, name, 1)}
<rect x="322" y="160" width="250" height="92" rx="18" fill="${ORANGE}"/>
${T(447, 228, "ELITE", 74, 900, "#FFFFFF", 6, 'text-anchor="middle"')}
${T(596, 228, "WATER SOFTENER", 50, 800, name, 5)}
</svg>`;
};
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 100 100" role="img" aria-label="New Braunfels Elite Water Softener">${mark("f", false)}</svg>`;
const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(`${out}/logo.svg`, lockup(false)); fs.writeFileSync(`${out}/logo-reversed.svg`, lockup(true)); fs.writeFileSync(`${out}/favicon.svg`, icon);
await sharp(Buffer.from(lockup(false))).png().toFile(`${out}/logo.png`);
await sharp(Buffer.from(lockup(true))).png().toFile(`${out}/logo-reversed.png`);
const navyBg = await sharp({ create: { width: 1200, height: 300, channels: 4, background: NAVY } }).composite([{ input: `${out}/logo-reversed.png` }]).png().toBuffer();
const small = await sharp(`${out}/logo.png`).resize({ height: 54 }).png().toBuffer();
await sharp({ create: { width: 1200, height: 660, channels: 4, background: "#FFFFFF" } })
  .composite([{ input: `${out}/logo.png`, top: 0, left: 0 }, { input: navyBg, top: 300, left: 0 }, { input: small, top: 610, left: 20 }]).png().toFile(`${out}/preview.png`);
console.log("ok");
