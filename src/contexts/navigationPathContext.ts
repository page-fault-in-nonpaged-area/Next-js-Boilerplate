import type { ReactNode } from 'react';
import { createContext } from 'react';

export type NavigationPathItem = {
  label: string;
  path: string;
  icon?: ReactNode;
};

export type NavigationPathContextType = {
  navigationPath: NavigationPathItem[];
  setNavigationPath: (path: NavigationPathItem[]) => void;
};

export const NavigationPathContext = createContext<NavigationPathContextType>({
  navigationPath: [],
  setNavigationPath: () => {},
});
