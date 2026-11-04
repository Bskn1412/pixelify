export type DocBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "callout"; tone: "info" | "tip" | "warning"; title: string; text: string }
  | { type: "steps"; items: { title: string; text: string }[] }
  | { type: "bullets"; items: string[] }
  | { type: "code"; language: string; title: string; code: string }
  | { type: "video"; title: string; description: string; duration: string; videoUrl?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

export type Article = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  updated: string;
  icon: string;
  featured?: boolean;
  blocks: DocBlock[];
};

export const navGroups = [
  {
    title: "GETTING STARTED",
    items: [
      { slug: "getting-started", label: "Welcome to Pixelify" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { slug: "background-remover", label: "Background Remover" },
      { slug: "ai-upscaler", label: "AI Upscaler" },
    ],
  },
  {
    title: "UNDER THE HOOD",
    items: [
      { slug: "models-and-performance", label: "Models & performance" },
      { slug: "privacy-and-security", label: "Privacy & security" },
    ],
  },
  {
    title: "HELP & SUPPORT",
    items: [
      { slug: "troubleshooting", label: "Troubleshooting" },
    ],
  },
];

export const articles: Record<string, Article> = {
  "getting-started": {
    slug: "getting-started",
    title: "Welcome to Pixelify",
    description: "Your first steps to sharper images, cleaner cutouts, and a faster creative workflow — right in your browser.",
    category: "Getting started",
    readTime: "4 min read",
    updated: "Getting started",
    icon: "sparkles",
    featured: true,
    blocks: [
      { type: "paragraph", text: "Pixelify brings AI-powered image tools into a clean, browser-based workspace. Remove backgrounds or upscale images without sending your source files to a cloud processing server." },
      { type: "callout", tone: "tip", title: "A quick recommendation", text: "For the smoothest experience with larger images and AI models, use an up-to-date desktop browser with plenty of available memory." },
      { type: "heading", id: "your-first-edit", text: "Make your first edit" },
      { type: "steps", items: [
        { title: "Choose a tool", text: "Open Background Remover to isolate a subject, or AI Upscaler to improve image detail and resolution." },
        { title: "Add an image", text: "Select an image from your device. Check the tool's current file-size limit before importing." },
        { title: "Let the model load", text: "On first use, Pixelify may download model assets to your browser cache. Keep the tab open while the engine initializes." },
        { title: "Preview and export", text: "Inspect the result, adjust available options, then export the processed image to your device." },
      ]},
      { type: "heading", id: "what-to-expect", text: "What to expect" },
      { type: "bullets", items: [
        "Image processing runs locally in your browser on supported devices.",
        "Model files may be downloaded once and reused from browser cache.",
        "Performance depends on image dimensions, available memory, browser support, and the selected execution engine.",
        "Some workflows may take longer on mobile devices or low-memory hardware.",
      ]},
      { type: "heading", id: "watch-and-learn", text: "Watch and learn" },
      { type: "video", title: "Pixelify in 60 seconds", description: "A short product walkthrough. Add your official tutorial URL in docs-data.ts when it is ready.", duration: "01:00", videoUrl: "" },
    ],
  },
  "background-remover": {
    slug: "background-remover",
    title: "Background Remover",
    description: "Create clean subject cutouts and transparent backgrounds with Pixelify's in-browser AI workflow.",
    category: "AI tools",
    readTime: "5 min read",
    updated: "AI tools",
    icon: "scan",
    featured: true,
    blocks: [
      { type: "paragraph", text: "Background Remover identifies the main subject in an image and separates it from the surrounding scene. The result can be exported with transparency for designs, product listings, presentations, and social content." },
      { type: "callout", tone: "info", title: "Local processing", text: "Pixelify is designed to process the image in your browser. Model assets may be downloaded and cached, but your selected source image is not uploaded to a cloud processing server." },
      { type: "heading", id: "remove-a-background", text: "Remove a background" },
      { type: "steps", items: [
        { title: "Open Background Remover", text: "Navigate to the Background Remover tool from the Pixelify workspace." },
        { title: "Import your image", text: "Choose a supported image. The currently stated maximum input size is 20 MB." },
        { title: "Wait for processing", text: "Allow the selected model and execution engine to initialize. Processing time varies by device and image complexity." },
        { title: "Review the cutout", text: "Check fine edges such as hair, fur, transparent objects, and narrow gaps. Use any available refinement controls." },
        { title: "Export", text: "Download the transparent result or use the available background options." },
      ]},
      { type: "heading", id: "better-results", text: "Tips for better results" },
      { type: "bullets", items: [
        "Use a sharp, well-lit image with a clearly visible subject.",
        "Avoid backgrounds that closely match the subject's colors.",
        "Keep the full subject inside the frame when possible.",
        "For hair, fur, glass, and motion blur, zoom in and inspect the edge before exporting.",
      ]},
      { type: "heading", id: "model-choice", text: "Choosing a model" },
      { type: "paragraph", text: "Pixelify can offer more than one background-removal model. A smaller model can be a faster, lighter default, while a larger model may provide improved results for certain images at a higher download and memory cost. The best choice depends on your device and the image." },
      { type: "callout", tone: "tip", title: "Keep the choice simple", text: "If multiple models are exposed in the interface, explain the practical difference in plain language (for example, Fast vs. High quality) rather than asking users to compare internal model names." },
      { type: "heading", id: "video-guide", text: "Video walkthrough" },
      { type: "video", title: "How to remove an image background", description: "Add the official Pixelify Background Remover walkthrough URL here.", duration: "02:35", videoUrl: "" },
    ],
  },
  "ai-upscaler": {
    slug: "ai-upscaler",
    title: "AI Upscaler",
    description: "Enhance image resolution with tiled AI upscaling, designed to run on your device.",
    category: "AI tools",
    readTime: "5 min read",
    updated: "AI tools",
    icon: "maximize",
    featured: true,
    blocks: [
      { type: "paragraph", text: "Pixelify AI Upscaler uses neural-network models to increase image dimensions and recover visual detail. Tiled processing can help work with larger images by processing them in smaller regions." },
      { type: "callout", tone: "warning", title: "Hardware matters", text: "Upscaling is memory-intensive. Large output dimensions can require substantial RAM and GPU resources, and performance varies significantly between devices." },
      { type: "heading", id: "upscale-image", text: "Upscale an image" },
      { type: "steps", items: [
        { title: "Open AI Upscaler", text: "Choose AI Upscaler from the Pixelify tools." },
        { title: "Import your image", text: "Select an image up to the currently stated 15 MB input limit." },
        { title: "Choose the scale", text: "Select the desired scale factor and available enhancement options." },
        { title: "Start processing", text: "Wait while the model initializes and processes the image. Avoid closing or refreshing the tab." },
        { title: "Inspect the result", text: "Compare the output with the original at 100% zoom, especially text, faces, edges, and fine textures." },
        { title: "Export your image", text: "Download the final image when processing is complete." },
      ]},
      { type: "heading", id: "output-size", text: "Output dimensions" },
      { type: "paragraph", text: "Pixelify's stated maximum export dimensions can reach 16,384 × 16,384 pixels (16K) where supported by the selected workflow and device. Actual limits may be lower depending on browser memory, GPU capabilities, model settings, and source dimensions." },
      { type: "heading", id: "quality-tips", text: "Get better results" },
      { type: "bullets", items: [
        "Start with the highest-quality source image available.",
        "Avoid repeatedly upscaling an already upscaled result.",
        "Use a lower scale factor if the browser runs out of memory.",
        "Check for artificial textures, halos, or over-sharpening before using the result professionally.",
      ]},
      { type: "video", title: "Upscale an image with Pixelify", description: "Add the official AI Upscaler tutorial URL here.", duration: "03:10", videoUrl: "" },
    ],
  },
  "models-and-performance": {
    slug: "models-and-performance",
    title: "Models & performance",
    description: "Understand model downloads, browser caching, execution engines, and the factors that affect speed.",
    category: "Under the hood",
    readTime: "6 min read",
    updated: "Under the hood",
    icon: "cpu",
    blocks: [
      { type: "paragraph", text: "Pixelify uses machine-learning models that run in the browser through supported inference runtimes and execution providers. The exact engine available can depend on browser, operating system, hardware, and model compatibility." },
      { type: "heading", id: "model-library", text: "Pixelify model library" },
      { type: "table", headers: ["Model / family", "Purpose"], rows: [
        ["Chopper", "Background removal"],
        ["Vitality", "Image upscaling"],
        ["Pixel-Dance", "Image upscaling"],
        ["Alpha-Satoru", "Image upscaling"],
      ]},
      { type: "callout", tone: "info", title: "Model assets and privacy", text: "Model weights may be downloaded to your browser and stored in its cache for reuse. This is separate from uploading your image for remote processing." },
      { type: "heading", id: "execution", text: "Execution engines" },
      { type: "paragraph", text: "Depending on the device and browser, Pixelify may use WebGPU or a WebAssembly-based execution path. WebGPU can accelerate compatible workloads, while WASM can provide a broader compatibility fallback. Availability and performance are browser-dependent." },
      { type: "heading", id: "performance", text: "Improve performance" },
      { type: "bullets", items: [
        "Use a current version of Chrome, Edge, or another supported browser.",
        "Close memory-heavy tabs and applications before processing large images.",
        "Keep the browser tab active during model initialization and processing.",
        "Try a smaller source image or lower upscale factor if memory is constrained.",
        "On laptops, connect power and use a performance-oriented power mode when appropriate.",
      ]},
      { type: "callout", tone: "warning", title: "Mobile devices", text: "Some mobile devices have limited memory or incomplete WebGPU support. If the engine does not initialize, update your browser, retry with a smaller image, or use a desktop/laptop for demanding workflows." },
    ],
  },
  "privacy-and-security": {
    slug: "privacy-and-security",
    title: "Privacy & security",
    description: "Learn how Pixelify's local-first image processing is designed to keep your files on your device.",
    category: "Under the hood",
    readTime: "4 min read",
    updated: "Under the hood",
    icon: "shield-check",
    blocks: [
      { type: "paragraph", text: "Pixelify is built around a local-first approach: supported image-processing tasks run on your device in the browser rather than sending your source image to a cloud processing server." },
      { type: "callout", tone: "info", title: "Zero cloud image processing", text: "Your source image stays in the browser for the local processing workflow. Browser model downloads and ordinary website/network requests are separate from uploading your image for AI processing." },
      { type: "heading", id: "what-stays-local", text: "What stays on your device?" },
      { type: "bullets", items: [
        "The source image selected for local processing.",
        "Intermediate image data used by the browser during the task.",
        "The resulting image until you choose to export or share it.",
      ]},
      { type: "heading", id: "model-downloads", text: "Why does Pixelify use the network?" },
      { type: "paragraph", text: "The browser may need to download application assets and AI model weights. These downloads allow the local inference engine to run. Browser caching may reduce repeat downloads, depending on cache settings and available storage." },
      { type: "heading", id: "good-practices", text: "Good security practices" },
      { type: "bullets", items: [
        "Use a trusted, up-to-date browser and operating system.",
        "Avoid processing sensitive images on shared or public devices.",
        "Clear site data if you want to remove locally cached website assets.",
        "Review Pixelify's published privacy policy for details about analytics, account features, and website-level data handling.",
      ]},
      { type: "callout", tone: "warning", title: "Scope of this page", text: "This page describes the local image-processing design. It is not a substitute for the full privacy policy or a guarantee that every website feature operates without network requests." },
    ],
  },
  "troubleshooting": {
    slug: "troubleshooting",
    title: "Troubleshooting",
    description: "Fix common model-loading, browser compatibility, memory, and export issues.",
    category: "Help & support",
    readTime: "6 min read",
    updated: "Help & support",
    icon: "life-buoy",
    blocks: [
      { type: "heading", id: "engine-stuck", text: "The engine is stuck initializing" },
      { type: "bullets", items: [
        "Refresh the page and try again after checking your connection.",
        "Update your browser to its latest stable version.",
        "Disable aggressive content blockers for the site temporarily if they prevent model assets from loading.",
        "Try another supported browser or a desktop device.",
        "Clear the site's cached data only if a previous model download appears corrupted; this may require downloading assets again.",
      ]},
      { type: "heading", id: "slow-processing", text: "Processing is very slow" },
      { type: "bullets", items: [
        "Close other tabs and memory-intensive applications.",
        "Use a smaller image or a lower upscale factor.",
        "Make sure your device is not in a battery-saving mode that heavily limits performance.",
        "Allow the first model load to finish; later runs may benefit from browser caching.",
      ]},
      { type: "heading", id: "out-of-memory", text: "The browser runs out of memory" },
      { type: "callout", tone: "warning", title: "Reduce the workload", text: "Large source images and high upscale factors can require substantial memory. Try a smaller source, a lower scale, or a device with more available RAM." },
      { type: "heading", id: "export-issue", text: "The export does not start or download" },
      { type: "bullets", items: [
        "Check whether the browser blocked the download.",
        "Confirm that the browser has permission to download files.",
        "Try a different filename or export format if the interface provides one.",
        "Ensure the processing step has completed before exporting.",
      ]},
      { type: "heading", id: "still-need-help", text: "Still need help?" },
      { type: "paragraph", text: "Add your official support email or feedback link here so users can report the browser, device, image dimensions, and exact error message. Ask users not to send private source images unless absolutely necessary." },
    ],
  },
};
