import type { Metadata } from 'next';
import BlogPostView from '@/components/BlogPostView';
import NotFound from '@/components/NotFound';
import { getAllPosts, getPostBySlug, postPath, LANGUAGES } from '@/data/posts';
import { SITE_LANGUAGES } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';

export function generateStaticParams() {
  return SITE_LANGUAGES.flatMap((l) =>
    getAllPosts(l.code).map((p) => ({
      lang: l.code,
      slug: p.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const { lang, slug } = params;
  const post = getPostBySlug(slug, lang);

  if (!post) {
    return { title: 'Article not found | Pixelify' };
  }

  return {
    title: `${post.title} | Pixelify`,
    description: post.description,
    alternates: {
      canonical: `/${lang}/blogs/${slug}/`,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      locale: lang,
      images: [{ url: post.cover, alt: post.coverAlt }],
    },
  };
}

export default function LocalizedBlogPostPage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const { lang, slug } = params;
  const post = getPostBySlug(slug, lang);

  if (!post) {
    return <NotFound />;
  }

  return <BlogPostView slug={slug} lang={lang} />;
}

