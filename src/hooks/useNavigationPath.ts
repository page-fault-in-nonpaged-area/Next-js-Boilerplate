import type { NavigationPathContextType } from '../contexts/navigationPathContext';
import { use } from 'react';
import { NavigationPathContext } from '../contexts/navigationPathContext';

export const useNavigationPath = (): NavigationPathContextType => {
  const context = use(NavigationPathContext);
  if (!context) {
    throw new Error('useNavigationPath must be used within a NavigationPathProvider');
  }
  return context;
};
