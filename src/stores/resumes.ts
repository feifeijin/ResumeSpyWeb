import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resume } from '@/models/resume.type'
import ResumeService from '@/api/resume-api'

const resumeService = new ResumeService()

/**
 * Owns the resume list that MySpy renders.
 *
 * The list used to live inside MySpyView, which meant the only thing that could
 * ever refresh it was that view mounting. Resumes are created on a different
 * route (`/create`), so nothing in the app ever told the list it had changed —
 * MySpy was correct only as long as its `GET /resume` happened to come back
 * with the new row. Keeping the list here gives the create flow somewhere to
 * report to.
 */
export const useResumesStore = defineStore('resumes', () => {
  const resumes = ref<Resume[]>([])

  /**
   * Resumes this session created that `GET /resume` has not returned yet.
   *
   * We know these exist — the server handed us their ids — so MySpy can show
   * them even when the list response does not (a response served from the
   * browser cache, or a list that lags the write). Each entry is dropped as
   * soon as a fetch confirms it, so this never masks the server's view for
   * longer than it has to.
   */
  const pendingCreated = ref<Resume[]>([])

  /**
   * Always hits the API — the list is never served from a cache between visits.
   * Anything we created and the server has now acknowledged stops being pending.
   */
  const loadResumes = async (): Promise<Resume[]> => {
    const fetched = await resumeService.fetchResumes()
    const fetchedIds = new Set(fetched.map((resume) => resume.id))
    pendingCreated.value = pendingCreated.value.filter((resume) => !fetchedIds.has(resume.id))
    resumes.value = [...pendingCreated.value, ...fetched]
    return resumes.value
  }

  /** Record a resume created outside MySpy (i.e. on the create screen). */
  const noteCreated = (resume: Resume) => {
    if (!resume.id) return
    if (!pendingCreated.value.some((known) => known.id === resume.id)) {
      pendingCreated.value = [resume, ...pendingCreated.value]
    }
    if (!resumes.value.some((known) => known.id === resume.id)) {
      resumes.value.unshift(resume)
    }
  }

  /** Add a resume MySpy itself created (clone), newest first. */
  const addResume = (resume: Resume) => {
    resumes.value.unshift(resume)
  }

  const removeResume = (id: string) => {
    const index = resumes.value.findIndex((resume) => resume.id === id)
    if (index > -1) {
      resumes.value.splice(index, 1)
    }
    pendingCreated.value = pendingCreated.value.filter((resume) => resume.id !== id)
  }

  return {
    resumes,
    pendingCreated,
    loadResumes,
    noteCreated,
    addResume,
    removeResume,
  }
})
