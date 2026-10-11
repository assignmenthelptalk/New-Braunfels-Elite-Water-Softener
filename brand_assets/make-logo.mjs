import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
const SITE = "C:/Users/lenevo/waterSoftenerProjects/newbraunfelselitewatersoftener";
const sharp = createRequire(SITE + "/")("sharp");

const NAVY = "#1A3C5E", DARK = "#12293F", ORANGE = "#E87722", LIGHT = "#E6EDF4";
const FONT = "Segoe UI, Arial, Helvetica, sans-serif";

// Drop mark in a 100 x 100 box: navy drop, river wave and hill-country ridge inside, white highlight.
const DROP = "M50 5 C50 5 19 40 19 63 A31 31 0 0 0 81 63 C81 40 50 5 50 5 Z";
const mark = (id) => `
  <defs>
    <clipPath id="${id}"><path d="${DROP}"/></clipPath>
    <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#24507B"/><stop offset="1" stop-color="${DARK}"/></linearGradient>
  </defs>
  <path d="${DROP}" fill="url(#${id}g)"/>
  <g clip-path="url(#${id})">
    <path d="M10 70 C24 60 34 62 46 69 C58 76 70 74 92 62 L92 100 L10 100 Z" fill="${ORANGE}"/>
    <path d="M10 80 C24 72 36 74 48 80 C60 86 72 85 92 75 L92 100 L10 100 Z" fill="${LIGHT}" opacity="0.95"/>
    <path d="M10 88 C26 82 38 84 50 89 C62 94 74 93 92 85 L92 100 L10 100 Z" fill="${NAVY}"/>
  </g>
  <path d="M33 47 C30 53 29 58 30 63" fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" opacity="0.85"/>`;

const full = () => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300">
  <g transform="translate(18 22) scale(2.56)">${mark("a")}</g>
  <text x="318" y="148" font-family="${FONT}" font-size="96" font-weight="800" letter-spacing="2" fill="${NAVY}">NEW BRAUNFELS</text>
  <rect x="322" y="170" width="90" height="7" rx="3.5" fill="${ORANGE}"/>
  <text x="320" y="238" font-family="${FONT}" font-size="52" font-weight="700" letter-spacing="9" fill="${ORANGE}">ELITE WATER SOFTENER</text>
</svg>`;

const icon = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100" role="img" aria-label="New Braunfels Elite Water Softener">${mark("f")}</svg>`;

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "logo.svg"), full());
fs.writeFileSync(path.join(out, "favicon.svg"), icon(64));
await sharp(Buffer.from(full())).png().toFile(path.join(out, "logo.png"));
await sharp(Buffer.from(icon(512))).png().toFile(path.join(out, "favicon.png"));
// preview on white and on navy
await sharp({ create: { width: 1200, height: 300, channels: 4, background: "#FFFFFF" } })
  .composite([{ input: path.join(out, "logo.png") }]).png().toFile(path.join(out, "preview-white.png"));
console.log("done", out);
