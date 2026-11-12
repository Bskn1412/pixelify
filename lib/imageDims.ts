/**
 * Intrinsic dimensions for the finite set of static blog images in
 * /public/blog. Supplying width/height to every <img> avoids layout
 * shift before the CSS aspect boxes paint and lets the browser reserve
 * the final aspect ratio from the HTML alone.
 */
const BLOG_IMAGE_DIMS: Record<string, readonly [number, number]> = {
  '/blog/bgremove-page.jpg': [1600, 1000],
  '/blog/bgremove-showcase.jpg': [1600, 1000],
  '/blog/home-hero.jpg': [1600, 1000],
  '/blog/home-mobile.jpg': [1080, 1920],
  '/blog/home-samples.jpg': [1600, 1000],
  '/blog/settings-engine.jpg': [1600, 1000],
  '/blog/story-page.jpg': [1600, 1000],
  '/blog/upscaler-page.jpg': [1600, 1000],
  '/blog/upscaler-sections.jpg': [1600, 1000],
  '/blog/how-to-webgpu-chrome.png': [1110, 675],
  '/blog/chrome.webp': [256, 256],
  '/blog/microsoft-edge.webp': [512, 512],
  '/blog/firefox.png': [256, 256],
  '/blog/brave-browser-icon.webp': [256, 256],
  '/blog/safari.png': [512, 512],
};

export function getBlogImageDims(src: string): { width: number; height: number } | undefined {
  const dims = BLOG_IMAGE_DIMS[src];
  if (!dims) return undefined;
  return { width: dims[0], height: dims[1] };
}
