import { notFound } from "next/navigation";
import { DocsArticlePage } from "@/components/pixelify-docs/docs-article-page";
import { articles } from "@/data/docs/docs-data";

export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) notFound();

  return <DocsArticlePage article={article} />;
}
