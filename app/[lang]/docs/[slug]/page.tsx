import { notFound } from "next/navigation";
import { DocsArticlePage } from "@/components/pixelify-docs/docs-article-page";
import { articles } from "@/data/docs/docs-data";
import { SITE_LANGUAGES } from "@/lib/i18n";

export function generateStaticParams() {
  const slugs = Object.keys(articles);
  return SITE_LANGUAGES.flatMap((l) =>
    slugs.map((slug) => ({ lang: l.code, slug }))
  );
}

export default async function LocalizedArticlePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { slug } = params;
  const article = articles[slug];

  if (!article) notFound();

  return <DocsArticlePage article={article} />;
}

