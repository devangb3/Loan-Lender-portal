import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-primary/20 bg-primary/15 text-primary",
        secondary: "border-secondary/20 bg-secondary/15 text-secondary",
        destructive: "border-destructive/20 bg-destructive/15 text-destructive",
        outline: "text-foreground border-border",
        muted: "border-border bg-muted text-muted-foreground",
        submitted: "border-stage-submitted/25 bg-stage-submitted/15 text-stage-submitted",
        review: "border-stage-review/25 bg-stage-review/15 text-stage-review",
        accepted: "border-stage-accepted/25 bg-stage-accepted/15 text-stage-accepted",
        progress: "border-stage-progress/25 bg-stage-progress/15 text-stage-progress",
        closing: "border-stage-closing/25 bg-stage-closing/15 text-stage-closing",
        closed: "border-stage-closed/25 bg-stage-closed/15 text-stage-closed",
        declined: "border-stage-declined/25 bg-stage-declined/15 text-stage-declined",
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
