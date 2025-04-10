'use client';

import type { FC, ReactElement } from 'react';
import { RiArrowRightSLine, RiMoreFill } from '@remixicon/react';
import { useEffect, useRef, useState } from 'react';

export type NavigationLocation = {
  label: string;
  icon: ReactElement;
  path: string;
  onClick: () => void;
};

type BreadcrumbProps = {

  locations: NavigationLocation[];
  compactDisplay?: boolean;
  ultraCompactDisplay?: boolean;
};

const Breadcrumb: FC<BreadcrumbProps> = ({
  locations,
  compactDisplay = false,
  ultraCompactDisplay = false,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTooltipOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!locations || locations.length === 0) {
    return null;
  }

  if (locations.length === 1) {
    const location = locations[0];
    if (!location) {
      return null;
    }

    return (
      <div className="flex items-center">
        <div
          className="breadcrumb-highlight px-2 flex items-center cursor-pointer"
          onClick={location.onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              location.onClick();
            }
          }}
          aria-label={location.label}
        >
          {location.icon}
          {!ultraCompactDisplay && <span className="ml-2">{location.label}</span>}
        </div>
      </div>
    );
  }

  const renderDropdown = (skippedLocations: NavigationLocation[]) => {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="mx-1 px-1 rounded-md hover:bg-zrx_white-f0 dark:hover:bg-zrx_black-r65"
          onClick={() => setTooltipOpen(!tooltipOpen)}
          aria-label="Show more locations"
          type="button"
        >
          <RiMoreFill
            className="text-zrx_black-666 dark:text-zrx_white-aa"
            style={{ width: '22px', height: '22px' }}
          />
        </button>

        {tooltipOpen && (
          <div
            className="interface-navbar-tooltip absolute left-0 mt-1 z-50 min-w-40"
            style={{ marginTop: '17.5px' }}
          >
            <ul className="p-2">
              {skippedLocations.map(location =>
                location
                  ? (
                      <li
                        key={location.path}
                        className="interface-navbar-tooltip-item"
                      >
                        <button
                          className="flex items-center w-full text-left"
                          onClick={() => {
                            location.onClick();
                            setTooltipOpen(false);
                          }}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              location.onClick();
                              setTooltipOpen(false);
                            }
                          }}
                          aria-label={location.label}
                          type="button"
                        >
                          {location.icon}
                          <span className="ml-2">{location.label}</span>
                        </button>
                      </li>
                    )
                  : null,
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderLocation = (location: NavigationLocation, isLast: boolean) => {
    if (!location) {
      return null;
    }

    return (
      <div key={location.path} className="flex items-center">
        <span
          className={`flex items-center px-2 ${isLast ? 'breadcrumb-highlight' : 'breadcrumb-background'}`}
          onClick={location.onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              location.onClick();
            }
          }}
        >
          {location.icon}
          {!ultraCompactDisplay && <span className="ml-2">{location.label}</span>}
        </span>
        {!isLast && (
          <RiArrowRightSLine
            className="text-zrx_black-666 dark:text-zrx_white-aa"
            style={{ width: '22px', height: '22px' }}
          />
        )}
      </div>
    );
  };

  if (compactDisplay) {
    const firstLocation = locations[0];
    const lastLocation = locations[locations.length - 1];

    if (!firstLocation || !lastLocation) {
      return null;
    }

    const intermediateLocations = locations.slice(1, -1);

    return (
      <div className="flex items-center">
        {renderLocation(firstLocation, false)}

        {intermediateLocations.length > 0 && (
          <>
            {renderDropdown(intermediateLocations)}
            <RiArrowRightSLine
              className="text-zrx_black-666 dark:text-zrx_white-aa"
              style={{ width: '22px', height: '22px' }}
            />
          </>
        )}

        {renderLocation(lastLocation, true)}
      </div>
    );
  }

  if (locations.length > 3) {
    const firstLocation = locations[0];
    const lastLocation = locations[locations.length - 1];
    if (!firstLocation || !lastLocation) {
      return null;
    }

    const skippedLocations = locations.slice(1, -1);

    return (
      <div className="flex items-center">
        {renderLocation(firstLocation, false)}
        {renderDropdown(skippedLocations)}
        <RiArrowRightSLine
          className="text-zrx_black-666 dark:text-zrx_white-aa"
          style={{ width: '22px', height: '22px' }}
        />
        {renderLocation(lastLocation, true)}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {locations.map((location, index) => (
        <div key={location.path} className="flex items-center">
          {renderLocation(location, index === locations.length - 1)}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumb;
