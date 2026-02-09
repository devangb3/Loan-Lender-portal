import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        muted: "border-border bg-muted text-muted-foreground",
        submitted: "border-transparent bg-stage-submitted/15 text-stage-submitted",
        review: "border-transparent bg-stage-review/15 text-stage-review",
        accepted: "border-transparent bg-stage-accepted/15 text-stage-accepted",
        progress: "border-transparent bg-stage-progress/15 text-stage-progress",
        closing: "border-transparent bg-stage-closing/15 text-stage-closing",
        closed: "border-transparent bg-stage-closed/15 text-stage-closed",
        declined: "border-transparent bg-stage-declined/15 text-stage-declined",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
