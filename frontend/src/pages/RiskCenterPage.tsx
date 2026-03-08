import { ShieldAlert } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'

export default function RiskCenterPage() {
  return (
    <>
      <PageHeader
        title="Risk Center"
        description="Your personalized compliance risk analysis — coming in Phase 6."
      />
      <EmptyState
        icon={ShieldAlert}
        heading="Risk Center coming soon"
        description="Your compliance score, risk breakdown by category, and actionable next steps will appear here."
      />
    </>
  )
}
