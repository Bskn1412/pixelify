'use client';

import HomePage from '../HomePage';
import { useApp } from '../AppProvider';

export default function HomeView() {
  const { navigateTo } = useApp();

  return (
    <HomePage
      onLaunchUpscaler={() => navigateTo('upscaler')}
      onLaunchBGRemove={() => navigateTo('bg_remove')}
      onTabChange={navigateTo}
    />
  );
}
