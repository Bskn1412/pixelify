import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Activity | Pixelify',
  description: 'Review your personal Pixelify image processing activity, points, and achievements.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/leaderboard/activity/' },
};

export default function ActivityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
