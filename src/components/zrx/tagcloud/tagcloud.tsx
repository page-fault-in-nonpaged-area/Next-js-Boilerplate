'use client';

import { cn } from '@/libs/utils';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { createPortal } from 'react-dom';
import '@/styles/zrx/tagcloud.css';

// Define the tag type
export type Tag = {
  id: string;
  label: string;
};

// Define props for the component
type ZrxTagCloudProps = {
  tags: Tag[];
  options?: Tag[];
  onChange: (tags: Tag[]) => void;
  allowNew?: boolean;
  disabled?: boolean;
  maxTags?: number;
  errorMessage?: string;
  successMessage?: string;
  placeholder?: string;
  className?: string;
  grid?: boolean; // New prop for grid variant
};

const DEFAULT_OPTIONS: Tag[] = [];

export const ZrxTagCloud: React.FC<ZrxTagCloudProps> = ({
  tags,
  options = DEFAULT_OPTIONS,
  onChange,
  allowNew = true,
  disabled = false,
  maxTags,
  errorMessage,
  successMessage,
  placeholder = 'Add tags...',
  className, // Default to false
}) => {
  const { theme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const [filteredOptions, setFilteredOptions] = React.useState<Tag[]>(options);
  const [showAddNew, setShowAddNew] = React.useState(false);

  // Success takes priority over error
  const hasSuccess = !!successMessage;
  const messageToDisplay = hasSuccess ? successMessage : errorMessage;
  const showMessage = !!messageToDisplay;
  const hasError = !hasSuccess && !!errorMessage;

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    setInputValue(newInputValue);

    // Only filter when dropdown is open or opening it now
    if (!dropdownOpen) {
      setDropdownOpen(true);
    }

    // Apply filtering logic directly in the event handler
    if (!newInputValue.trim()) {
      setFilteredOptions(options);
      setShowAddNew(false);
    } else {
      const lowerCaseInput = newInputValue.toLowerCase().trim();

      // Filter options that match the input
      const filtered = options.filter(option =>
        option.label.toLowerCase().includes(lowerCaseInput),
      );

      setFilteredOptions(filtered);

      // Determine whether to show "Add New" option
      const exactMatch = options.some(option =>
        option.label.toLowerCase() === lowerCaseInput,
      );
      setShowAddNew(allowNew && newInputValue.trim() !== '' && !exactMatch);
    }
  };

  // Handle key press in input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();

      // First, check if we have a matching option
      const matchingOption = options.find(option =>
        option.label.toLowerCase() === inputValue.toLowerCase().trim()
        && !tags.some(tag => tag.id === option.id),
      );

      if (matchingOption) {
        // Add existing option
        addTag(matchingOption);
      } else if (allowNew) {
        // Add new tag with generated ID
        const newTag: Tag = {
          id: `new-${Date.now()}`,
          label: inputValue.trim(),
        };
        addTag(newTag);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // Remove last tag on backspace if input is empty
      const newTags = [...tags];
      newTags.pop();
      onChange(newTags);
    } else if (e.key === 'Escape') {
      // Close dropdown on escape
      setDropdownOpen(false);
      inputRef.current?.blur();
    }
  };

  // Fix the addTag function to ensure it handles tag creation correctly using function declaration for hoisting
  function addTag(tag: Tag): void {
    // Check for duplicates - compare by label to avoid adding duplicate custom tags
    if (tags.some(t => t.label.toLowerCase() === tag.label.toLowerCase())) {
      // Reset input and focus, but don't add duplicate
      setInputValue('');
      setDropdownOpen(false);
      inputRef.current?.focus();
      return;
    }

    // Make sure we have a proper ID for new tags
    const tagToAdd = tag.id.startsWith('new-')
      ? tag
      : {
          ...tag,
          id: tag.id || `new-${Date.now()}`,
        };

    if (maxTags && tags.length >= maxTags) {
      // If we're at max tags, replace the last one
      const newTags = [...tags.slice(0, -1), tagToAdd];
      onChange(newTags);
    } else {
      // Otherwise, add the new tag
      onChange([...tags, tagToAdd]);
    }

    // Reset input and close dropdown
    setInputValue('');
    setDropdownOpen(false);
    inputRef.current?.focus();
  }

  // Remove tag from the list
  const removeTag = (tagId: string) => {
    if (disabled) {
      return;
    }

    const newTags = tags.filter(tag => tag.id !== tagId);
    onChange(newTags);
  };

  // Handle clicking outside to close dropdown
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  // Handle scroll locking when dropdown is open - similar to ZrxSelect
  React.useEffect(() => {
    if (!dropdownOpen) {
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
      // Get a reference to the dropdown element in the DOM
      const dropdownElement = document.querySelector('.zrx-tagcloud-dropdown');

      // Allow scrolling inside the dropdown element
      if (dropdownElement?.contains(e.target as Node)) {
        return;
      }
      e.preventDefault();
    };

    // Add event listeners with passive: false to allow preventDefault
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
  }, [dropdownOpen]);

  // Replace or modify the existing updateDropdownPosition effect
  // with the same position calculation approach as in ZrxSelect
  React.useLayoutEffect(() => {
    if (!dropdownOpen || !containerRef.current) {
      return;
    }

    // Compute position in the commit phase, right before browser paint
    const updatePosition = () => {
      if (!containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();

      setDropdownPosition({
        top: rect.bottom + window.scrollY + 5,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    };

    updatePosition();

    // Add event listeners for repositioning on scroll/resize
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [dropdownOpen]);

  // Focus on input when clicking container
  const handleContainerClick = (e: React.MouseEvent) => {
    if (disabled) {
      return;
    }

    // Don't interfere with other click handlers
    if (e.target === inputRef.current) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
      setDropdownOpen(true);
    }
  };

  // Ensure the dropdown item clicks don't get stopped by event bubbling

  // Modify the renderDropdown function to use portal for all variants, not just grid
  const renderDropdown = () => {
    if (!dropdownOpen || disabled || (!filteredOptions.length && !showAddNew)) {
      return null;
    }

    const dropdownContent = (
      <div
        className="zrx-tagcloud-dropdown"
        style={{
          position: 'fixed', // Always use fixed positioning
          top: `${dropdownPosition.top}px`,
          left: `${dropdownPosition.left}px`,
          width: `${dropdownPosition.width}px`,
          zIndex: 10000, // Ensure very high z-index
        }}
      >
        {filteredOptions.map(option => (
          <div
            key={option.id}
            className="zrx-tagcloud-dropdown-item"
            onMouseDown={(e) => {
              e.preventDefault();
              addTag(option);
            }}
            role="button"
            tabIndex={0}
          >
            {option.label}
          </div>
        ))}

        {filteredOptions.length === 0 && !showAddNew && inputValue.trim() && (
          <div className="zrx-tagcloud-dropdown-item zrx-tagcloud-dropdown-empty">
            No matches found
          </div>
        )}

        {showAddNew && (
          <div
            className="zrx-tagcloud-dropdown-item zrx-tagcloud-dropdown-add"
            onMouseDown={(e) => {
              e.preventDefault();
              const newTag: Tag = {
                id: `new-${Date.now()}`,
                label: inputValue.trim(),
              };
              addTag(newTag);
            }}
            role="button"
            tabIndex={0}
          >
            Add "
            {inputValue.trim()}
            "
          </div>
        )}
      </div>
    );

    // Always use portal for consistent stacking context across all variants
    return typeof document !== 'undefined' ? createPortal(dropdownContent, document.body) : null;
  };

  // Updated focus handler to initialize dropdown content
  const handleFocus = () => {
    setIsFocused(true);
    setDropdownOpen(true);
    setFilteredOptions(options);
    setShowAddNew(false);
    // Position will be calculated by the event listeners when dropdown opens
  };

  return (
    <div className="zrx-tagcloud-container">
      <div
        ref={containerRef}
        className={cn(
          'zrx-tagcloud', // Remove grid-specific class
          isFocused && 'zrx-tagcloud-focused',
          disabled && 'zrx-tagcloud-disabled',
          hasError && 'zrx-tagcloud-error',
          hasSuccess && 'zrx-tagcloud-success',
          className,
        )}
        onClick={handleContainerClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleContainerClick(e as unknown as React.MouseEvent);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="zrx-tagcloud-tags">
          {tags.map(tag => (
            <div key={tag.id} className="zrx-tagcloud-tag">
              {tag.label}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTag(tag.id);
                  }}
                  className="zrx-tagcloud-tag-remove"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              )}
            </div>
          ))}
          <input
            ref={inputRef}
            className="zrx-tagcloud-input"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? placeholder : 'Type to add more...'}
            disabled={disabled}
          />
        </div>

        {/* Render dropdown using the function */}
        {renderDropdown()}
      </div>

      {/* Show tooltip message for error or success */}
      {showMessage && (
        <div className="zrx-tagcloud-tooltip-container">
          <div
            className={cn(
              'zrx-tagcloud-tooltip',
              hasSuccess ? 'zrx-tagcloud-tooltip-success' : 'zrx-tagcloud-tooltip-error',
            )}
          >
            {messageToDisplay}
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              preserveAspectRatio="none"
              className="zrx-tagcloud-tooltip-arrow"
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

      {/* Character counter for max tags */}
      {maxTags !== undefined && (
        <div className="zrx-tagcloud-counter">
          {tags.length}
          /
          {maxTags}
        </div>
      )}
    </div>
  );
};

export default ZrxTagCloud;
