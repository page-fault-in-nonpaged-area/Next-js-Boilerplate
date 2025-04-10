import type { SystemBannerContextType } from '../contexts/systemBannerContext';
import { use } from 'react';
import { SystemBannerContext } from '../contexts/systemBannerContext';

export const useSystemBanner = (): SystemBannerContextType => {
  const context = use(SystemBannerContext);
  if (!context) {
    throw new Error('useSystemBanner must be used within a SystemBannerProvider');
  }
  return context;
};
