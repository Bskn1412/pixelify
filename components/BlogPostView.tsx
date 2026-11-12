'use client';

import BlogPost from './blog/BlogPost';
import { useApp } from './AppProvider';

interface BlogPostViewProps {
  slug: string;
  lang?: string;
}

export default function BlogPostView({ slug, lang }: BlogPostViewProps) {
  const { navigateTo } = useApp();
  return <BlogPost slug={slug} lang={lang} onTabChange={navigateTo} />;
}
