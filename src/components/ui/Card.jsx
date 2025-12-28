'use client';

export default function Card({
  children,
  className = '',
  variant = 'default',
  glass = false,
  hover = false,
  interactive = false,
  ...props
}) {
  const baseStyles = 'rounded-lg border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-300';
  
  const variants = {
    default: 'shadow-md',
    elevated: 'shadow-lg',
    bordered: 'border-2',
    glass: glass ? 'glass' : '',
  };
  
  const hoverStyles = hover || interactive
    ? 'hover:scale-[1.02] hover:shadow-xl hover:shadow-glow-primary/20 cursor-pointer'
    : '';
  
  const interactiveStyles = interactive
    ? 'focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--background)]'
    : '';
  
  const variantClass = variants[variant] || variants.default;
  
  return (
    <div
      className={`${baseStyles} ${variantClass} ${hoverStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
