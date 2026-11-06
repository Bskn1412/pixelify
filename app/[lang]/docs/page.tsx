import { DocsHome } from "@/components/pixelify-docs/docs-home";
import { SITE_LANGUAGES } from '@/lib/i18n';

export function generateStaticParams() {
  return SITE_LANGUAGES.map((lang) => ({ lang: lang.code }));
}

export const metadata = {
  title: "Pixelify Docs — Learn, create, and get more from Pixelify",
  description: "Guides, tutorials, and answers for Pixelify's browser-based AI image tools.",
};

export default function LocalizedDocsPage() {
  return <DocsHome />;
}

