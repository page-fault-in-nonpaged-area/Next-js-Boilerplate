'use client';

import type { FC } from 'react';
import type { UserInfo, UserMenuItem } from './usermenu';
import { useNavigationPath } from '@/hooks/useNavigationPath';
import { RiLogoutBoxLine, RiMoonLine, RiNotificationLine, RiSunLine } from '@remixicon/react';
import { useTheme } from 'next-themes';
import React, { useMemo, useState } from 'react';
import Breadcrumb from './breadcrumb';
import UserMenu from './usermenu';

type ZrxNavbarProps = {
  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  sidebarCollapsed?: boolean;

  /**
   * Whether the device is mobile
   * @default false
   */
  isMobile?: boolean;

  /**
   * Whether the device is ultra compact (very small screens)
   * @default false
   */
  isUltraCompact?: boolean;

  /**
   * Whether to hide the navbar border
   * @default false
   */
  hideBorder?: boolean;

  /**
   * User information for profile display
   */
  userInfo?: UserInfo;

  /**
   * Custom menu items for the user menu
   * If not provided, default items will be used with notificationCount applied
   */
  userMenuItems?: UserMenuItem[];

  /**
  /**
   * Callback when user signs out
   */
  onSignOut: () => void;

  /**
   * Callback when theme changes
   * @optional
   */
  onThemeChange?: (theme: string) => void;
};

/**
 * ZrxNavbar component - The main top navigation bar
 * Includes breadcrumb navigation, theme toggle and user profile
 */
const ZrxNavbar: FC<ZrxNavbarProps> = ({
  sidebarCollapsed = false,
  isMobile = false,
  isUltraCompact = false,
  hideBorder = false,
  userInfo,
  userMenuItems,
  onSignOut,
  onThemeChange,
}) => {
  const [isProfileTooltipOpen, setIsProfileTooltipOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Get navigation path from hook
  const { navigationPath }: { navigationPath: { icon?: React.ReactNode; label: string; onClick?: () => void }[] } = useNavigationPath();

  // Toggle profile dropdown
  const toggleProfileTooltip = () => {
    setIsProfileTooltipOpen(prev => !prev);
  };

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    // Update theme-color meta tag for mobile browsers
    let themeColorMeta = document.querySelector('meta[name="theme-color"]') as HTMLMetaElement;
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta');
      themeColorMeta.name = 'theme-color';
      document.head.appendChild(themeColorMeta);
    }
    themeColorMeta.content = newTheme === 'dark' ? '#222222' : '#ffffff';

    // Set the theme
    setTheme(newTheme);

    // Notify parent component if callback provided
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  // Generate default menu items only if custom items aren't provided
  const defaultUserMenuItems = useMemo(() => [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: RiNotificationLine,
      path: '/notifications',
      count: 900, // Placeholder for notification count
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: RiLogoutBoxLine,
      action: () => onSignOut(),
    },
  ], [onSignOut]);

  // Use provided menu items or fall back to defaults
  const menuItems = useMemo(() =>
    userMenuItems || defaultUserMenuItems, [userMenuItems, defaultUserMenuItems]);

  // Calculate navbar dimensions based on sidebar state
  const navbarClass = hideBorder ? 'interface-navbar-base-nb' : 'interface-navbar-base';
  const navbarWidth = isMobile ? '100%' : sidebarCollapsed ? 'calc(100% - 64px)' : 'calc(100% - 256px)';
  const navbarLeft = isMobile ? '0' : sidebarCollapsed ? '64px' : '256px';

  return (
    <>
      <header
        className={navbarClass}
        style={{
          width: navbarWidth,
          left: navbarLeft,
          height: '54px',
        }}
        data-testid="zrx-navbar"
      >
        {/* Breadcrumb navigation */}
        <div className="flex-grow">
          <Breadcrumb
            locations={navigationPath.map((item: { icon?: React.ReactNode; label: string; onClick?: () => void }) => ({
              ...item,
              icon: item.icon && React.isValidElement(item.icon) ? item.icon : <></>,
              path: item.label.toLowerCase().replace(/\s+/g, '-'), // Generate a default path based on the label
              onClick: item.onClick || (() => {}), // Use item's onClick or provide a default no-op function
            }))}
            compactDisplay={isMobile || isUltraCompact}
            ultraCompactDisplay={isUltraCompact}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            className="interface-navbar-btn px-4 py-3"
            aria-label="Toggle theme"
            data-testid="theme-toggle"
            type="button"
          >
            {theme === 'dark'
              ? (
                  <RiSunLine style={{ width: '20px', height: '20px' }} />
                )
              : (
                  <RiMoonLine style={{ width: '20px', height: '20px' }} />
                )}
          </button>

          {/* User profile menu */}
          <UserMenu
            userInfo={userInfo}
            menuItems={menuItems}
            isUltraCompact={isUltraCompact}
            isMobile={isMobile}
            isProfileTooltipOpen={isProfileTooltipOpen}
            toggleProfileTooltip={toggleProfileTooltip}
            onSignOut={onSignOut}
          />
        </div>
      </header>
    </>
  );
};

export default ZrxNavbar;
