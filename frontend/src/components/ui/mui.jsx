import React from "react";

import { Alert as UIAlert } from "./alert";
import { Badge } from "./badge";
import { Button as UIButton, buttonVariants } from "./button";
import { Card } from "./card";
import { Dialog as UIDialog, DialogContent as UIDialogContent, DialogDescription, DialogFooter, DialogTitle as UIDialogTitle } from "./dialog";
import { Input } from "./input";
import { Label } from "./label";
import { Progress } from "./progress";
import { Select as UISelect } from "./select";
import { Table as UITable, TableBody as UITableBody, TableCell as UITableCell, TableHead as UITableHead, TableHeader as UITableHeader, TableRow as UITableRow } from "./table";
import { cn } from "../../lib/utils";

const spacingUnit = 0.5;

function spacingValue(value) {
  if (value == null) return undefined;
  if (typeof value === "number") return `${value * spacingUnit}rem`;
  return value;
}

function toPx(value) {
  if (typeof value === "number") return `${value}px`;
  return value;
}

function sxToStyle(sx) {
  if (!sx || typeof sx !== "object") return {};

  const style = {};

  for (const [key, value] of Object.entries(sx)) {
    if (value == null || typeof value === "object") continue;

    switch (key) {
      case "p":
        style.padding = spacingValue(value);
        break;
      case "pt":
        style.paddingTop = spacingValue(value);
        break;
      case "pb":
        style.paddingBottom = spacingValue(value);
        break;
      case "pl":
        style.paddingLeft = spacingValue(value);
        break;
      case "pr":
        style.paddingRight = spacingValue(value);
        break;
      case "px":
        style.paddingLeft = spacingValue(value);
        style.paddingRight = spacingValue(value);
        break;
      case "py":
        style.paddingTop = spacingValue(value);
        style.paddingBottom = spacingValue(value);
        break;
      case "m":
        style.margin = spacingValue(value);
        break;
      case "mt":
        style.marginTop = spacingValue(value);
        break;
      case "mb":
        style.marginBottom = spacingValue(value);
        break;
      case "ml":
        style.marginLeft = spacingValue(value);
        break;
      case "mr":
        style.marginRight = spacingValue(value);
        break;
      case "mx":
        style.marginLeft = spacingValue(value);
        style.marginRight = spacingValue(value);
        break;
      case "my":
        style.marginTop = spacingValue(value);
        style.marginBottom = spacingValue(value);
        break;
      case "minHeight":
      case "maxHeight":
      case "minWidth":
      case "maxWidth":
      case "height":
      case "width":
      case "top":
      case "left":
      case "right":
      case "bottom":
        style[key] = toPx(value);
        break;
      case "border":
        style.border = typeof value === "number" ? `${value}px solid hsl(var(--border))` : value;
        break;
      case "borderRadius":
        style.borderRadius = spacingValue(value);
        break;
      default:
        style[key] = value;
    }
  }

  return style;
}

function mergeStyles(...styles) {
  return Object.assign({}, ...styles.filter(Boolean));
}

function elementFromComponent(Component, props, children) {
  return React.createElement(Component, props, children);
}

export function Box({ component = "div", sx, style, className, children, ...props }) {
  return elementFromComponent(
    component,
    {
      className,
      style: mergeStyles(sxToStyle(sx), style),
      ...props,
    },
    children,
  );
}

export function Container({ maxWidth = "xl", sx, style, className, children, ...props }) {
  const widths = {
    xs: "max-w-screen-sm",
    sm: "max-w-screen-md",
    md: "max-w-screen-lg",
    lg: "max-w-screen-xl",
    xl: "max-w-[1280px]",
  };

  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6", widths[maxWidth] || widths.xl, className)}
      style={mergeStyles(sxToStyle(sx), style)}
      {...props}
    >
      {children}
    </div>
  );
}

export function AppBar({ children, sx, style, className, position = "sticky", color, elevation, ...props }) {
  const positionClass = position === "sticky" ? "sticky top-0" : "relative";

  return (
    <header
      className={cn(positionClass, "z-40 border-b border-border/60 bg-card/85 backdrop-blur", className)}
      style={mergeStyles(sxToStyle(sx), style)}
      {...props}
    >
      {children}
    </header>
  );
}

export function Toolbar({ children, sx, style, className, ...props }) {
  return (
    <div className={cn("mx-auto flex h-16 max-w-[1280px] items-center px-4 sm:px-6", className)} style={mergeStyles(sxToStyle(sx), style)} {...props}>
      {children}
    </div>
  );
}

export function Stack({
  component = "div",
  direction = "column",
  spacing = 0,
  alignItems,
  justifyContent,
  flexWrap,
  minHeight,
  mb,
  mt,
  ml,
  mr,
  mx,
  my,
  sx,
  style,
  className,
  children,
  ...props
}) {
  const Component = component;
  const layoutStyle = {
    alignItems,
    justifyContent,
    flexWrap,
    minHeight,
    marginBottom: spacingValue(mb),
    marginTop: spacingValue(mt),
    marginLeft: spacingValue(ml),
    marginRight: spacingValue(mr),
  };
  if (mx != null) {
    layoutStyle.marginLeft = spacingValue(mx);
    layoutStyle.marginRight = spacingValue(mx);
  }
  if (my != null) {
    layoutStyle.marginTop = spacingValue(my);
    layoutStyle.marginBottom = spacingValue(my);
  }

  return elementFromComponent(
    Component,
    {
      className: cn(direction === "row" ? "flex flex-row" : "flex flex-col", className),
      style: mergeStyles(sxToStyle(sx), { gap: spacingValue(spacing) }, layoutStyle, style),
      ...props,
    },
    children,
  );
}

const variantTags = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body2: "p",
};

const variantClasses = {
  h1: "text-5xl",
  h2: "text-4xl",
  h3: "text-3xl",
  h4: "text-2xl",
  h5: "text-xl",
  h6: "text-lg",
  body2: "text-sm font-medium normal-case tracking-normal",
};

export function Typography({ variant = "body1", component, gutterBottom = false, fontWeight, sx, style, className, children, ...props }) {
  const Tag = component || variantTags[variant] || "p";

  return elementFromComponent(
    Tag,
    {
      className: cn(variantClasses[variant] || "text-base", gutterBottom && "mb-2", className),
      style: mergeStyles(sxToStyle(sx), { fontWeight }, style),
      ...props,
    },
    children,
  );
}

export function Button({ children, component = "button", variant = "contained", color = "primary", size = "medium", className, onClick, ...props }) {
  const variantMap = {
    contained: color === "error" ? "destructive" : "default",
    outlined: "outline",
    text: "ghost",
  };
  const sizeMap = {
    small: "sm",
    medium: "default",
    large: "lg",
  };

  const uiClass = cn(buttonVariants({ variant: variantMap[variant] || "default", size: sizeMap[size] || "default" }), className);

  if (component === "button") {
    return (
      <UIButton className={className} variant={variantMap[variant] || "default"} size={sizeMap[size] || "default"} onClick={onClick} {...props}>
        {children}
      </UIButton>
    );
  }

  return elementFromComponent(
    component,
    {
      className: uiClass,
      onClick,
      ...props,
    },
    children,
  );
}

export function IconButton({ children, className, color = "default", size = "medium", ...props }) {
  return (
    <UIButton
      variant="ghost"
      size={size === "small" ? "sm" : "icon"}
      className={cn(color === "error" && "text-destructive hover:text-destructive", className)}
      {...props}
    >
      {children}
    </UIButton>
  );
}

export function Paper({ children, className, sx, style, variant, elevation, ...props }) {
  return (
    <Card
      className={cn("rounded-lg", variant === "outlined" && "border-2", className)}
      style={mergeStyles(sxToStyle(sx), style)}
      {...props}
    >
      {children}
    </Card>
  );
}

export function Chip({ label, color = "default", size = "medium", className }) {
  const variant = color === "success" ? "secondary" : color === "error" ? "destructive" : color === "default" ? "muted" : "default";
  return <Badge className={cn(size === "small" && "px-2 py-0 text-[10px]", className)} variant={variant}>{label}</Badge>;
}

export function Alert({ children, severity = "info", sx, style, className, ...props }) {
  const variant = severity === "error" ? "destructive" : "default";
  return (
    <UIAlert variant={variant} className={className} style={mergeStyles(sxToStyle(sx), style)} {...props}>
      {children}
    </UIAlert>
  );
}

export function CircularProgress({ size = 22 }) {
  return <div className="animate-spin rounded-full border-2 border-muted border-t-primary" style={{ width: size, height: size }} />;
}

export function LinearProgress({ value = 0 }) {
  return <Progress value={value} />;
}

export function Table({ children, className, size, ...props }) {
  return <UITable className={className} {...props}>{children}</UITable>;
}

export function TableHead({ children, ...props }) {
  return <UITableHeader {...props}>{children}</UITableHeader>;
}

export function TableBody({ children, ...props }) {
  return <UITableBody {...props}>{children}</UITableBody>;
}

export function TableRow({ children, ...props }) {
  return <UITableRow {...props}>{children}</UITableRow>;
}

export function TableCell({ children, ...props }) {
  return <UITableCell {...props}>{children}</UITableCell>;
}

export function Dialog({ open, onClose, children }) {
  return <UIDialog open={open} onOpenChange={(next) => !next && onClose?.()}>{children}</UIDialog>;
}

export function DialogTitle({ children, ...props }) {
  return <UIDialogTitle {...props}>{children}</UIDialogTitle>;
}

export function DialogContent({ children, ...props }) {
  return <UIDialogContent {...props}>{children}</UIDialogContent>;
}

export function DialogContentText({ children, ...props }) {
  return <DialogDescription {...props}>{children}</DialogDescription>;
}

export function DialogActions({ children, ...props }) {
  return <DialogFooter {...props}>{children}</DialogFooter>;
}

export function List({ children, className, ...props }) {
  return <ul className={cn("space-y-2", className)} {...props}>{children}</ul>;
}

export function ListItem({ children, className, divider, ...props }) {
  return (
    <li
      className={cn(
        "rounded-md border border-border/60 bg-card/70 p-3",
        divider && "rounded-none border-x-0 border-t-0",
        className,
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export function ListItemText({ primary, secondary }) {
  return (
    <div>
      <div className="font-semibold text-foreground">{primary}</div>
      {secondary ? <div className="mt-1 text-sm text-muted-foreground">{secondary}</div> : null}
    </div>
  );
}

export const MenuItem = ({ value, children, ...props }) => (
  <option value={value} {...props}>
    {children}
  </option>
);

export const Select = React.forwardRef(({ className, children, size, ...props }, ref) => {
  return (
    <UISelect ref={ref} className={cn(size === "small" && "h-9", className)} {...props}>
      {children}
    </UISelect>
  );
});
Select.displayName = "Select";

export const TextField = React.forwardRef(
  ({
    label,
    helperText,
    fullWidth,
    className,
    select,
    children,
    inputRef,
    sx,
    style,
    size,
    ...props
  }, ref) => {
    const mergedRef = inputRef || ref;
    const fieldClass = cn(fullWidth && "w-full", className);

    return (
      <div className={fieldClass} style={mergeStyles(sxToStyle(sx), style)}>
        {label ? <Label className="mb-1 block">{label}</Label> : null}
        {select ? (
          <UISelect ref={mergedRef} className={size === "small" ? "h-9" : undefined} {...props}>
            {children}
          </UISelect>
        ) : (
          <Input ref={mergedRef} className={size === "small" ? "h-9" : undefined} {...props} />
        )}
        {helperText ? <p className="mt-1 text-xs text-muted-foreground">{helperText}</p> : null}
      </div>
    );
  },
);
TextField.displayName = "TextField";

const GRID_SPAN_CLASSES = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
  5: "col-span-5",
  6: "col-span-6",
  7: "col-span-7",
  8: "col-span-8",
  9: "col-span-9",
  10: "col-span-10",
  11: "col-span-11",
  12: "col-span-12",
};

const GRID_SPAN_SM_CLASSES = {
  1: "sm:col-span-1",
  2: "sm:col-span-2",
  3: "sm:col-span-3",
  4: "sm:col-span-4",
  5: "sm:col-span-5",
  6: "sm:col-span-6",
  7: "sm:col-span-7",
  8: "sm:col-span-8",
  9: "sm:col-span-9",
  10: "sm:col-span-10",
  11: "sm:col-span-11",
  12: "sm:col-span-12",
};

const GRID_SPAN_MD_CLASSES = {
  1: "md:col-span-1",
  2: "md:col-span-2",
  3: "md:col-span-3",
  4: "md:col-span-4",
  5: "md:col-span-5",
  6: "md:col-span-6",
  7: "md:col-span-7",
  8: "md:col-span-8",
  9: "md:col-span-9",
  10: "md:col-span-10",
  11: "md:col-span-11",
  12: "md:col-span-12",
};

const GRID_SPAN_LG_CLASSES = {
  1: "lg:col-span-1",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  5: "lg:col-span-5",
  6: "lg:col-span-6",
  7: "lg:col-span-7",
  8: "lg:col-span-8",
  9: "lg:col-span-9",
  10: "lg:col-span-10",
  11: "lg:col-span-11",
  12: "lg:col-span-12",
};

function gridSizeToClass(size, breakpoint = "base") {
  if (size == null) return null;

  const base = typeof size === "number" ? size : parseInt(size, 10);
  if (!Number.isFinite(base) || base <= 0) return null;
  const clamped = Math.min(12, Math.max(1, base));

  if (breakpoint === "sm") return GRID_SPAN_SM_CLASSES[clamped];
  if (breakpoint === "md") return GRID_SPAN_MD_CLASSES[clamped];
  if (breakpoint === "lg") return GRID_SPAN_LG_CLASSES[clamped];
  return GRID_SPAN_CLASSES[clamped];
}

export function Grid({ container, spacing = 0, size, className, sx, style, children, ...props }) {
  if (container) {
    return (
      <div
        className={cn("grid grid-cols-12", className)}
        style={mergeStyles(sxToStyle(sx), { gap: spacingValue(spacing) }, style)}
        {...props}
      >
        {children}
      </div>
    );
  }

  const classes = [];

  if (typeof size === "object" && size !== null) {
    classes.push(gridSizeToClass(size.xs, "base"));
    classes.push(gridSizeToClass(size.sm, "sm"));
    classes.push(gridSizeToClass(size.md, "md"));
    classes.push(gridSizeToClass(size.lg, "lg"));
  } else {
    classes.push(gridSizeToClass(size || 12, "base"));
  }

  return (
    <div className={cn("col-span-12", ...classes.filter(Boolean), className)} style={mergeStyles(sxToStyle(sx), style)} {...props}>
      {children}
    </div>
  );
}
