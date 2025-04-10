'use client';

import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { createPortal } from 'react-dom';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearchOutline } from 'react-icons/io5';
import '@/styles/zrx/select.css';

// Add this outside the component to share across all instances
const openDropdownRef = { current: null as HTMLDivElement | null };

export type ZrxSelectOption = {
  value: string;
  label: string;
  leftElement?: React.ReactNode;
};

type ZrxSelectProps = {
  placeholder?: string;
  value?: string;
  options: ZrxSelectOption[];
  errorMessage?: string;
  successMessage?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  searchHint?: string;
  style?: React.CSSProperties;
  grid?: boolean; // Add this prop
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const ZrxSelect: React.FC<ZrxSelectProps> = ({
  placeholder = 'Select an option',
  value,
  options,
  errorMessage,
  successMessage,
  onChange,
  disabled,
  searchHint = 'Search...',
  style,
  grid, // Add this prop
  ...rest
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const selectRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Success takes priority over error
  const hasSuccess = !!successMessage;
  const messageToDisplay = hasSuccess ? successMessage : errorMessage;
  const showMessage = !!messageToDisplay;

  // Get the selected option label for display
  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || '';

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle scroll locking and position calculation with proper timing
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Store original body styles
    const originalStyles = {
      overflow: document.body.style.overflow,
      paddingRight: document.body.style.paddingRight,
    };

    // Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Lock scroll while preserving layout width
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Handle scroll prevention
    const preventScroll = (e: Event) => {
      if (dropdownRef.current?.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      // Restore original styles
      document.body.style.overflow = originalStyles.overflow || '';
      document.body.style.paddingRight = originalStyles.paddingRight || '';

      // Remove event listeners
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, [isOpen]);

  // Calculate position just before paint
  React.useLayoutEffect(() => {
    if (!isOpen || !selectRef.current) {
      return;
    }

    // Compute position in the commit phase, right before browser paint
    const updatePosition = () => {
      if (!selectRef.current) {
        return;
      }
      const rect = selectRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 10, // Keeping the 5px margin
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();

    // Add event listeners for repositioning on scroll/resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, { passive: true });

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionSelect = (option: ZrxSelectOption) => {
    onChange && onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  // Handle outside clicks to close the dropdown
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    // Set this dropdown as the currently open one
    openDropdownRef.current = selectRef.current;

    // Create handler to detect clicks outside the dropdown
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (
        selectRef.current
        && dropdownRef.current
        && !selectRef.current.contains(e.target as Node)
        && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    // Create handler for escape key
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleEscKey);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  // Create the dropdown content
  const renderDropdown = () => {
    if (!isOpen) {
      return null;
    }

    return (
      <div
        className="zrx-select-dropdown"
        ref={dropdownRef}
        style={{
          position: 'absolute',
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 9999,
        }}
      >
        <div className="zrx-select-search-container">
          <IoSearchOutline className="zrx-select-search-icon" />
          <input
            ref={searchInputRef}
            className="zrx-select-search"
            placeholder={searchHint}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onClick={e => e.stopPropagation()}
          />
        </div>

        <div className="zrx-select-options">
          {filteredOptions.length > 0
            ? (
                filteredOptions.map(option => (
                  <div
                    key={option.value}
                    className={cn(
                      'zrx-select-option',
                      option.value === value && 'zrx-select-option-selected',
                    )}
                    onClick={() => handleOptionSelect(option)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleOptionSelect(option);
                      }
                    }}
                  >
                    {option.leftElement}
                    {option.label}
                  </div>
                ))
              )
            : (
                <div className="zrx-select-no-options">No options found</div>
              )}
        </div>
      </div>
    );
  };

  return (
    <div className="zrx-select-container" style={style} {...rest}>
      <div className="zrx-select-wrapper">
        <div
          className={cn(
            'zrx-select',
            // Remove grid-specific class
            disabled && 'zrx-select_disabled',
            showMessage && (hasSuccess ? 'zrx-select-success' : 'zrx-select-error'),
          )}
          ref={selectRef}
        >
          <div
            className="zrx-select-value"
            onClick={handleToggle}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleToggle();
              }
            }}
          >
            {value
              ? (
                  <>
                    {selectedOption?.leftElement}
                    {displayValue}
                  </>
                )
              : (
                  <span className="zrx-select-placeholder">{placeholder}</span>
                )}
          </div>
          <button
            type="button"
            onClick={handleToggle}
            disabled={disabled}
            className={cn(
              'zrx-select-button',
              isOpen && 'zrx-select-button-active',
            )}
            aria-label={isOpen ? 'Close dropdown' : 'Open dropdown'}
          >
            <IoIosArrowDown className={`zrx-select-icon ${isOpen ? 'zrx-select-icon-open' : ''}`} />
          </button>
        </div>

        {/* Use the same dropdown portal logic based on grid prop */}
        {isOpen && typeof document !== 'undefined' && createPortal(
          renderDropdown(),
          document.body,
        )}
      </div>

      {showMessage && (
        <div className="zrx-select-tooltip-container">
          <div
            className={cn(
              'zrx-select-tooltip',
              hasSuccess ? 'zrx-select-tooltip-success' : 'zrx-select-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className="zrx-select-tooltip-arrow"
            >
              <polygon
                points="0,8 6,1 12,8"
                fill={hasSuccess
                  ? theme === 'dark' ? '#368F44' : '#EDFBF0'
                  : theme === 'dark' ? '#ff3b30' : '#f8d7da'}
              />
              <polyline
                points="0,7 6,1 12,7"
                fill="none"
                stroke={hasSuccess
                  ? theme === 'dark' ? '#368F44' : 'rgba(54, 143, 68, 0.88)'
                  : theme === 'dark' ? '#ff3b30' : 'red'}
                strokeWidth="1"
                strokeLinejoin="miter"
                strokeLinecap="butt"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZrxSelect;
