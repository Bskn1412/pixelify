import { notFound } from "next/navigation";
import { DocsArticlePage } from "@/components/docs/docs-article-page";
import { DocsHome } from "@/components/docs/docs-home";
import { articles } from "@/data/docs/docs-data";

export function generateStaticParams() {
  return [...Object.keys(articles), "overview"].map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "overview") {
    return <DocsHome />;
  }
  const article = articles[slug];

  if (!article) notFound();

  return <DocsArticlePage article={article} />;
}
