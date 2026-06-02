// src/components/tiendas/TiendaSkeleton.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TiendaSkeleton() {
  return (
    <div className="rounded-lg border bg-card">
      <Skeleton className="h-24 w-full rounded-t-lg" />
      <div className="p-4">
        <div className="flex items-start justify-between -mt-8 mb-3">
          <Skeleton className="h-16 w-16 rounded-full" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between mt-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-9 w-full mt-4" />
      </div>
    </div>
  );
}