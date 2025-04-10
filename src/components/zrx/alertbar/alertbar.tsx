'use client';

import { cn } from '@/libs/utils';
import * as React from 'react';
import {
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
  FiFileText,
  FiInfo,
} from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

type ZrxAlertBarProps = {
  /* variants */
  primary?: boolean;
  secondary?: boolean;
  warning?: boolean;
  success?: boolean;
  danger?: boolean;

  /* content */
  title?: string;
  message: string;

  /* state */
  onClose?: () => void;
  showCloseButton?: boolean;
  icon?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ZrxAlertBar = (
  { ref, className, primary, secondary, warning, success, danger, title, message, onClose, showCloseButton = true, icon, ...props }: ZrxAlertBarProps & { ref?: React.RefObject<HTMLDivElement | null> },
) => {
  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!visible) {
    return null;
  }

  const variantClass = cn(
    primary && 'zrx-alertbar--primary',
    secondary && 'zrx-alertbar--secondary',
    warning && 'zrx-alertbar--warning',
    success && 'zrx-alertbar--success',
    danger && 'zrx-alertbar--danger',
  );

  // Determine which icon to use based on variant
  const alertIcon = icon || (
    primary
      ? <FiInfo />
      : secondary
        ? <FiFileText />
        : warning
          ? <FiAlertTriangle />
          : success
            ? <FiCheckCircle />
            : danger
              ? <FiAlertCircle />
              : null
  );

  return (
    <div
      ref={ref}
      className={cn('zrx-alertbar', variantClass, className)}
      {...props}
    >
      {alertIcon && (
        <div className="zrx-alertbar__icon">
          {alertIcon}
        </div>
      )}
      <div className="zrx-alertbar__content">
        {title && <div className="zrx-alertbar__title">{title}</div>}
        <div className="zrx-alertbar__message">{message}</div>
      </div>

      {showCloseButton && (
        <button
          onClick={handleClose}
          className="zrx-alertbar__close"
          aria-label="Close alert"
          type="button"
        >
          <IoMdClose />
        </button>
      )}
    </div>
  );
};

ZrxAlertBar.displayName = 'ZrxAlertBar';

export { ZrxAlertBar };
export type { ZrxAlertBarProps };
export default ZrxAlertBar;
