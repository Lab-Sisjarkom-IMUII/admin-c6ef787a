'use client';

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className = '',
  ...props
}) {
  const baseStyles = 'animate-shimmer bg-gradient-to-r from-[var(--muted)] via-[var(--border)] to-[var(--muted)] bg-[length:200%_100%] rounded';
  
  const variants = {
    text: 'h-4',
    heading: 'h-6',
    title: 'h-8',
    avatar: 'rounded-full',
    card: 'h-32',
    button: 'h-10',
    table: 'h-12',
  };
  
  const style = {
    width: width || (variant === 'avatar' ? '2.5rem' : '100%'),
    height: height || (variants[variant] || variants.text),
  };
  
  return (
    <div
      className={`${baseStyles} ${variants[variant] || ''} ${className}`}
      style={style}
      {...props}
    />
  );
}

export function SkeletonCard({ lines = 3, className = '' }) {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <Skeleton variant="heading" width="60%" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '80%' : '100%'} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 4, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} variant="text" width="25%" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" width="25%" />
          ))}
        </div>
      ))}
    </div>
  );
}
