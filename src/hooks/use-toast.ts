
import * as React from "react"
import { useState } from "react"
import { createContext, useContext } from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

type ToastVariant = 'default' | 'destructive' | 'success';

type ToastOptions = Partial<ToastProps> & {
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: ToastVariant
}

type ToasterToast = ToastOptions & {
  id: string
  title?: string
  description?: string
  action?: ToastActionElement
}

const ToastContext = createContext<{
  toasts: ToasterToast[]
  addToast: (toast: ToastOptions) => void
  updateToast: (id: string, toast: ToastOptions) => void
  dismissToast: (id: string) => void
  removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  function addToast(options: ToastOptions) {
    const id = crypto.randomUUID()
    const toast: ToasterToast = { ...options, id }
    setToasts((prev) => [toast, ...prev])
  }

  function updateToast(id: string, toast: ToastOptions) {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, open: false } : t))
  }

  function removeToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }

  return {
    ...context,
    toast: (options: ToastOptions) => {
      context.addToast(options)
    },
  }
}

export type { ToastOptions }
