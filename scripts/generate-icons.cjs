const fs = require('node:fs');
const path = require('node:path');
const { deflateSync } = require('node:zlib');
const { Resvg } = require('@resvg/resvg-js');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(
  path.join(root, 'assets/branding/library-icon.svg'),
  'utf8',
);
const check = process.argv.includes('--check');
const failures = [];
let count = 0;

function group(id) {
  const match = source.match(new RegExp(`<g id="${id}"[^>]*>[\\s\\S]*?</g>`));
  if (!match) throw new Error(`Missing SVG group: ${id}`);
  return match[0];
}
const defs = source.match(/<defs>[\s\S]*?<\/defs>/)[0];
const background = group('background');
const mark = group('mark');
const shadow = group('mark-shadow');
const svg = content =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${defs}${content}</svg>`;
const foreground = svg(
  `<g transform="translate(512 512) scale(0.87) translate(-512 -512)">${shadow}${mark}</g>`,
);
const monochrome = svg(
  `<g transform="translate(512 512) scale(0.87) translate(-512 -512)">${mark.replace(
    /fill="#[0-9A-Fa-f]{6}"/g,
    'fill="#FFFFFF"',
  )}</g>`,
);

/* eslint-disable no-bitwise -- PNG CRC-32 requires unsigned bit arithmetic. */
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++)
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
/* eslint-enable no-bitwise */
function chunk(type, data) {
  const name = Buffer.from(type);
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length, 0);
  name.copy(output, 4);
  data.copy(output, 8);
  output.writeUInt32BE(crc32(Buffer.concat([name, data])), data.length + 8);
  return output;
}
// Apple app icons must have no alpha channel, including when all pixels are opaque.
function rgbPng(image) {
  const { width, height, pixels } = image;
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 2;
  const stride = width * 3 + 1;
  const rows = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (pixels[index + 3] !== 255)
        throw new Error('iOS icon contains transparency');
      pixels.copy(rows, y * stride + 1 + x * 3, index, index + 3);
    }
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(rows, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
function render(input, size) {
  return new Resvg(input, {
    fitTo: { mode: 'width', value: size },
    font: { loadSystemFonts: false },
  }).render();
}
function emit(relative, bytes) {
  count++;
  const target = path.join(root, relative);
  if (check) {
    if (!fs.existsSync(target) || !fs.readFileSync(target).equals(bytes))
      failures.push(relative);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, bytes);
  }
}
function legacy(round) {
  const shape = round
    ? '<circle cx="512" cy="512" r="512"/>'
    : '<rect width="1024" height="1024" rx="224"/>';
  return svg(
    `<defs><clipPath id="launcher-mask">${shape}</clipPath></defs><g clip-path="url(#launcher-mask)">${background}${shadow}${mark}</g>`,
  );
}
const densities = { mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
for (const [density, scale] of Object.entries(densities)) {
  const folder = `android/app/src/main/res/mipmap-${density}`;
  emit(`${folder}/ic_launcher.png`, render(legacy(false), 48 * scale).asPng());
  emit(
    `${folder}/ic_launcher_round.png`,
    render(legacy(true), 48 * scale).asPng(),
  );
  const fg = render(foreground, 108 * scale);
  // All foreground pixels must stay within the adaptive icon's 66dp safe circle.
  const pixels = fg.pixels;
  const center = fg.width / 2;
  for (let y = 0; y < fg.height; y++) {
    for (let x = 0; x < fg.width; x++) {
      if (
        pixels[(y * fg.width + x) * 4 + 3] > 8 &&
        Math.hypot(x + 0.5 - center, y + 0.5 - center) > 33 * scale
      ) {
        throw new Error(
          `Adaptive foreground exceeds safe circle at ${density}`,
        );
      }
    }
  }
  emit(
    `${folder}/ic_launcher_background.png`,
    rgbPng(render(svg(background), 108 * scale)),
  );
  emit(`${folder}/ic_launcher_foreground.png`, fg.asPng());
  emit(
    `${folder}/ic_launcher_monochrome.png`,
    render(monochrome, 108 * scale).asPng(),
  );
  for (const name of [
    'ic_launcher',
    'ic_launcher_round',
    'ic_launcher_foreground',
  ]) {
    const old = path.join(root, folder, `${name}.webp`);
    if (fs.existsSync(old)) {
      if (check) failures.push(`${folder}/${name}.webp (obsolete)`);
      else fs.unlinkSync(old);
    }
  }
}
const adaptiveXml = Buffer.from(`<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
    <monochrome android:drawable="@mipmap/ic_launcher_monochrome"/>
</adaptive-icon>
`);
for (const name of ['ic_launcher', 'ic_launcher_round']) {
  emit(`android/app/src/main/res/mipmap-anydpi-v26/${name}.xml`, adaptiveXml);
}
const obsoleteBackground = path.join(
  root,
  'android/app/src/main/res/values/ic_launcher_background.xml',
);
if (fs.existsSync(obsoleteBackground)) {
  if (check) failures.push('obsolete launcher background color resource');
  else fs.unlinkSync(obsoleteBackground);
}
const ios = 'ios/LibraryApp/Images.xcassets/AppIcon.appiconset';
const slots = [
  ...['20x20', '29x29', '40x40', '60x60'].flatMap(size =>
    ['2x', '3x'].map(scale => ({ idiom: 'iphone', size, scale })),
  ),
  ...['20x20', '29x29', '40x40', '76x76'].flatMap(size =>
    ['1x', '2x'].map(scale => ({ idiom: 'ipad', size, scale })),
  ),
  { idiom: 'ipad', size: '83.5x83.5', scale: '2x' },
  { idiom: 'ios-marketing', size: '1024x1024', scale: '1x' },
];
const sizes = new Set();
for (const slot of slots) {
  const pixels = parseFloat(slot.size) * parseFloat(slot.scale);
  slot.filename = `AppIcon-${pixels}.png`;
  sizes.add(pixels);
}
for (const size of sizes)
  emit(`${ios}/AppIcon-${size}.png`, rgbPng(render(source, size)));
emit(
  `${ios}/Contents.json`,
  Buffer.from(
    JSON.stringify(
      { images: slots, info: { author: 'xcode', version: 1 } },
      null,
      2,
    ) + '\n',
  ),
);
if (failures.length) {
  process.stderr.write(
    `App icon assets need regeneration. Run pnpm icons:generate:\n${failures.join(
      '\n',
    )}\n`,
  );
  process.exit(1);
}
process.stdout.write(
  `${
    check ? 'Verified' : 'Generated'
  } ${count} Android/iOS app icon assets from library-icon.svg.\n`,
);
