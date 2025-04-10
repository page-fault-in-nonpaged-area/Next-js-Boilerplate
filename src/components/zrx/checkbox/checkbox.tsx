'use client';

import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import React from 'react';
import '@/styles/zrx/checkbox.css';

type ZrxCheckboxProps = {
  label?: string;
  disabled?: boolean;
  checked?: boolean;
  error?: string;
  success?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const ZrxCheckbox = ({ ref, label, className, disabled = false, checked, error, success, onChange, ...props }: ZrxCheckboxProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const { theme } = useTheme();
  const showMessage = !!error || !!success;
  const hasSuccess = !!success;
  const messageToDisplay = success || error;

  return (
    <div className="zrx-checkbox-container">
      <label
        className={cn(
          'zrx-checkbox-wrapper',
          disabled && 'zrx-checkbox-disabled',
          showMessage && (hasSuccess ? 'zrx-checkbox-success' : 'zrx-checkbox-error'),
          className,
        )}
      >
        <input
          type="checkbox"
          className="zrx-checkbox-input"
          disabled={disabled}
          checked={checked}
          onChange={onChange} // <-- This passes events to the parent
          ref={ref}
          {...props}
        />
        <span className="zrx-checkbox-custom"></span>
        {label && <span className="zrx-checkbox-label">{label}</span>}
      </label>

      {showMessage && (
        <div className="zrx-checkbox-tooltip-container">
          <div
            className={cn(
              'zrx-checkbox-tooltip',
              hasSuccess ? 'zrx-checkbox-tooltip-success' : 'zrx-checkbox-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className="zrx-checkbox-tooltip-arrow"
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

ZrxCheckbox.displayName = 'ZrxCheckbox';

export default ZrxCheckbox;
