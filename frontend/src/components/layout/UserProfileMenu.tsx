import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { User, Settings, LogOut } from 'lucide-react'

export function UserProfileMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          aria-label="User profile menu"
          className="flex items-center justify-center w-8 h-8 rounded-full
            bg-primary-600/20 text-primary-400 hover:bg-primary-600/30 transition-colors"
        >
          <User className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={8}
          className="z-50 min-w-[160px] rounded-xl bg-surface-raised border border-border
            shadow-card-lg p-1 text-sm"
        >
          <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 rounded-lg
            text-content-secondary hover:text-content hover:bg-surface-overlay
            cursor-pointer outline-none transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="my-1 h-px bg-border" />
          <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 rounded-lg
            text-error hover:bg-error/10 cursor-pointer outline-none transition-colors">
            <LogOut className="w-4 h-4" />
            Sign out
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}
