'use client';

import { useState } from 'react';

export default function Input({
  label,
  error,
  success,
  leftIcon,
  rightIcon,
  floatingLabel = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const hasValue = props.value !== undefined && props.value !== '' && props.value !== null;
  const isFloatingActive = floatingLabel && (focused || hasValue);
  
  const inputStyles = `
    w-full rounded-lg border border-[var(--border)] 
    bg-[var(--card)] px-4 py-2.5
    text-[var(--foreground)] 
    placeholder:text-[var(--foreground)]/40
    focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/50 focus:border-[var(--primary)] focus:shadow-glow-primary/20
    disabled:opacity-50 disabled:cursor-not-allowed
    transition-all duration-300
  `;
  
  const containerClass = `
    relative w-full
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon || success ? 'pr-10' : ''}
  `;
  
  const floatingLabelClass = `
    absolute left-4 transition-all duration-300 pointer-events-none
    ${isFloatingActive 
      ? 'top-2 text-xs text-[var(--primary)] font-medium' 
      : 'top-3 text-sm text-[var(--foreground)]/60'
    }
  `;
  
  return (
    <div className="w-full">
      {!floatingLabel && label && (
        <label className="block mb-2 text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      
      <div className={containerClass}>
        {/* Floating Label */}
        {floatingLabel && (
          <label className={floatingLabelClass}>
            {label}
          </label>
        )}
        
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground)]/50">
            {leftIcon}
          </div>
        )}
        
        {/* Input */}
        <input
          className={`
            ${inputStyles} 
            ${error ? 'border-red-500 focus:ring-red-500/50 focus:border-red-500' : ''}
            ${success ? 'border-green-500 focus:ring-green-500/50 focus:border-green-500' : ''}
            ${floatingLabel ? (isFloatingActive ? 'pt-6 pb-2' : 'py-2.5') : ''}
            ${className}
          `}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus && props.onFocus(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur && props.onBlur(e);
          }}
          {...props}
        />
        
        {/* Right Icon / Success Indicator */}
        {(rightIcon || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {success ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              rightIcon
            )}
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {/* Success Message */}
      {success && !error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-green-400">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
