import sharp from "sharp";
import path from "node:path";
import { mkdir } from "node:fs/promises";

const root = path.join(process.cwd(), "public", "uploads");

async function solid(folder, filename, { width, height, r, g, b }) {
  await mkdir(path.join(root, folder), { recursive: true });
  await sharp({
    create: { width, height, channels: 3, background: { r, g, b } },
  })
    .png()
    .toFile(path.join(root, folder, filename));
  console.log(`wrote ${folder}/${filename}`);
}

await solid("gallery", "placeholder-1.png", { width: 900, height: 1200, r: 26, g: 24, b: 22 });
await solid("gallery", "placeholder-2.png", { width: 900, height: 1200, r: 34, g: 30, b: 26 });
await solid("gallery", "placeholder-3.png", { width: 900, height: 1200, r: 20, g: 20, b: 20 });
await solid("facilitators", "placeholder.png", { width: 800, height: 1000, r: 40, g: 38, b: 35 });
await solid("workshops", "placeholder.png", { width: 900, height: 1200, r: 30, g: 26, b: 22 });
await solid("partners", "placeholder.png", { width: 400, height: 160, r: 226, g: 222, b: 214 });

console.log("Done.");
