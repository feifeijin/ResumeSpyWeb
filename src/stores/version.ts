import { defineStore } from 'pinia'
import { ref } from 'vue'
import ResumeVersionService, { type ResumeVersion } from '@/api/resume-version-api'

const api = new ResumeVersionService()

export const useVersionStore = defineStore('version', () => {
  // versions keyed by resumeDetailId
  const versionsByDetail = ref<Record<string, ResumeVersion[]>>({})
  const loading = ref(false)

  async function fetchVersions(resumeDetailId: string): Promise<void> {
    loading.value = true
    try {
      versionsByDetail.value[resumeDetailId] = await api.fetchVersions(resumeDetailId)
    } finally {
      loading.value = false
    }
  }

  async function saveVersion(resumeDetailId: string, content: string, label?: string): Promise<ResumeVersion> {
    const version = await api.saveVersion(resumeDetailId, content, label)
    // Prepend so newest-first order is reflected immediately
    const existing = versionsByDetail.value[resumeDetailId] ?? []
    versionsByDetail.value[resumeDetailId] = [version, ...existing].slice(0, 50)
    return version
  }

  async function deleteVersion(resumeDetailId: string, versionId: string): Promise<void> {
    await api.deleteVersion(versionId)
    const existing = versionsByDetail.value[resumeDetailId] ?? []
    versionsByDetail.value[resumeDetailId] = existing.filter((v) => v.id !== versionId)
  }

  async function getVersionContent(versionId: string): Promise<string> {
    return api.getVersionContent(versionId)
  }

  function clearDetail(resumeDetailId: string): void {
    delete versionsByDetail.value[resumeDetailId]
  }

  return {
    versionsByDetail,
    loading,
    fetchVersions,
    saveVersion,
    deleteVersion,
    getVersionContent,
    clearDetail,
  }
})
