// systemBannerContext.ts
import { createContext } from 'react';

export type SystemBannerContextType = {
  message: string | null;
  type: 'primary' | 'secondary' | 'warning' | 'danger' | 'success';
  setSystemBanner: (msg: string | null, type?: 'primary' | 'secondary' | 'warning' | 'danger' | 'success') => void;
};

export const SystemBannerContext = createContext<SystemBannerContextType>({
  message: null,
  type: 'primary',
  setSystemBanner: () => {},
});
