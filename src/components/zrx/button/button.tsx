import { cn } from '@/libs/utils';
import * as React from 'react';

type ZrxButtonProps = {

  /* styles */
  primary?: boolean;
  secondary?: boolean;
  success?: boolean;
  danger?: boolean;
  warning?: boolean;
  info?: boolean;
  forms?: boolean; // Add forms variant
  disabled?: boolean;

  /* variants */
  ag?: boolean; // for use in ag-grid
  grids?: boolean; // for use in zrx-grid
  multiline?: boolean; // multi-line

  /* events */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onHover?: (event: React.MouseEvent<HTMLDivElement>) => void;
} & React.HTMLAttributes<HTMLDivElement>;

const ZrxButton = (
  { ref, primary, secondary, success, danger, warning, info, forms, disabled = false, className, onClick, onHover, children, multiline, grids, ...props }: ZrxButtonProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  // Determine the variant class dynamically
  const variantClass = cn(
    primary && 'zrx-button--primary',
    secondary && 'zrx-button--secondary',
    success && 'zrx-button--success',
    danger && 'zrx-button--danger',
    warning && 'zrx-button--warning',
    info && 'zrx-button--info',
    forms && 'zrx-button--forms', // Add forms variant class
  );

  // Rest of the component remains the same
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onClick?.(event);
    }
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      onHover?.(event);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
      onClick?.(event as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      aria-disabled={disabled}
      tabIndex={0}
      className={cn(
        grids ? 'zrx-button--grids' : (multiline ? 'zrx-button--multiline' : 'zrx-button--normal'),
        variantClass, // Apply the correct variant class
        disabled && 'zrx-button--disabled',
        className,
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

ZrxButton.displayName = 'ZrxButton';

export { ZrxButton };
export type { ZrxButtonProps };

export default ZrxButton;
