'use client';

import type { FC, ReactNode } from 'react';
import type { NavItem } from './sidebar';
import type { UserInfo, UserMenuItem } from './usermenu';
import { useSystemBanner } from '@/hooks/useSystemBanner';
import { NavigationPathProvider } from '@/providers/NavigationPathProvider';
import { SystemBannerProvider } from '@/providers/SystemBannerProvider';
import {
  RiBookmarkLine,

  RiDashboardLine,
  RiFlagLine,
  RiHeartLine,
  RiLoginBoxLine,
  RiLogoutBoxRLine,
  RiMapPinLine,
  RiNotification2Line,

  RiStackLine,

  RiStarLine,
} from '@remixicon/react';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ZrxNavbar from './navbar';
import ZrxSidebar from './sidebar';
import ZrxTabbar from './tabbar';

// Paths that should not show the sidebar and navbar
const EXCLUDED_PATHS = ['/auth/signin', '/auth/signup', '/auth/reset-password'];

// Define default navigation items - static definition outside component
const defaultNavigationItems: NavItem[] = [
  {
    path: '/components',
    label: 'Incidents',
    icon: RiNotification2Line,
    activeIcon: RiNotification2Line,
    section: 'main',
  },
];

// Map string identifiers to actual component references on the client side
const iconMap: Record<string, React.ElementType> = {
  // Navigation & UI
  dashboard: RiDashboardLine,
  bookmark: RiBookmarkLine,
  heart: RiHeartLine,
  star: RiStarLine,
  flag: RiFlagLine,
  location: RiMapPinLine,
  stack: RiStackLine,
  logout: RiLogoutBoxRLine,
  login: RiLoginBoxLine,
};

type ZrxLayoutProps = {
  children: ReactNode;
  session?: any;
  defaultUserInfo?: UserInfo;
  navigationItems?: NavItem[];

  /**
   * User menu items
   */
  userMenuItems?: UserMenuItem[];

  /**
   * Number of unread notifications
   * Only used if userMenuItems is not provided
   * @default 0
   */
};

const ZrxLayout: FC<ZrxLayoutProps> = ({
  children,
  defaultUserInfo,
  navigationItems = defaultNavigationItems,
  userMenuItems,
}) => {
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isUltraCompact, setIsUltraCompact] = useState(false);
  const [scrolledPastTop, _setScrolledPastTop] = useState(false);
  const [isSafariMobile, setIsSafariMobile] = useState(false);
  const [userInfo, _setUserInfo] = useState<UserInfo | undefined>(defaultUserInfo);

  const { message: bannerMessage, type: bannerType } = useSystemBanner();
  const bannerHeight = bannerMessage ? 47.68 : 0;

  const updateMobileState = useCallback((isCurrentlyMobile: boolean) => {
    if (isMobile !== isCurrentlyMobile) {
      setIsMobile(isCurrentlyMobile);
    }
  }, [isMobile]);

  const updateUltraCompactState = useCallback((isCurrentlyUltraCompact: boolean) => {
    if (isUltraCompact !== isCurrentlyUltraCompact) {
      setIsUltraCompact(isCurrentlyUltraCompact);
    }
  }, [isUltraCompact]);

  const updateSafariMobileState = useCallback((isSafari: boolean) => {
    if (isSafariMobile !== isSafari) {
      setIsSafariMobile(isSafari);
    }
  }, [isSafariMobile]);

  // Handle component mounting - important for theme hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks-extra/no-direct-set-state-in-use-effect
    setMounted(true);
  }, []);

  // Handle window resize events for responsive layout adjustments
  useEffect(() => {
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth < 1024;
      const isCurrentlyUltraCompact = window.innerWidth < 500;

      updateMobileState(isCurrentlyMobile);
      updateUltraCompactState(isCurrentlyUltraCompact);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateMobileState, updateUltraCompactState]);

  // Handle Safari mobile specific issues
  useEffect(() => {
    const ua = window.navigator.userAgent;
    const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const webkit = !!ua.match(/WebKit/i);
    const iOSSafari = iOS && webkit && !ua.match(/CriOS/i) && !ua.match(/FxiOS/i);

    requestAnimationFrame(() => {
      updateSafariMobileState(iOSSafari);
    });

    if (iOSSafari) {
      const handleSafariResize = () => {
        const windowHeight = window.innerHeight;
        document.documentElement.style.setProperty('--safari-height', `${windowHeight}px`);
      };

      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.overflowY = 'hidden';

      handleSafariResize();

      window.addEventListener('resize', handleSafariResize);
      window.addEventListener('orientationchange', handleSafariResize);

      return () => {
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.height = '';
        document.body.style.overflowY = '';

        window.removeEventListener('resize', handleSafariResize);
        window.removeEventListener('orientationchange', handleSafariResize);
      };
    }

    return () => {};
  }, [mounted, updateSafariMobileState]);

  const handleSignOut = useCallback(() => {
    console.warn('Signing out');
  }, []);

  const handleThemeChange = useCallback((theme: string) => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (themeColorMeta) {
      themeColorMeta.content = theme === 'dark' ? '#222222' : '#ffffff';
    }
  }, []);

  // Calculate sidebar width based on collapsed state - memoized to avoid recalculation
  const sidebarWidth = useMemo(() => isSidebarCollapsed ? 64 : 256, [isSidebarCollapsed]);

  // Convert NavItems to TabItems for mobile navigation
  const tabbarItems = useMemo(() =>
    navigationItems.map(item => ({
      path: item.path,
      label: item.label,
      icon: item.icon,
      activeIcon: item.activeIcon,
    })), [navigationItems]);

  // Early return for loading state
  if (!mounted) {
    return null;
  }

  // Special handling for authentication pages
  if (EXCLUDED_PATHS.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className={`flex h-screen overflow-hidden transition-all duration-300 ease-in-out ${isSafariMobile ? 'safari-mobile-container' : ''}`}>
      <div
        className="fixed left-0 top-0 z-10 h-screen transition-all duration-300 ease-in-out"
        style={{ width: isMobile ? 0 : sidebarWidth }}
      >
        {!isMobile && (
          <ZrxSidebar
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
            activePath={pathname}
            navigationItems={navigationItems}
          />
        )}
      </div>

      <div
        className={`flex flex-col flex-1 ${isSafariMobile ? 'safari-mobile-content' : 'h-screen'}`}
        style={{
          marginLeft: isMobile ? 0 : sidebarWidth,
          transition: 'margin-left 300ms ease-in-out',
          height: isSafariMobile ? 'var(--safari-height, 100vh)' : '100vh',
          paddingBottom: isMobile ? '56px' : '0',
        }}
      >
        <div style={{ minHeight: `54px` }}>
          <div
            className="fixed top-0 right-0"
            style={{
              left: isMobile ? 0 : sidebarWidth,
              transition: 'left 300ms ease-in-out',
              width: `calc(100% - ${isMobile ? 0 : sidebarWidth}px)`,
            }}
          >
            <ZrxNavbar
              sidebarCollapsed={isSidebarCollapsed}
              isMobile={isMobile}
              isUltraCompact={isUltraCompact}
              hideBorder={!scrolledPastTop}
              userInfo={userInfo}
              userMenuItems={userMenuItems}
              onSignOut={handleSignOut}
              onThemeChange={handleThemeChange}
            />
          </div>

          {bannerMessage && (
            <div
              className={`zrx-banner zrx-banner--${bannerType}`}
              style={{
                width: '100%',
                marginTop: '54px',
                padding: '12px 24px',
                minHeight: '40px',
              }}
            >
              {bannerMessage}
            </div>
          )}
        </div>

        <div
          className={`flex-1 ${isSafariMobile ? 'safari-mobile-scroll' : ''}`}
          style={{
            height: isSafariMobile
              ? `calc(var(--safari-height, 100vh) - ${54 + bannerHeight}px${isMobile ? ' - 56px' : ''})`
              : `calc(100vh - ${54 + bannerHeight}px${isMobile ? ' - 56px' : ''})`,
            overflow: 'auto',
            transition: 'height 0.2s ease-out',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <div
            className="h-full"
            style={{
              width: isMobile
                ? '100vw'
                : `calc(100vw - ${sidebarWidth}px - 12px)`,
              maxWidth: isMobile
                ? '100vw'
                : `calc(100vw - ${sidebarWidth}px - 12px)`,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease-in-out, max-width 0.3s ease-in-out',
            }}
          >
            <div className="">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </div>

        {isMobile && (
          <div
            className="fixed bottom-0 left-0 right-0 z-50"
            style={{
              height: 'auto',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
              transform: 'translateZ(0)',
              zIndex: 1000,
            }}
          >
            <ZrxTabbar
              activePath={pathname}
              navigationItems={tabbarItems}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Now update the providers HOC to pass navigation items
export type NavigationConfig = {
  path: string;
  label: string;
  iconName: string;
  section: 'main' | 'settings';
};

type ZrxLayoutWithProvidersProps = {
  children: ReactNode;
  navigationConfig: NavigationConfig[];

  /**
   * Custom menu items for the user menu
   * If not provided, default items will be used
   */
  userMenuItems?: UserMenuItem[];
};

const ZrxLayoutWithProviders: React.FC<ZrxLayoutWithProvidersProps> = ({
  children,
  navigationConfig,
  userMenuItems,
}) => {
  // Transform the config into full NavItem objects with component references
  const navigationItems = useMemo(() =>
    navigationConfig.map(item => ({
      path: item.path,
      label: item.label,
      icon: iconMap[item.iconName] || RiNotification2Line, // Fallback icon
      activeIcon: iconMap[item.iconName] || RiNotification2Line,
      section: item.section,
    })), [navigationConfig]);

  // Use the existing layout component with the transformed navigation items
  return (
    <NavigationPathProvider>
      <SystemBannerProvider>
        <ZrxLayout
          navigationItems={navigationItems}
          userMenuItems={userMenuItems}
        >
          {children}
        </ZrxLayout>
      </SystemBannerProvider>
    </NavigationPathProvider>
  );
};

export type { NavItem };
export default ZrxLayoutWithProviders;
