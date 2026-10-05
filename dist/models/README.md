# ONNX Super-Resolution Models

## Active Models

### 1. 4x-ClearReality V1
- **File**: `4x-ClearRealityV1.onnx`
- **Size**: ~1.9 MB
- **Scale**: 4×
- **Architecture**: Compact CNN Super-Resolution
- **Input**: NCHW `[1, 3, H, W]`, float32 [0, 1] normalized RGB (input name: `input`)
- **Output**: NCHW `[1, 3, 4H, 4W]`, float32 RGB (output name: `output`)
- **Acceleration**: WebGPU (JSEP) with automatic WASM SIMD fallback
- **Characteristics**: Ultra-fast (~100ms), low memory footprint, crystal-clear edges and de-blurring. Ideal for quick previews, anime, and illustrations.

### 2. 4x-UltraSharp
- **File**: `4x-UltraSharp.onnx`
- **Size**: ~66.9 MB
- **Scale**: 4×
- **Architecture**: Deep Generative Residual Dense Network (ESRGAN / RRDBNet)
- **Input**: NCHW `[1, 3, H, W]`, float32 [0, 1] normalized RGB (input name: `data`)
- **Output**: NCHW `[1, 3, 4H, 4W]`, float32 RGB (output name: `output`)
- **Acceleration**: WebGPU (JSEP) with automatic WASM SIMD fallback
- **Characteristics**: High-fidelity micro-texture reconstruction, sharp photographic depth, and 8K clarity.

### 3. Real-ESRGAN Studio
- **File**: `Real-ESRGAN-x4plus.onnx`
- **Size**: ~67.1 MB
- **Scale**: 4×
- **Architecture**: Real-ESRGAN+
- **Input**: NCHW `[1, 3, H, W]`, float32 [0, 1] normalized RGB (input name: `image`)
- **Output**: NCHW `[1, 3, 4H, 4W]`, float32 RGB (output name: `upscaled_image`)
- **Acceleration**: WebGPU (JSEP) with automatic WASM SIMD fallback
- **Characteristics**: Studio portrait enhancement, heavy artifact removal, and balanced restoration.