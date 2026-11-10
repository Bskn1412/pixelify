import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pixelify Leaderboard | Community Image Creators',
  description: 'See how Pixelify community members rank through successful background removal and AI upscaling.',
  alternates: { canonical: '/leaderboard/' },
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
