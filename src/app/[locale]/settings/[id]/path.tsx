'use client';

import { useNavigationPath } from '@/hooks/useNavigationPath';
import { RiLoaderLine, RiSettings3Line } from '@remixicon/react';
import { useEffect } from 'react';

/**
 * Component that updates the navigation path immediately upon mounting,
 * before any data fetching or suspense boundaries resolve.
 */
export function NavigationPathUpdater(): null {
  const { setNavigationPath } = useNavigationPath();

  // Run this effect with highest priority
  useEffect(() => {
    // Update navigation path immediately
    setNavigationPath([
      {
        label: 'Settings',
        path: '/settings',
        icon: <RiSettings3Line className="w-5 h-5" />,
      },
      {
        label: '...',
        path: '/settings/system',
        icon: <RiLoaderLine className="w-5 h-5" />,
      },
    ]);
  }, [setNavigationPath]);

  // This component doesn't render anything
  return null;
}
