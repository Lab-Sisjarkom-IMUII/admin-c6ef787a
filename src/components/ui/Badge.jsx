'use client';

export default function Badge({
  children,
  variant = 'soft',
  color = 'default',
  icon,
  pulse = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200';
  
  const colorSchemes = {
    default: {
      solid: 'bg-gray-500 text-white',
      outline: 'border border-gray-500 text-gray-400',
      soft: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    },
    primary: {
      solid: 'bg-[var(--primary)] text-white',
      outline: 'border border-[var(--primary)] text-[var(--primary)]',
      soft: 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30',
    },
    accent: {
      solid: 'bg-[var(--accent)] text-white',
      outline: 'border border-[var(--accent)] text-[var(--accent)]',
      soft: 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30',
    },
    success: {
      solid: 'bg-green-500 text-white',
      outline: 'border border-green-500 text-green-400',
      soft: 'bg-green-500/20 text-green-400 border border-green-500/30',
    },
    warning: {
      solid: 'bg-yellow-500 text-white',
      outline: 'border border-yellow-500 text-yellow-400',
      soft: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    },
    danger: {
      solid: 'bg-red-500 text-white',
      outline: 'border border-red-500 text-red-400',
      soft: 'bg-red-500/20 text-red-400 border border-red-500/30',
    },
    info: {
      solid: 'bg-blue-500 text-white',
      outline: 'border border-blue-500 text-blue-400',
      soft: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    },
  };
  
  const colorScheme = colorSchemes[color] || colorSchemes.default;
  const variantClass = colorScheme[variant] || colorScheme.soft;
  const pulseClass = pulse ? 'animate-pulse' : '';
  
  return (
    <span
      className={`${baseStyles} ${variantClass} ${pulseClass} ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
