'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Dropdown option type
export interface DropdownOption {
  label: string;
  value: string;
}

/**
 * Props for the Dropdown component
 */
export interface DropdownProps {
  label: string;
  options?: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  icon?: React.ReactNode;
  className?: string;
  buttonClassName?: string;
  contentClassName?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  showSortIcon?: boolean;
  children?: React.ReactNode;
  id?: string;
}

/**
 * Dropdown Component
 *
 * A fully typed dropdown component with click-outside-to-close functionality.
 *
 * @example
 * <Dropdown
 *   label="Select Option"
 *   options={[{ label: 'Option 1', value: '1' }, { label: 'Option 2', value: '2' }]}
 *   value={selectedValue}
 *   onChange={setSelectedValue}
 * />
 *
 * @example
 * // With custom icon
 * <Dropdown
 *   label="Filter"
 *   options={options}
 *   value={value}
 *   onChange={handleChange}
 *   icon={<FilterIcon />}
 * />
 */
export const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  icon,
  className,
  buttonClassName,
  contentClassName,
  isOpen: isOpenProp,
  onToggle,
  children,
  id,
}) => {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use controlled or uncontrolled open state
  const isOpen = isOpenProp !== undefined ? isOpenProp : isOpenInternal;

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (onToggle === undefined) {
          setIsOpenInternal(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  // Handle Escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        if (onToggle) {
          onToggle();
        } else {
          setIsOpenInternal(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onToggle]);

  // Handle option selection
  const handleOptionClick = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    if (onToggle === undefined) {
      setIsOpenInternal(false);
    }
  };

  // Toggle dropdown open/closed
  const toggleDropdown = () => {
    if (onToggle) {
      onToggle();
    } else {
      setIsOpenInternal(!isOpenInternal);
    }
  };

  // Find the selected option label
  const selectedOption = options?.find((option) => option.value === value);
  const displayLabel = selectedOption ? selectedOption.label : label;

  // Generate unique ID for the dropdown menu
  const menuId = id || `dropdown-menu-${label.replace(/\s+/g, '-').toLowerCase()}`;

  // Chevron down SVG icon
  const ChevronDownIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <div className={cn('dropdown relative', className)} ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          'flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-md border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-all hover:border-accent hover:bg-secondary',
          buttonClassName
        )}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={label}
      >
        {icon && <span className="inline-flex">{icon}</span>}
        <span className="inline-flex">{displayLabel}</span>
        <ChevronDownIcon />
      </button>

      <div
        className={cn(
          'absolute right-0 top-[calc(100%+0.5rem)] z-[100] min-w-[200px] overflow-hidden rounded-md border border-border bg-card shadow-lg',
          isOpen ? 'block' : 'hidden',
          contentClassName
        )}
        role="menu"
        id={menuId}
        aria-label={`${label} menu`}
      >
        {children ? (
          children
        ) : (
          options?.map((option) => (
            <button
              key={option.value}
              type="button"
              className={cn(
                'block w-full border-none bg-transparent px-4 py-3 text-left text-sm text-foreground transition-colors hover:bg-secondary',
                option.value === value && 'bg-primary font-medium text-primary-foreground hover:bg-primary/90'
              )}
              onClick={() => handleOptionClick(option.value)}
              role="menuitem"
              aria-current={option.value === value ? 'true' : undefined}
            >
              {option.label}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

Dropdown.displayName = 'Dropdown';
