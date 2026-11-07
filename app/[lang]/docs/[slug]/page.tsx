import { notFound } from "next/navigation";
import { DocsArticlePage } from "@/components/docs/docs-article-page";
import { DocsHome } from "@/components/docs/docs-home";
import { articles } from "@/data/docs/docs-data";
import { SITE_LANGUAGES } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = [...Object.keys(articles), "overview"];
  return SITE_LANGUAGES.flatMap((l) =>
    slugs.map((slug) => ({ lang: l.code, slug }))
  );
}

export default async function LocalizedArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "overview") {
    return <DocsHome />;
  }
  const article = articles[slug];

  if (!article) notFound();

  return <DocsArticlePage article={article} />;
}
