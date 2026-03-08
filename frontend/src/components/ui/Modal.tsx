import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { ReactNode } from 'react'

interface ModalProps {
  open:        boolean
  onClose:     () => void
  title:       string
  description?: string
  children:    ReactNode
  className?:  string
}

export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm
          data-[state=open]:animate-in data-[state=closed]:animate-out
          data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2',
            'w-full max-w-lg rounded-xl bg-surface-raised border border-border shadow-card-lg p-6',
            'focus:outline-none',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
            className,
          )}
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <Dialog.Title className="text-lg font-semibold text-content">
                {title}
              </Dialog.Title>
              {description && (
                <Dialog.Description className="mt-1 text-sm text-content-secondary">
                  {description}
                </Dialog.Description>
              )}
            </div>
            <Dialog.Close asChild>
              <button
                aria-label="Close modal"
                className="p-1.5 rounded-lg text-content-muted hover:text-content
                  hover:bg-surface-overlay transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </Dialog.Close>
          </div>

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
