'use client';

import Button from './Button';
import Card from './Card';

export default function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
  className = '',
  ...props
}) {
  return (
    <Card className={`text-center py-12 ${className}`} {...props}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]/40">
            {icon}
          </div>
        </div>
      )}
      
      {title && (
        <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
          {title}
        </h3>
      )}
      
      {description && (
        <p className="text-sm text-[var(--foreground)]/60 mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {action && actionLabel && (
        <Button variant="primary" onClick={action}>
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
