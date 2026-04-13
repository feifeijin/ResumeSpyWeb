import { computed } from 'vue'
import { useVersionStore } from '@/stores/version'
import { useToast } from '@/composables/useToast'
import type { ResumeVersion } from '@/api/resume-version-api'

export function useVersion(resumeDetailId: () => string) {
  const store = useVersionStore()
  const toast = useToast()

  const versions = computed<ResumeVersion[]>(
    () => store.versionsByDetail[resumeDetailId()] ?? [],
  )

  async function loadVersions(): Promise<void> {
    const id = resumeDetailId()
    if (!id) return
    try {
      await store.fetchVersions(id)
    } catch {
      toast.error('toast.error.operationFailed')
    }
  }

  async function snapshot(content: string, label?: string): Promise<void> {
    const id = resumeDetailId()
    if (!id || !content.trim()) return
    try {
      await store.saveVersion(id, content, label)
    } catch {
      // silent — snapshotting is background; user will see error on next load if needed
    }
  }

  async function restoreVersion(versionId: string): Promise<string> {
    return store.getVersionContent(versionId)
  }

  async function removeVersion(versionId: string): Promise<void> {
    const id = resumeDetailId()
    try {
      await store.deleteVersion(id, versionId)
      toast.success('version.deleteSuccess')
    } catch {
      toast.error('toast.error.operationFailed')
    }
  }

  return { versions, loadVersions, snapshot, restoreVersion, removeVersion }
}
