import * as React from "react";

import { cn } from "@/lib/utils";

function Dialog({ open, children, onOpenChange }) {
  React.useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onOpenChange?.(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onOpenChange?.(false);
      }}
    >
      {children}
    </div>
  );
}

const DialogContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("glass-card w-full max-w-lg rounded-lg p-6 animate-scale-in", className)} {...props} />
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => <div className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />;
const DialogFooter = ({ className, ...props }) => <div className={cn("mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)} {...props} />;

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-xl font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
