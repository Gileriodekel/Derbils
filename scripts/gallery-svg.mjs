import { mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: 'custom' });
try {
  const { config } = await server.ssrLoadModule('/src/data/config.ts');
  const { derbilSvg } = await server.ssrLoadModule('/src/render/dynasty-art.ts');
  const { gallerySamples } = await server.ssrLoadModule('/src/render/gallery.ts');
  await mkdir('out/gallery', { recursive: true });
  const samples = gallerySamples();
  for (const sample of samples) {
    await writeFile(`out/gallery/${sample.id}.svg`, derbilSvg(sample.creature));
  }
  console.log(`Wrote ${samples.length} SVGs to out/gallery/ (base, five stats, all-max, ${config.appearance.gallery.randomCount} seeded founders, progression, families and inherited color ranges).`);
} finally { await server.close(); }
