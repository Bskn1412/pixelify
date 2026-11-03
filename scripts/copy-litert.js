import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.resolve(__dirname, '../node_modules/@litertjs/core/wasm');
const destDir = path.resolve(__dirname, '../public/litert/wasm');

if (fs.existsSync(srcDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  // Only copy JS loader files, not heavy WASM binaries (which are loaded remotely from Hugging Face)
  const entries = fs.readdirSync(srcDir);
  for (const entry of entries) {
    if (entry.endsWith('.wasm')) {
      continue; // Skip WASM binaries (~50MB) to keep repository and static deployment lightweight
    }
    const srcFile = path.join(srcDir, entry);
    const destFile = path.join(destDir, entry);
    // Don't overwrite existing JS loaders that contain Hugging Face remote resolution logic
    if (!fs.existsSync(destFile)) {
      fs.copyFileSync(srcFile, destFile);
      console.log(`[copy-litert] Copied ${entry} to public/litert/wasm`);
    }
  }
  console.log('[copy-litert] Verified LiteRT JS loaders in public/litert/wasm (WASM binaries loaded remotely from Hugging Face)');
} else {
  console.warn('[copy-litert] Warning: source directory not found at', srcDir);
}
