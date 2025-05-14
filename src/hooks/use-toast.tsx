
import * as React from "react"
import { cn } from "@/lib/utils"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast as useToastImpl } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToastImpl()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

export function useToast() {
  return useToastImpl();
}

// Re-export toast as a function for easier use
export const toast = (props: any) => {
  const { toast: toastFn } = useToastImpl();
  toastFn(props);
};
