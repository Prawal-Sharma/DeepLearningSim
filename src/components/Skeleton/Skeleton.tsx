import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  animation?: 'pulse' | 'wave';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  className = '',
  variant = 'rectangular',
  animation = 'pulse'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const getAnimationStyles = () => {
    if (animation === 'wave') {
      return 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-wave';
    }
    return 'bg-gray-200 animate-pulse';
  };

  return (
    <div
      className={`${getVariantStyles()} ${getAnimationStyles()} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

interface SkeletonCardProps {
  lines?: number;
  showAvatar?: boolean;
  showImage?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showAvatar = false,
  showImage = false
}) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      {showImage && (
        <Skeleton height={200} className="mb-4" />
      )}
      <div className="flex items-start space-x-4">
        {showAvatar && (
          <Skeleton width={48} height={48} variant="circular" />
        )}
        <div className="flex-1 space-y-3">
          <Skeleton height={24} width="60%" />
          {Array.from({ length: lines }).map((_, index) => (
            <Skeleton
              key={index}
              height={16}
              width={index === lines - 1 ? '80%' : '100%'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export const SkeletonNetwork: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <Skeleton height={30} width="40%" className="mb-6" />
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton height={40} width={120} />
          <Skeleton height={40} width={120} />
          <Skeleton height={40} width={120} />
        </div>
        <Skeleton height={300} />
        <div className="flex justify-center space-x-4">
          <Skeleton height={20} width={150} />
          <Skeleton height={20} width={150} />
        </div>
      </div>
    </div>
  );
};