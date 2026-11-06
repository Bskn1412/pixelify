import type { Metadata } from 'next';
import TruckBgView from '@/components/TruckBgView';
import { SITE_LANGUAGES } from '@/lib/i18n';

export function generateStaticParams() {
  return SITE_LANGUAGES.map((lang) => ({ lang: lang.code }));
}

export const metadata: Metadata = {
  title: 'Pixelify Truck Playground',
  description: 'An experimental canvas playground built by the Pixelify team.',
  robots: { index: false, follow: false },
};

export default function LocalizedTruckPage() {
  return <TruckBgView />;
}

