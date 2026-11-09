import type { HTMLAttributes } from 'react';

/** A small Shadcn-style loading placeholder that follows Pixelify's dark surfaces. */
export function Skeleton({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`motion-safe:animate-pulse rounded-md bg-white/[0.08] ${className}`}
      {...props}
    />
  );
}
