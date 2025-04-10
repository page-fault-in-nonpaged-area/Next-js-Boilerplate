import type { ReactNode } from 'react';
import type { NavigationPathItem } from '../contexts/navigationPathContext';
import React, { useCallback, useMemo, useState } from 'react';
import { NavigationPathContext } from '../contexts/navigationPathContext';

export const NavigationPathProvider = ({ children }: { children: ReactNode }) => {
  const [navigationPath, setNavigationPathState] = useState<NavigationPathItem[]>([]);

  const setNavigationPath = useCallback((path: NavigationPathItem[]) => {
    setNavigationPathState(path);
  }, []);

  const contextValue = useMemo(
    () => ({ navigationPath, setNavigationPath }),
    [navigationPath, setNavigationPath],
  );

  return (
    <NavigationPathContext value={contextValue}>
      {children}
    </NavigationPathContext>
  );
};
