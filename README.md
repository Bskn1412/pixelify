# Image Upscaler

Browser-only image super-resolution using ONNX Runtime Web. Runs completely client-side with no backend required.

## Features

- Drag & drop image upload
- PNG, JPG, WEBP support
- Maximum input size: 4096×4096
- Three upscaler models: Vitality (fast, 4×), Pixel-Dance (balanced, 4×), and Alpha-Satoru (maximum quality, 4×)
- Chopper AI for instant background removal
- WebGPU/WASM runtime with automatic detection
- Tiled inference for large images
- Side-by-side before/after comparison slider
- Download upscaled result as PNG

## Project Structure

```
upscaler/
├── index.html
├── package.json         # React, Vite, Tailwind
├── vite.config.ts       # COOP/COEP headers, port 3000
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── models/
│       ├── Vitality.onnx       # Vitality (~1.9MB, 4×, RGB)
│       ├── Pixel-Dance.onnx    # Pixel-Dance (~66.9MB, 4×, RGB)
│       ├── Alpha-Satoru.onnx   # Alpha-Satoru (~67.1MB, 4×, RGB)
│       └── README.md
├── libs/
│   ├── ort-wasm.wasm
│   └── ort-wasm-simd.wasm
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── constants.ts        # Model configs, backend detection
    ├── types.ts
    ├── hooks/
    │   ├── useONNX.ts      # ONNX Runtime lifecycle
    │   ├── useImageFile.ts # File validation & reading
    │   └── useUpscale.ts   # Multi-pass upscale pipeline
    ├── utils/
    │   ├── upscale.ts      # ONNX session + tiled inference
    │   └── imageProcessing.ts  # Color space conversion
    └── components/
        ├── Header.tsx
        ├── StepIndicator.tsx
        ├── UploadArea.tsx
        ├── ImageComparison.tsx  # Before/after slider
        ├── ControlPanel.tsx
        ├── ModelInfoPanel.tsx
        ├── ProgressCard.tsx
        ├── StatsBar.tsx
        └── ErrorMessage.tsx
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open http://localhost:3000

## Building

```bash
npm run build
```

Output in `dist/` folder.

## Models

| Model | Scale | Channels | Size | Speed |
|-------|-------|----------|------|-------|
| Vitality | 4× | RGB | 1.9MB | ~200-400ms |
| Pixel-Dance | 4× | RGB | 66.9MB | ~1-3s/tile |
| Alpha-Satoru | 4× | RGB | 67.1MB | ~1-3s/tile |
| Chopper (BG Remover) | - | RGB | - | Real-time |

## Deployment

Deploy `dist/` to any static host.

### GitHub Pages

1. In your repository, go to **Settings > Pages**.
2. Set **Build and deployment** to **GitHub Actions**.
3. Push to `main` to build and publish automatically.

The app uses a relative Vite base path, so it works when hosted as a project page like `https://<user>.github.io/<repo>/`.

For a local publish flow, run `npm run deploy` to build and push `dist/` to the `gh-pages` branch, then set Pages to serve from that branch if you prefer manual deployment.

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WASM | ✅ 57+ | ✅ 52+ | ✅ 11+ | ✅ 79+ |
| WebGPU | ✅ 113+ (HTTPS) | ❌ | ✅ 17+ (HTTPS) | ✅ 113+ (HTTPS) |

**Note:** WebGPU requires HTTPS or localhost.

## Troubleshooting

**Model fails to load**
- Check browser console for errors
- Pixel-Dance and Alpha-Satoru are ~67MB and may take time to download

**Slow inference**
- Enable WebAssembly SIMD
- Use WebGPU (HTTPS only)

**Memory errors**
- Reduce input image size
- Use Vitality model instead of larger models
