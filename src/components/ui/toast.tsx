"use client";

import * as React from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle02Icon,
  Cancel01Icon,
  InformationCircleIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "@/lib/utils";

export interface ToastProps {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  variant?: "default" | "destructive" | "success";
  duration?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Toast = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, "title"> & ToastProps
>(
  (
    {
      className,
      title,
      description,
      action,
      variant = "default",
      duration = 5000,
      open = true,
      onOpenChange,
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = React.useState(open);

    React.useEffect(() => {
      setIsOpen(open);
    }, [open]);

    // Auto-dismiss after duration
    React.useEffect(() => {
      if (!isOpen) return;

      const timer = setTimeout(() => {
        setIsOpen(false);
        onOpenChange?.(false);
      }, duration);

      return () => clearTimeout(timer);
    }, [isOpen, duration, onOpenChange]);

    const handleClose = () => {
      setIsOpen(false);
      onOpenChange?.(false);
    };

    const getIcon = () => {
      switch (variant) {
        case "success":
          return CheckmarkCircle02Icon;
        case "destructive":
          return AlertCircleIcon;
        default:
          return InformationCircleIcon;
      }
    };

    const getVariantStyles = () => {
      switch (variant) {
        case "destructive":
          return "bg-card text-destructive border-border ring-foreground/10";
        case "success":
          return "bg-card text-foreground border-border ring-foreground/10";
        default:
          return "bg-card text-card-foreground border-border ring-foreground/10";
      }
    };

    const getIconColor = () => {
      switch (variant) {
        case "success":
          // Use vibrant green for success (matching the design system's green accent)
          return "text-[#22c55e] dark:text-[#4ade80]";
        case "destructive":
          return "text-destructive";
        default:
          return "text-muted-foreground";
      }
    };

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-none border ring-1 p-4 pr-8 text-xs/relaxed shadow-sm bg-card transition-all animate-in slide-in-from-bottom-2 fade-in-0",
          getVariantStyles(),
          className,
        )}
        {...props}
      >
        {variant && (
          <div className={cn("shrink-0 mt-0.5", getIconColor())}>
            <HugeiconsIcon
              icon={getIcon()}
              size={18}
              strokeWidth={1.5}
              className="text-current"
              aria-hidden="true"
            />
          </div>
        )}
        <div className="grid gap-1 flex-1 min-w-0">
          {title && (
            <div className="text-sm font-semibold leading-relaxed text-foreground">
              {title}
            </div>
          )}
          {description && (
            <div className="text-xs text-muted-foreground leading-relaxed">
              {description}
            </div>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 rounded-none p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring group-hover:opacity-100"
          aria-label="Close toast"
        >
          <HugeiconsIcon
            icon={Cancel01Icon}
            size={14}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </button>
      </div>
    );
  },
);
Toast.displayName = "Toast";

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-8 shrink-0 items-center justify-center rounded-none border bg-transparent px-3 text-xs font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
ToastAction.displayName = "ToastAction";

const ToastTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-sm font-semibold [&+div]:text-xs", className)}
      {...props}
    />
  );
});
ToastTitle.displayName = "ToastTitle";

const ToastDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("text-xs text-muted-foreground opacity-90", className)}
      {...props}
    />
  );
});
ToastDescription.displayName = "ToastDescription";

export type ToastActionElement = React.ReactElement<typeof ToastAction>;

export { Toast, ToastAction, ToastTitle, ToastDescription };
