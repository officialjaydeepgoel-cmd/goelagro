import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-950">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-purple-600 rounded-2xl rotate-45 animate-pulse" />
        </div>
        <div className="space-y-2 text-center">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-full mx-auto" />
        </div>
      </div>
    </div>
  );
}
