import { cn } from '../../utils/functions';

type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
type SkeletonAnimation = 'shimmer' | 'pulse' | 'wave' | 'none';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  animation?: SkeletonAnimation;
  width?: string | number;
  height?: string | number;
}

const variantClasses: Record<SkeletonVariant, string> = {
  text: 'h-4 w-full rounded-md',
  circular: 'rounded-full aspect-square',
  rectangular: 'rounded-none',
  rounded: 'rounded-lg',
};

const animationClasses: Record<SkeletonAnimation, string> = {
  shimmer: 'skeleton',
  pulse: 'skeleton-pulse',
  wave: 'skeleton-wave',
  none: 'bg-[hsl(var(--skeleton))]',
};

export function Skeleton({
  className,
  variant = 'text',
  animation = 'shimmer',
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(variantClasses[variant], animationClasses[animation], className)}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  );
}

// Componentes compostos
export function SkeletonAvatar({
  size = 48,
  className,
  animation = 'shimmer',
}: {
  size?: number;
  className?: string;
  animation?: SkeletonAnimation;
}) {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      animation={animation}
      className={className}
    />
  );
}

export function SkeletonText({
  lines = 3,
  className,
  animation = 'shimmer',
}: {
  lines?: number;
  className?: string;
  animation?: SkeletonAnimation;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          animation={animation}
          style={{ width: i === lines - 1 ? '70%' : '100%' }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  animation = 'shimmer',
}: {
  className?: string;
  animation?: SkeletonAnimation;
}) {
  return (
    <div className={cn('bg-card border-border space-y-4 rounded-xl border p-4', className)}>
      <Skeleton variant="rounded" height={160} animation={animation} />
      <div className="space-y-2">
        <Skeleton variant="text" style={{ width: '60%' }} animation={animation} />
        <Skeleton variant="text" animation={animation} />
        <Skeleton variant="text" style={{ width: '80%' }} animation={animation} />
      </div>
    </div>
  );
}

export function SkeletonProfile({
  className,
  animation = 'shimmer',
}: {
  className?: string;
  animation?: SkeletonAnimation;
}) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <SkeletonAvatar size={56} animation={animation} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" style={{ width: '40%' }} height={20} animation={animation} />
        <Skeleton variant="text" style={{ width: '60%' }} height={14} animation={animation} />
      </div>
    </div>
  );
}
