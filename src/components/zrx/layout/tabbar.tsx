'use client';

import type { FC } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

// Define TabItem type specifically for the tabbar component
export type TabItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
};

// TabbarButton props
type TabbarButtonProps = {
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  active: boolean;
  path: string;
};

// Tabbar props
type ZrxTabbarProps = {
  /**
   * Active route path to highlight
   */
  activePath?: string;

  /**
   * Optional callback when a navigation item is clicked
   */
  onNavigate?: (path: string) => void;

  /**
   * Navigation items to display in the tabbar
   * @default []
   */
  navigationItems?: TabItem[];
};

/**
 * TabbarButton component displays navigation items with icon and label
 */
const TabbarButton: FC<TabbarButtonProps> = ({
  label,
  icon: Icon,
  activeIcon: ActiveIcon,
  active,
  path,
}) => {
  // Memoize component selection to prevent unnecessary re-renders
  const DisplayIcon = useMemo(() => active ? ActiveIcon : Icon, [active, ActiveIcon, Icon]);

  // Use inline styles with useMemo to optimize for performance
  const containerStyle = useMemo(() => ({
    transform: 'translateZ(0)', // Force GPU acceleration
  }), []);

  const iconStyle = useMemo(() => ({
    width: '24px',
    height: '24px',
    transform: `translateZ(0) ${active ? 'scale(1.05)' : 'scale(1)'}`,
    transition: 'transform 0.2s ease, color 0.2s ease',
  }), [active]);

  const containerClass = useMemo(() =>
    clsx(
      'interface-tabbar-btn',
      active ? 'interface-tabbar-btn-active' : 'interface-tabbar-btn-inactive',
    ), [active]);

  const iconClass = useMemo(() =>
    clsx(
      'interface-tabbar-icon',
      active ? 'interface-tabbar-icon-active' : 'interface-tabbar-icon-inactive',
    ), [active]);

  const labelClass = useMemo(() =>
    clsx(
      'interface-tabbar-label',
      active ? 'interface-tabbar-label-active' : 'interface-tabbar-label-inactive',
    ), [active]);

  return (
    <Link href={path} className={containerClass} style={containerStyle}>
      <DisplayIcon className={iconClass} style={iconStyle} />
      <div className={labelClass}>
        {label}
      </div>
    </Link>
  );
};

// Memoize the TabbarButton to prevent unnecessary re-renders
const MemoizedTabbarButton = React.memo(TabbarButton);

/**
 * More button component shown when there are more than 5 navigation items
 */
const MoreButton: FC<{ items: TabItem[] }> = ({ items }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Check if any item in the more menu matches the current path
  const isMoreActive = useMemo(() => {
    return items.some(item => item.path === pathname);
  }, [items, pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Control menu visibility with animation
  useEffect(() => {
    if (isMenuOpen) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    } else {
      // Wait for animation to complete before unmounting
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current
        && buttonRef.current
        && !menuRef.current.contains(event.target as Node)
        && !buttonRef.current.contains(event.target as Node)
        && isMenuOpen
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div
      ref={buttonRef}
      className={clsx(
        'interface-tabbar-more-btn',
        isMoreActive ? 'interface-tabbar-btn-active' : 'interface-tabbar-btn-inactive',
      )}
      onClick={toggleMenu}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          toggleMenu();
        }
      }}
    >
      <div className={clsx(
        'interface-tabbar-more-dots',
        isMoreActive ? 'interface-tabbar-icon-active' : 'interface-tabbar-icon-inactive',
      )}
      >
        •••
      </div>
      <div className={clsx(
        'interface-tabbar-label',
        isMoreActive ? 'interface-tabbar-label-active' : 'interface-tabbar-label-inactive',
      )}
      >
        More
      </div>

      {/* More Menu Portal - ensures proper stacking context */}
      {isVisible && (
        <div
          ref={menuRef}
          className={`interface-tabbar-more-menu ${
            isMenuOpen ? 'animate-menu-in' : 'animate-menu-out'
          }`}
          data-testid="more-dropdown"
        >
          <ul className="p-2">
            {items.map((item) => {
              const isActive = pathname === item.path;
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <li key={item.path} className="interface-tabbar-menu-item">
                  <Link
                    href={item.path}
                    className={clsx(
                      'flex items-center py-2 px-3',
                      isActive ? 'interface-tabbar-menu-item-active' : '',
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon
                      className={clsx(
                        isActive ? 'interface-tabbar-icon-active' : 'interface-tabbar-icon-inactive',
                      )}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span className={clsx(
                      'ml-2',
                      isActive ? 'interface-tabbar-label-active' : 'interface-tabbar-label-inactive',
                    )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

const defaultNavigationItems: TabItem[] = [];

const ZrxTabbar: FC<ZrxTabbarProps> = ({
  activePath,
  navigationItems = defaultNavigationItems,
}) => {
  const pathname = usePathname();

  // Determine active path - use prop or current path
  const currentPath = useMemo(() => activePath || pathname, [activePath, pathname]);

  // Logic for displaying navigation items - only show first 4 + more if > 5 items
  const displayItems = useMemo(() => {
    if (navigationItems.length <= 5) {
      return navigationItems;
    }
    // Return first 4 items if more than 5
    return navigationItems.slice(0, 4);
  }, [navigationItems]);

  // Determine if we need to show the More button
  const showMoreButton = useMemo(() =>
    navigationItems.length > 5, [navigationItems]);

  // Items that would be shown in the More menu
  const moreItems = useMemo(() =>
    navigationItems.length > 5 ? navigationItems.slice(4) : [], [navigationItems]);

  // Memoize styles to prevent recreation on each render
  const navStyle = useMemo(() => ({
    transform: 'translateZ(0)', // Force GPU acceleration
  }), []);

  return (
    <nav className="interface-tabbar" style={navStyle}>
      {displayItems.map(item => (
        <MemoizedTabbarButton
          key={item.path}
          label={item.label}
          icon={item.icon}
          activeIcon={item.activeIcon}
          active={currentPath === item.path}
          path={item.path}
        />
      ))}

      {showMoreButton && (
        <MoreButton items={moreItems} />
      )}
    </nav>
  );
};

// Memoize the entire tabbar component to prevent unnecessary re-renders
export default React.memo(ZrxTabbar);
