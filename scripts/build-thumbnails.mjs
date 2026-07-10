import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const rootDirectory = path.resolve(scriptDirectory, '..');
const photoDirectory = path.join(rootDirectory, 'photos');
const outputDirectory = path.join(photoDirectory, 'thumbs');
const sourceListPath = path.join(photoDirectory, 'gallery_code.txt');
const manifestPath = path.join(photoDirectory, 'gallery_manifest.json');

const sourcePaths = (await readFile(sourceListPath, 'utf8'))
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

await mkdir(outputDirectory, { recursive: true });

let sourceBytes = 0;
let outputBytes = 0;
const manifest = [];

for (const relativeSourcePath of sourcePaths) {
  const sourcePath = path.resolve(rootDirectory, relativeSourcePath);
  const expectedPrefix = `${photoDirectory}${path.sep}`;

  if (!sourcePath.startsWith(expectedPrefix)) {
    throw new Error(`Gallery source is outside photos/: ${relativeSourcePath}`);
  }

  const outputName = `${path.parse(relativeSourcePath).name}.webp`;
  const outputPath = path.join(outputDirectory, outputName);

  const outputInfo = await sharp(sourcePath)
    .rotate()
    .resize({ width: 960, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  sourceBytes += (await stat(sourcePath)).size;
  outputBytes += (await stat(outputPath)).size;
  manifest.push({
    src: relativeSourcePath.replaceAll('\\', '/'),
    thumbnail: `photos/thumbs/${outputName}`,
    width: outputInfo.width,
    height: outputInfo.height,
  });
}

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

const reduction = sourceBytes === 0 ? 0 : (1 - outputBytes / sourceBytes) * 100;
console.log(
  `Generated ${sourcePaths.length} thumbnails and gallery manifest: ` +
    `${(sourceBytes / 1024 / 1024).toFixed(2)} MB -> ` +
    `${(outputBytes / 1024 / 1024).toFixed(2)} MB ` +
    `(${reduction.toFixed(1)}% smaller)`,
);
