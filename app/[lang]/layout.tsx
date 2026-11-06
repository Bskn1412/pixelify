import { SITE_LANGUAGES } from '@/lib/i18n';

export function generateStaticParams() {
  return SITE_LANGUAGES.map((lang) => ({ lang: lang.code }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

