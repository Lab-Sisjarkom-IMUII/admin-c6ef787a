'use client';

import { useState, useRef } from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  loading = false,
  icon,
  iconPosition = 'left',
  href,
  target,
  rel,
  ...props
}) {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);
  const isLink = typeof href === 'string' && href.length > 0;
  const Element = isLink ? 'a' : 'button';
  
  const baseStyles = 'relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--background)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden';
  
  const variants = {
    primary: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 hover:scale-105 active:scale-95 focus:ring-[var(--primary)] shadow-md hover:shadow-lg',
    accent: 'bg-[var(--accent)] text-white hover:bg-[var(--accent)]/90 hover:scale-105 active:scale-95 focus:ring-[var(--accent)] shadow-md hover:shadow-lg',
    outline: 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)] hover:border-[var(--primary)]/50 focus:ring-[var(--primary)]',
    ghost: 'text-[var(--foreground)] hover:bg-[var(--muted)] focus:ring-[var(--primary)]',
    gradient: 'gradient-primary text-white hover:opacity-90 hover:scale-105 active:scale-95 focus:ring-[var(--primary)] shadow-md hover:shadow-glow-primary',
    glow: 'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 hover:scale-105 active:scale-95 focus:ring-[var(--primary)] shadow-glow-primary',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };
  
  const handleClick = (e) => {
    if (disabled || loading) {
      if (isLink) e.preventDefault();
      return;
    }
    
    // Ripple effect
    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples((prev) => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
    
    if (onClick) onClick(e);
  };
  
  const iconElement = icon && (
    <span className={loading ? 'opacity-0' : ''}>{icon}</span>
  );
  
  return (
    <Element
      ref={buttonRef}
      type={isLink ? undefined : type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={!isLink && (disabled || loading)}
      onClick={handleClick}
      href={isLink ? href : undefined}
      target={isLink ? target : undefined}
      rel={isLink ? rel : undefined}
      role={isLink ? 'button' : undefined}
      aria-disabled={isLink ? (disabled || loading) : undefined}
      tabIndex={isLink && (disabled || loading) ? -1 : undefined}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
      
      {/* Loading spinner */}
      {loading && (
        <span className="absolute">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      {/* Content */}
      <span className={`flex items-center ${loading ? 'opacity-0' : ''}`}>
        {iconPosition === 'left' && iconElement}
        {children}
        {iconPosition === 'right' && iconElement}
      </span>
    </Element>
  );
}
