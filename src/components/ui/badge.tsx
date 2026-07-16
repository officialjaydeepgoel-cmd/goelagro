import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200",
        secondary: "bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200",
        destructive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        outline: "border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
