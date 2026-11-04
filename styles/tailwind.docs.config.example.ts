import type { Config } from "tailwindcss";

/**
 * Merge these content globs into your existing Tailwind config.
 * Do not replace your project's existing theme/plugins with this example.
 */
const config: Partial<Config> = {
  content: [
    "./app/docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/pixelify-docs/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/pixelify-docs/**/*.{js,ts,jsx,tsx,mdx}",
  ],
};

export default config;