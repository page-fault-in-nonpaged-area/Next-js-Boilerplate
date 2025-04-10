// SystemBannerProvider.tsx
import type { ReactNode } from 'react';
import type { SystemBannerContextType } from '../contexts/systemBannerContext';
import React, { useCallback, useState } from 'react';
import { SystemBannerContext } from '../contexts/systemBannerContext';

export const SystemBannerProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [type, setType] = useState<SystemBannerContextType['type']>('primary');

  const setSystemBanner = useCallback((
    msg: string | null,
    bannerType: SystemBannerContextType['type'] = 'primary',
  ) => {
    setMessage(msg);
    setType(bannerType);
  }, []);

  const contextValue = React.useMemo(
    () => ({ message, type, setSystemBanner }),
    [message, type, setSystemBanner],
  );

  return (
    <SystemBannerContext value={contextValue}>
      {children}
    </SystemBannerContext>
  );
};
