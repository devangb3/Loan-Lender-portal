import * as React from "react";

import { cn } from "@/lib/utils";

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const tone =
    variant === "destructive"
      ? "border-destructive/50 text-destructive bg-destructive/5"
      : "border-border text-foreground bg-card";

  return <div ref={ref} role="alert" className={cn("relative w-full rounded-md border p-4 text-sm", tone, className)} {...props} />;
});
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => {
  return <h5 ref={ref} className={cn("mb-1 font-semibold leading-none tracking-tight", className)} {...props} />;
});
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("text-sm", className)} {...props} />;
});
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
