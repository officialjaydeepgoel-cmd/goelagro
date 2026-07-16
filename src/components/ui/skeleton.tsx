import { cn } from "@/lib/utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-surface-200 dark:bg-surface-700",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
