import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BadgeProps {
  status: 'draft' | 'pending' | 'review' | 'success' | 'rejected' | 'default';
  children: React.ReactNode;
  className?: string;
  large?: boolean;
}

export default function Badge({ status, children, className, large = false }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full font-medium ring-1 ring-inset";
  const sizeClasses = large ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs";
  
  const statusClasses = {
    draft: "bg-gray-50 text-gray-600 ring-gray-500/10",
    pending: "bg-blue-50 text-blue-700 ring-blue-700/10",
    review: "bg-amber-50 text-amber-700 ring-amber-600/20",
    success: "bg-green-50 text-green-700 ring-green-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/10",
    default: "bg-indigo-50 text-indigo-700 ring-indigo-700/10",
  };

  return (
    <span className={cn(baseClasses, sizeClasses, statusClasses[status], className)}>
      {children}
    </span>
  );
}
