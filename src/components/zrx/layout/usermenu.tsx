'use client';

// Replace with Remix Icons
import { RiLogoutBoxLine, RiNotificationLine, RiSettings4Line, RiUserLine } from '@remixicon/react';
import { clsx } from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { createPortal } from 'react-dom';

// Icon map for user menu items
const userMenuIconMap: Record<string, React.ElementType> = {
  notification: RiNotificationLine,
  settings: RiSettings4Line,
  logout: RiLogoutBoxLine,
  user: RiUserLine,
  // Add more icons as needed
};

// Define menu option type for export
export type UserMenuItem = {
  id: string;
  label: string;
  icon: React.ElementType | string; // Support both direct component and string identifier
  path?: string; // If null, this is an action item not a navigation item
  action?: () => void;
  count?: number; // Optional count to display as a badge
};

// Export user info type for external components like navbar
export type UserInfo = {
  name?: string;
  imageUrl?: string;
};

type UserMenuProps = {
  /**
   * User information
   */
  userInfo?: UserInfo;

  /**
   * Menu items to display
   * @default Default menu items (notifications, settings, logout)
   */
  menuItems?: UserMenuItem[];

  /**
   * Whether the device is mobile
   * @default false
   */
  isMobile?: boolean;

  /**
   * Whether the device is ultra compact
   * @default false
   */
  isUltraCompact?: boolean;

  /**
   * Whether profile tooltip is open (controlled externally)
   * @default false
   */
  isProfileTooltipOpen?: boolean;

  /**
   * Toggle profile tooltip function
   */
  toggleProfileTooltip?: () => void;

  /**
   * Logout handler function
   */
  onSignOut?: () => void;
};

const UserMenu: React.FC<UserMenuProps> = ({
  userInfo,
  menuItems,
  isProfileTooltipOpen = false,
  toggleProfileTooltip,
  onSignOut,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(isProfileTooltipOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const userName = userInfo?.name || 'User';
  const userImage = userInfo?.imageUrl;

  // Sync external tooltip state if controlled externally
  useEffect(() => {
    if (isProfileTooltipOpen !== isMenuOpen && toggleProfileTooltip) {
      // on next render, set the menu open state to match the external state
      requestAnimationFrame(() => {
        setIsMenuOpen(isProfileTooltipOpen);
      });
    }
  }, [isProfileTooltipOpen, isMenuOpen, toggleProfileTooltip]);

  // Default menu options with Remix Icons - without hardcoded notification count
  const defaultMenuOptions: UserMenuItem[] = useMemo(() => [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: RiNotificationLine,
      path: '/notifications',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: RiLogoutBoxLine,
      action: () => {
        onSignOut?.();
        setIsMenuOpen(false);
      },
    },
  ], [onSignOut]);

  // Use provided menu items or fall back to defaults
  const menuOptions = useMemo(() =>
    menuItems || defaultMenuOptions, [menuItems, defaultMenuOptions]);

  // Toggle menu state and calculate position
  const toggleMenu = () => {
    if (!isMenuOpen && buttonRef.current) {
      // Calculate position when opening the menu
      const rect = buttonRef.current.getBoundingClientRect();
      const top = rect.bottom + 8; // Position below button with 8px gap
      const right = window.innerWidth - rect.right + 20; // Add 12px margin from right edge

      setMenuPosition({ top, right });
    }

    // Update local state
    setIsMenuOpen(prev => !prev);

    // Notify parent if this is externally controlled
    if (toggleProfileTooltip) {
      toggleProfileTooltip();
    }
  };

  // Control menu visibility with animation
  useEffect(() => {
    if (isMenuOpen) {
      // Show immediately when opening
      // next animation frame
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    } else {
      // Delay hiding to complete animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  // Enhanced close menu when interacting outside
  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    // Function to handle any interaction outside menu
    const handleOutsideInteraction = (event: MouseEvent | TouchEvent | FocusEvent) => {
      if (
        menuRef.current
        && buttonRef.current
        && !menuRef.current.contains(event.target as Node)
        && !buttonRef.current.contains(event.target as Node)
      ) {
        // Close menu and notify parent if controlled externally
        setIsMenuOpen(false);
        if (toggleProfileTooltip) {
          toggleProfileTooltip();
        }
      }
    };

    // Add multiple event listeners for different interaction types
    document.addEventListener('mousedown', handleOutsideInteraction);
    document.addEventListener('touchstart', handleOutsideInteraction);
    document.addEventListener('focusin', handleOutsideInteraction);

    // Handle escape key press
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        if (toggleProfileTooltip) {
          toggleProfileTooltip();
        }
      }
    };

    document.addEventListener('keydown', handleEscKey);

    // Clean up all event listeners
    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction);
      document.removeEventListener('touchstart', handleOutsideInteraction);
      document.removeEventListener('focusin', handleOutsideInteraction);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMenuOpen, toggleProfileTooltip]);

  // Initials for avatar fallback - memoized to prevent recalculation
  const userInitials = useMemo(() => {
    if (!userName) {
      return 'U';
    }
    return userName
      .split(' ')
      .map(name => name?.[0] || '')
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }, [userName]);

  // Resolve icon components
  const resolveIcon = (icon: React.ElementType | string): React.ElementType => {
    if (typeof icon === 'string') {
      return userMenuIconMap[icon] || RiUserLine; // Fallback icon
    }
    return icon;
  };

  // Create portal for menu to ensure it's rendered at the root level
  const renderMenu = () => {
    if (!isVisible || typeof document === 'undefined') {
      return null;
    }

    return createPortal(
      <div
        ref={menuRef}
        className={clsx(
          'user-menu-dropdown',
          isMenuOpen ? 'animate-menu-down-in' : 'animate-menu-down-out', // Changed animation class name
        )}
        style={{
          top: `${menuPosition.top}px`,
          right: `${menuPosition.right}px`,
        }}
        data-testid="user-menu-dropdown"
        role="menu"
      >
        <div className="user-menu-header">
          <div className="user-menu-name">{userName}</div>
        </div>
        <div className="user-menu-divider" />
        <ul className="user-menu-options">
          {menuOptions.map((option) => {
            const Icon = resolveIcon(option.icon);

            return (
              <li key={option.id} className="user-menu-item" role="menuitem">
                {option.path
                  ? (
                      <Link
                        href={option.path}
                        className="user-menu-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="user-menu-icon" aria-hidden="true" />
                        <span className="user-menu-label">{option.label}</span>
                        {typeof option.count === 'number' && option.count > 0 && (
                          <span className="user-menu-count" aria-label={`${option.count} items`}>
                            {option.count > 99 ? '99+' : option.count}
                          </span>
                        )}
                      </Link>
                    )
                  : (
                      <button
                        className="user-menu-button-action"
                        onClick={option.action}
                        type="button"
                      >
                        <Icon className="user-menu-icon" aria-hidden="true" />
                        <span className="user-menu-label">{option.label}</span>
                        {typeof option.count === 'number' && option.count > 0 && (
                          <span className="user-menu-count" aria-label={`${option.count} items`}>
                            {option.count > 99 ? '99+' : option.count}
                          </span>
                        )}
                      </button>
                    )}
              </li>
            );
          })}
        </ul>
      </div>,
      document.body,
    );
  };

  return (
    <div className="user-menu-container">
      {/* Avatar Button Trigger */}
      <div
        ref={buttonRef}
        className="user-menu-button"
        onClick={toggleMenu}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleMenu();
          }
        }}
        aria-haspopup="true"
        aria-expanded={isMenuOpen}
      >
        { userImage
          ? (
              <Image
                src={userImage}
                alt={userName}
                className="user-avatar"
                width={40} // Adjust width as needed
                height={40} // Adjust height as needed
                priority // Optional: prioritize loading for LCP
              />
            )
          : (
              <div className="user-avatar-fallback">
                {userInitials}
              </div>
            )}
      </div>

      {/* Menu Portal */}
      {renderMenu()}
    </div>
  );
};

export default React.memo(UserMenu);
