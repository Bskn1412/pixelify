'use client';

import BlogList from './blog/BlogList';
import { useApp } from './AppProvider';

export default function BlogListView({ initialLang }: { initialLang?: string }) {
  const { navigateTo } = useApp();
  return <BlogList onTabChange={navigateTo} initialLang={initialLang} />;
}
