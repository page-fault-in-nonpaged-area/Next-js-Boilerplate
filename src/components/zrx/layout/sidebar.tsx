'use client';

import type { FC } from 'react';
import {
  RiSidebarFoldLine,
  RiSidebarUnfoldLine,
} from '@remixicon/react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';

// Updated NavItem type - moving it outside the component for better reusability
export type NavItem = {
  path: string;
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  section: 'main' | 'settings';
};

// Sidebar button props
type SidebarButtonProps = {
  label: string;
  icon: React.ElementType;
  activeIcon: React.ElementType;
  collapsed: boolean;
  active: boolean;
  first?: boolean;
  path: string;
};

// Updated sidebar props
type ZrxSidebarProps = {
  /**
   * Whether the sidebar is collapsed
   * @default false
   */
  isCollapsed?: boolean;

  /**
   * Function to set collapse state
   */
  setIsCollapsed?: (collapsed: boolean) => void;

  /**
   * Active route path to highlight
   */
  activePath?: string;

  /**
   * Optional callback when a navigation item is clicked
   */
  onNavigate?: (path: string) => void;

  /**
   * Navigation items to display in the sidebar
   * @default []
   */
  navigationItems?: NavItem[];
};

/**
 * SidebarButton component displays navigation items with appropriate styling
 * based on active state and collapse state
 */
const SidebarButton: FC<SidebarButtonProps> = ({
  label,
  icon: Icon,
  activeIcon: ActiveIcon,
  collapsed,
  active,
  first = false,
  path,
}) => {
  // Memoize component selection to prevent unnecessary re-renders
  const DisplayIcon = useMemo(() => active ? ActiveIcon : Icon, [active, ActiveIcon, Icon]);

  const containerClass = useMemo(() =>
    clsx(
      active
        ? collapsed
          ? 'interface-sidebar-active-btn-collapsed'
          : 'interface-sidebar-active-btn'
        : collapsed
          ? 'interface-sidebar-inactive-btn-collapsed group'
          : 'interface-sidebar-inactive-btn group',
    ), [active, collapsed]);

  const iconClass = useMemo(() =>
    clsx(
      active
        ? collapsed
          ? 'interface-sidebar-active-btn-icon-collapsed'
          : 'interface-sidebar-active-btn-icon'
        : collapsed
          ? 'interface-sidebar-inactive-btn-icon-collapsed'
          : 'interface-sidebar-inactive-btn-icon',
    ), [active, collapsed]);

  // Memoize styles to prevent recreation on each render
  const iconStyle = useMemo(() => ({
    width: '20px',
    height: '20px',
    marginLeft: collapsed ? '3.5px' : '0px',
    transition: 'transform 0.15s, margin-left 0.15s',
    willChange: 'transform',
  }), [collapsed]);

  const labelClass = useMemo(() =>
    clsx(
      'pl-2',
      'transition-opacity duration-300 ease-in-out',
      collapsed ? 'opacity-0' : 'opacity-100',
    ), [collapsed]);

  const containerStyle = useMemo(() => ({
    marginTop: first ? '1px' : undefined,
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [first]);

  const iconContainerStyle = useMemo(() => ({
    marginTop: `${collapsed ? '6.5px' : '7px'}`,
    marginLeft: `${(collapsed && active) ? '1px' : '0px'}`,
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [collapsed, active]);

  const labelStyle = useMemo(() => ({
    whiteSpace: 'nowrap' as const,
    fontWeight: 'normal' as const,
    fontSize: '15px',
    marginTop: '-2px',
    paddingTop: '1px',
    maxHeight: '38px',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), []);

  return (
    <Link href={path}>
      <div className={`${containerClass} group`} style={containerStyle}>
        <div style={iconContainerStyle}>
          <DisplayIcon className={iconClass} style={iconStyle} />
        </div>
        <div className={labelClass} style={labelStyle}>
          {label}
        </div>
      </div>
    </Link>
  );
};

// Memoize the SidebarButton to prevent unnecessary re-renders
const MemoizedSidebarButton = React.memo(SidebarButton);

const defaultNavigationItems: NavItem[] = [];

const ZrxSidebar: FC<ZrxSidebarProps> = ({
  isCollapsed = false,
  setIsCollapsed,
  activePath,
  navigationItems = defaultNavigationItems,
}) => {
  const pathname = usePathname();

  // Determine active path - use prop or current path
  const currentPath = useMemo(() => activePath || pathname, [activePath, pathname]);

  // Filter items by section - memoized to avoid recalculation on every render
  const mainNavItems = useMemo(() =>
    navigationItems.filter(item => item.section === 'main'), [navigationItems]);

  const settingsNavItems = useMemo(() =>
    navigationItems.filter(item => item.section === 'settings'), [navigationItems]);

  // Toggle sidebar collapsed state
  const toggleCollapse = useCallback(() => {
    if (setIsCollapsed) {
      setIsCollapsed(!isCollapsed);
    }
  }, [isCollapsed, setIsCollapsed]);

  // Memoize styles to avoid recreating objects on each render
  const asideStyle = useMemo(() => ({
    height: '100vh',
    paddingLeft: isCollapsed ? '0px' : '1rem',
    paddingRight: isCollapsed ? '0px' : '1rem',
    width: isCollapsed ? '4rem' : '16rem',
    willChange: 'width, padding',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [isCollapsed]);

  const logoContainerStyle = useMemo(() => ({
    marginBottom: isCollapsed ? '-2px' : '0px',
  }), [isCollapsed]);

  const logoDivStyle = useMemo(() => ({
    height: '54px',
    lineHeight: '53px',
    paddingTop: '1px',
    marginLeft: isCollapsed ? '0px' : '4px',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [isCollapsed]);

  const logoTextStyle = useMemo(() => ({
    fontSize: '21px',
  }), []);

  const logoSpacerStyle = useMemo(() => ({
    width: '100px',
    height: '54px',
  }), []);

  const collapseButtonContainerStyle = useMemo(() => ({
    marginTop: isCollapsed ? '0' : '1px',
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    transition: 'padding-right 0.3s ease-out',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), [isCollapsed]);

  const collapseButtonStyle = useMemo(() => ({
    cursor: 'pointer',
    height: '100%',
    marginLeft: '-2.2px',
  }), []);

  const collapseIconStyle = useMemo(() => ({
    width: '22px',
    height: '22px',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), []);

  const mainSectionHeaderClass = useMemo(() =>
    clsx(
      'pl-1 sidebar-header-title transition-all duration-300 overflow-hidden',
      isCollapsed
        ? 'mb-0 max-h-0 scale-y-0 opacity-0'
        : 'max-h-10 scale-y-100 mt-6 mb-3 opacity-100',
    ), [isCollapsed]);

  const sectionHeaderStyle = useMemo(() => ({
    fontSize: '13px',
    transform: 'translateZ(0)', // Force GPU acceleration
  }), []);

  const settingsSectionHeaderClass = useMemo(() =>
    clsx(
      'pl-1 sidebar-header-title transition-all duration-300 overflow-hidden',
      isCollapsed
        ? 'max-h-0 scale-y-0 opacity-0 pt-0'
        : 'max-h-10 scale-y-100 opacity-100 mt-6 mb-3 pt-1',
    ), [isCollapsed]);

  return (
    <aside className="interface-sidebar-base" style={asideStyle}>
      {/* Logo and collapse button */}
      <div className="flex" style={logoContainerStyle}>
        {/* Logo */}
        <div
          className={clsx(
            'transition-all duration-300 overflow-hidden',
            isCollapsed ? 'max-w-0 opacity-0' : 'max-w-60 opacity-100',
          )}
          style={logoDivStyle}
        >
          <div className="comfortaa-bold flex" style={logoTextStyle}>
            <div className="logo-3">usd</div>
            <div className="logo-1">.dev</div>
            {/* blank spacer for ui alignment */}
            <div style={logoSpacerStyle} />
          </div>
        </div>

        {/* Collapse/Expand Button */}
        <div
          className="sidebar-header flex justify-between items-center"
          style={collapseButtonContainerStyle}
        >
          <div
            className="collapse-button flex items-center justify-center"
            style={collapseButtonStyle}
            onClick={toggleCollapse}
            onKeyDown={e => e.key === 'Enter' && toggleCollapse()}
            role="button"
            tabIndex={0}
          >
            {isCollapsed
              ? (
                  <RiSidebarUnfoldLine
                    className="interface-sidebar-collapse-icon"
                    style={collapseIconStyle}
                  />
                )
              : (
                  <RiSidebarFoldLine
                    className="interface-sidebar-collapse-icon"
                    style={collapseIconStyle}
                  />
                )}
          </div>
        </div>
      </div>

      {/* MAIN Section Header */}
      <div className={mainSectionHeaderClass} style={sectionHeaderStyle}>
        MAIN
      </div>

      {/* Main Navigation Items */}
      {mainNavItems.map((item, index) => (
        <MemoizedSidebarButton
          key={item.path}
          label={item.label}
          icon={item.icon}
          activeIcon={item.activeIcon}
          collapsed={isCollapsed}
          active={currentPath === item.path}
          path={item.path}
          first={index === 0}
        />
      ))}

      {/* SETTINGS Section Header */}
      <div className={settingsSectionHeaderClass} style={sectionHeaderStyle}>
        SETTINGS
      </div>

      {/* Settings Navigation Items */}
      {settingsNavItems.map(item => (
        <MemoizedSidebarButton
          key={item.path}
          label={item.label}
          icon={item.icon}
          activeIcon={item.activeIcon}
          collapsed={isCollapsed}
          active={currentPath === item.path}
          path={item.path}
        />
      ))}
    </aside>
  );
};

// Memoize the entire sidebar component to prevent unnecessary re-renders
export default React.memo(ZrxSidebar);
