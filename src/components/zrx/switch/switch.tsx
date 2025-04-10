'use client';

import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import '@/styles/zrx/switch.css';

export type ZrxSwitchOption = {
  value: string;
  label: string;
  disabled?: boolean; // Allow individual options to be disabled
};

// Add toggle style to props
type ZrxSwitchProps = {
  options: ZrxSwitchOption[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiselect?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  errorMessage?: string;
  successMessage?: string;
  toggle?: boolean; // New prop to enable toggle style
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const ZrxSwitch: React.FC<ZrxSwitchProps> = ({
  options,
  value,
  onChange,
  multiselect = false, // Default to single selection for backward compatibility
  disabled = false,
  size = 'medium',
  fullWidth = false,
  errorMessage,
  successMessage,
  toggle = false, // Default to false for backward compatibility
  className,
  ...rest
}) => {
  const { theme } = useTheme();

  // Success takes priority over error
  const hasSuccess = !!successMessage;
  const messageToDisplay = hasSuccess ? successMessage : errorMessage;
  const showMessage = !!messageToDisplay;

  const handleOptionClick = (option: ZrxSwitchOption) => {
    // Don't allow clicking if the component is disabled or the individual option is disabled
    if (!disabled && !option.disabled && onChange) {
      if (multiselect) {
        // For multiselect mode, toggle values in an array
        const currentValues = Array.isArray(value) ? value : value ? [value] : [];
        if (currentValues.includes(option.value)) {
          onChange(currentValues.filter(v => v !== option.value));
        } else {
          onChange([...currentValues, option.value]);
        }
      } else {
        // Original single-select behavior
        onChange(option.value);
      }
    }
  };

  // Helper to check if an option is active
  const isOptionActive = (optionValue: string): boolean => {
    if (multiselect && Array.isArray(value)) {
      return value.includes(optionValue);
    }
    return optionValue === value;
  };

  // Add responsive state
  const [windowWidth, setWindowWidth] = React.useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  );

  // Update width on window resize
  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => {
      window.requestAnimationFrame(() => {
        setWindowWidth(window.innerWidth);
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determine if small screen
  const isSmallScreen = windowWidth < 640; // sm breakpoint in Tailwind

  return (
    <div className="zrx-switch-container">
      <div
        className={cn(
          'zrx-switch',
          `zrx-switch-${size}`,
          fullWidth && 'zrx-switch-full-width',
          disabled && 'zrx-switch-disabled',
          toggle && 'zrx-switch-toggle', // Add toggle class
          showMessage && (hasSuccess ? 'zrx-switch-success' : 'zrx-switch-error'),
          className,
        )}
        {...rest}
        style={{
          display: isSmallScreen ? 'block' : undefined,
          width: isSmallScreen ? '100%' : undefined,
        }}
      >
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleOptionClick(option)}
            className={cn(
              'zrx-switch-option',
              isSmallScreen && 'w-full',
              isOptionActive(option.value) && 'zrx-switch-option-active',
              toggle && index === 0 && 'zrx-switch-option-danger', // Add danger class to leftmost
              toggle && index === options.length - 1 && 'zrx-switch-option-success', // Add success class to rightmost
              option.disabled && 'zrx-switch-option-disabled',
            )}
            style={isSmallScreen
              ? {
                  borderLeft: 'none',
                  borderBottom: index < options.length - 1 ? '1px solid #aaa' : undefined,
                  borderRadius: index === 0
                    ? '6px 6px 0 0'
                    : index === options.length - 1
                      ? '0 0 6px 6px'
                      : '0',
                }
              : undefined}
            disabled={disabled || option.disabled}
          >
            {option.label}
          </button>
        ))}
      </div>

      {showMessage && (
        <div className="zrx-switch-tooltip-container">
          <div
            className={cn(
              'zrx-switch-tooltip',
              hasSuccess ? 'zrx-switch-tooltip-success' : 'zrx-switch-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className="zrx-switch-tooltip-arrow"
            >
              <polygon
                points="0,8 6,1 12,8"
                fill={hasSuccess
                  ? theme === 'dark' ? '#368F44' : 'rgba(76, 217, 100, 0.1)'
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

export default ZrxSwitch;
