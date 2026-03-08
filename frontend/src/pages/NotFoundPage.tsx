import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <p className="text-6xl font-bold text-primary-600 mb-4">404</p>
      <h1 className="text-2xl font-semibold text-content mb-2">Page not found</h1>
      <p className="text-content-secondary mb-8">The page you are looking for does not exist.</p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
          bg-surface-raised border border-border text-sm font-medium
          text-content-secondary hover:text-content hover:bg-surface-overlay transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  )
}
