'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

// Dropdown option type
export interface DropdownOption {
  label: string;
  value: string;
}

// Dropdown props
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
}

/**
 * Merges multiple class names, filtering out falsy values
 */
const mergeClassNames = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

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
    <div className={mergeClassNames(styles['dropdown'], className)} ref={dropdownRef}>
      <button
        type="button"
        className={mergeClassNames(styles['dropdownButton'], buttonClassName)}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {icon && <span className={styles['dropdownIcon']}>{icon}</span>}
        <span className={styles['dropdownLabel']}>{displayLabel}</span>
        <ChevronDownIcon />
      </button>

      <div className={mergeClassNames(styles['dropdownContent'], isOpen && styles['show'], contentClassName)}>
        {children ? (
          children
        ) : (
          options?.map((option) => (
            <button
              key={option.value}
              type="button"
              className={mergeClassNames(
                styles['dropdownItem'],
                option.value === value && styles['active']
              )}
              onClick={() => handleOptionClick(option.value)}
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
