import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export function BrandLogo() {
  return (
    <Link
      to="/dashboard"
      className="flex items-center gap-2 text-content font-semibold text-lg hover:opacity-80 transition-opacity"
      aria-label="ClearPath home"
    >
      <ShieldCheck className="w-6 h-6 text-primary-500" aria-hidden="true" />
      <span>ClearPath</span>
    </Link>
  )
}
