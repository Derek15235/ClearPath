import { LayoutDashboard } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Your compliance overview — coming in Phase 8."
      />
      <EmptyState
        icon={LayoutDashboard}
        heading="Dashboard coming soon"
        description="Your compliance score, upcoming deadlines, and risk overview will appear here once the compliance pipeline is live."
      />
    </>
  )
}
