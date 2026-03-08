import { Calendar } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'

export default function CalendarPage() {
  return (
    <>
      <PageHeader
        title="Calendar"
        description="Your compliance deadlines and task schedule — coming in Phase 7."
      />
      <EmptyState
        icon={Calendar}
        heading="Calendar coming soon"
        description="Auto-populated compliance deadlines and manual task management will appear here."
      />
    </>
  )
}
