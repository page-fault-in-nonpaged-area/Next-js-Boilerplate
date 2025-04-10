import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { ZrxButton } from '../button/button';

type ZrxInputProps = {
  placeholder?: string;
  value: string | number;
  errorMessage?: string;
  successMessage?: string;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  isNumber?: boolean;
  nonNegative?: boolean;
  min?: number;
  max?: number;
  step?: number;
  style?: React.CSSProperties;
  suffix?: string;
  prefix?: string;
  grid?: boolean; // Add grid variant prop
  password?: boolean; // Add password prop
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export const ZrxInput: React.FC<ZrxInputProps> = ({
  placeholder,
  value,
  errorMessage,
  successMessage,
  onChange,
  disabled,
  isNumber,
  nonNegative,
  min,
  max,
  step = 1,
  style,
  suffix,
  prefix,
  grid, // Add grid prop
  password, // Add password prop
  ...rest
}) => {
  const { theme } = useTheme();

  // Success takes priority over error.
  const hasSuccess = !!successMessage;
  const messageToDisplay = hasSuccess ? successMessage : errorMessage;
  const showMessage = !!messageToDisplay;

  // For numeric inputs with prefix/suffix we need to temporarily remove them on edit.
  const showInlineAffix = isNumber && (prefix || suffix);
  const [isEditing, setIsEditing] = React.useState(false);
  const [innerValue, setInnerValue] = React.useState(String(value));

  // When not editing, the displayed value should be formatted with prefix/suffix.
  const formattedValue = `${prefix || ''}${value}${suffix || ''}`;

  // Removed sync effect to prevent calling setInnerValue directly in useEffect.

  const handleDecrease = () => {
    if (disabled) {
      return;
    }
    const currentValue = Number(value) || 0;
    let newValue = currentValue - step;
    if (nonNegative && newValue < 0) {
      newValue = 0;
    }
    if (min !== undefined) {
      newValue = Math.max(min, newValue);
    }
    if (max !== undefined) {
      newValue = Math.min(max, newValue);
    }
    onChange && onChange(newValue);
  };

  const handleIncrease = () => {
    if (disabled) {
      return;
    }
    const currentValue = Number(value) || 0;
    let newValue = currentValue + step;
    if (nonNegative && newValue < 0) {
      newValue = 0;
    }
    if (min !== undefined) {
      newValue = Math.max(min, newValue);
    }
    if (max !== undefined) {
      newValue = Math.min(max, newValue);
    }
    onChange && onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // When editing, update inner value.
    const newVal = e.target.value;
    setInnerValue(newVal);
  };

  const handleFocus = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(true);
    // Remove the affixes for editing.
    setInnerValue(String(value));
  };

  const handleBlur = (_e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditing(false);
    // Parse numeric portion to remove any accidental affix input.
    const parsed = Number.parseFloat(innerValue) || 0;
    onChange && onChange(parsed);
    setInnerValue(String(parsed));
  };

  // Just update the CSS classes to match heights and remove visual differences
  const renderNumericInput = () => {
    if (showInlineAffix) {
      return (
        <input
          placeholder={placeholder}
          value={isEditing ? innerValue : formattedValue}
          disabled={disabled}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            'zrx-numeric-input',
            // Keep grid class for functionality but ensure visual consistency
            grid && 'zrx-numeric-input--grid',
            disabled && 'zrx-input-disabled',
            showMessage && (hasSuccess ? 'zrx-input-success' : 'zrx-input-error'),
          )}
        />
      );
    }
    return (
      <input
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={e =>
          onChange && onChange(isNumber ? Number(e.target.value) : e.target.value)}
        className={cn(
          'zrx-numeric-input',
          // Keep grid class for functionality but ensure visual consistency
          grid && 'zrx-numeric-input--grid',
          disabled && 'zrx-input-disabled',
          showMessage && (hasSuccess ? 'zrx-input-success' : 'zrx-input-error'),
        )}
      />
    );
  };

  return (
    <div className="zrx-input-container" style={style} {...rest}>
      {
        isNumber
          ? (
        // Render numeric input with stepper buttons.
              <div className="zrx-input-wrapper">
                <ZrxButton
                  onClick={handleDecrease}
                  disabled={disabled}
                  className={cn(
                    'zrx-input-button-left',
                    grid && 'zrx-input-button-left-grid',
                  )}
                  grids={grid} // Use grid variant for buttons
                >
                  –
                </ZrxButton>
                {renderNumericInput()}
                <ZrxButton
                  onClick={handleIncrease}
                  disabled={disabled}
                  className={cn(
                    'zrx-input-button-right',
                    grid && 'zrx-input-button-right-grid',
                  )}
                  grids={grid} // Use grid variant for buttons
                >
                  +
                </ZrxButton>
              </div>
            )
          : (
        // Render simple text input.
              <div className="zrx-input-wrapper">
                {prefix && <span className="zrx-input-prefix">{prefix}</span>}
                <input
                  placeholder={placeholder}
                  value={value}
                  type={password ? 'password' : ''} // Set input type based on password prop
                  disabled={disabled}
                  onChange={e =>
                    onChange && onChange(e.target.value)}
                  className={cn(
                    'zrx-input',
                    grid && 'zrx-input--grid',
                    disabled && 'zrx-input-disabled',
                    showMessage && (hasSuccess ? 'zrx-input-success' : 'zrx-input-error'),
                  )}
                />
                {suffix && <span className="zrx-input-suffix">{suffix}</span>}
              </div>
            )
      }

      {showMessage && (
        <div className={cn(
          'zrx-input-tooltip-container',
          grid && 'zrx-input-tooltip-container--grid', // Add grid-specific class
        )}
        >
          <div
            className={cn(
              'zrx-input-tooltip',
              grid && 'zrx-input-tooltip--grid', // Add grid-specific class
              hasSuccess
                ? 'zrx-input-tooltip-success'
                : 'zrx-input-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className={cn(
                'zrx-input-tooltip-arrow',
                grid && 'zrx-input-tooltip-arrow--grid', // Add grid-specific class
              )}
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
