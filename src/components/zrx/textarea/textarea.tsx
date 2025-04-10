'use client';

import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import '@/styles/zrx/textarea.css';

type ZrxTextareaProps = {
  value?: string;
  onChange?: (value: string) => void;
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  disabled?: boolean;
} & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'>;

export const ZrxTextarea: React.FC<ZrxTextareaProps> = ({
  value = '',
  onChange,
  errorMessage,
  successMessage,
  placeholder = 'Type here...',
  rows = 4,
  maxLength,
  disabled = false,
  className,
  ...rest
}) => {
  const { theme } = useTheme();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Success takes priority over error
  const hasSuccess = !!successMessage;
  const messageToDisplay = hasSuccess ? successMessage : errorMessage;
  const showMessage = !!messageToDisplay;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="zrx-textarea-container">
      <div className="zrx-textarea-wrapper">
        <textarea
          ref={textareaRef}
          className={cn(
            'zrx-textarea',
            disabled && 'zrx-textarea-disabled',
            showMessage && (hasSuccess ? 'zrx-textarea-success' : 'zrx-textarea-error'),
            className,
          )}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
          {...rest}
        />

        {maxLength && (
          <div className="zrx-textarea-counter">
            {value.length}
            /
            {maxLength}
          </div>
        )}
      </div>

      {showMessage && (
        <div className="zrx-textarea-tooltip-container">
          <div
            className={cn(
              'zrx-textarea-tooltip',
              hasSuccess ? 'zrx-textarea-tooltip-success' : 'zrx-textarea-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className="zrx-textarea-tooltip-arrow"
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

export default ZrxTextarea;
