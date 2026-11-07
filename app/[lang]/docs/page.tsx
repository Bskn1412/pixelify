import { DocsHome } from "@/components/docs/docs-home";
import { SITE_LANGUAGES } from '@/lib/i18n';

export function generateStaticParams() {
  return SITE_LANGUAGES.map((lang) => ({ lang: lang.code }));
}

export const metadata = {
  title: "Pixelify Docs - Overview",
  description: "Guides, tutorials, and answers for Pixelify's browser-based AI image tools.",
};

export default function LocalizedDocsPage() {
  return <DocsHome />;
}
