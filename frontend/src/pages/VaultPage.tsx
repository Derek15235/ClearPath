import { FolderLock } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { EmptyState } from '../components/ui/EmptyState'

export default function VaultPage() {
  return (
    <>
      <PageHeader
        title="Document Vault"
        description="Your compliance documents — coming in Phase 9."
      />
      <EmptyState
        icon={FolderLock}
        heading="Document Vault coming soon"
        description="Upload and organize your compliance documents, track expirations, and search your document library."
      />
    </>
  )
}
