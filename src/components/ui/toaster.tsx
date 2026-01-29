"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { useToast } from "./use-toast";
import { Toast } from "./toast";

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const toasterContent = (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-50 flex max-h-screen w-full flex-col gap-2 p-4 md:max-w-[420px]"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} open={toast.open} />
      ))}
    </div>
  );

  // Render to document body using portal
  return createPortal(toasterContent, document.body);
}
