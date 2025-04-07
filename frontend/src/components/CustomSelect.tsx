import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
}

export const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = 'Select...', 
  className = '', 
  id,
  disabled = false
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className={`custom-select ${className} ${disabled ? 'disabled' : ''}`} ref={dropdownRef} id={id}>
      <div 
        className="select-trigger"
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>{selectedOption}</span>
        <svg 
          className={`dropdown-icon ${isOpen ? 'open' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {isOpen && !disabled && (
        <div className="select-options">
          {options.map(option => (
            <div
              key={option.value}
              className={`select-option ${value === option.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 

export default CustomSelect;