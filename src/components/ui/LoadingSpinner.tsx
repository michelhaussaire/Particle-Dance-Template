/**
 * Loading spinner component for async operations
 * 
 * Used throughout the app for loading states, particularly
 * when initializing Three.js components or processing exports.
 */

import { cn } from '@/lib/utils/cn';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text = 'Loading...' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  };

  return (
    <div className={cn(
      "flex flex-col items-center justify-center space-y-4 min-h-[200px]",
      className
    )}>
      <div className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-purple-500",
        sizeClasses[size]
      )} />
      
      {text && (
        <p className="text-sm text-gray-400 animate-pulse">{text}</p>
      )}
      
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}