import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Resume } from '@/models/resume.type'
import ResumeService from '@/api/resume-api'

const resumeService = new ResumeService()

/**
 * Shared source of truth for the resume list shown on MySpy.
 *
 * The list used to live in MySpyView's local state, so a resume created on the
 * create screen (or imported) was invisible to it: MySpy could only ever show
 * what the next `GET /resume` happened to return. Whenever that response did
 * not include the fresh resume yet, it stayed missing until a full page reload.
 * Keeping the list here lets the creation flows publish the new resume, and
 * lets `load()` reconcile it with the server instead of blindly replacing it.
 */
export const useResumesStore = defineStore('resumes', () => {
  const resumes = ref<Resume[]>([])

  /**
   * Resumes created in this session that no list response has returned yet.
   * They are kept across a `load()` so a list response that has not caught up
   * cannot drop a resume the user just created.
   */
  const unconfirmedIds = ref<Set<string>>(new Set())

  /** Fetch the list and merge it with any resume the server has not returned yet. */
  const load = async () => {
    const fetched = await resumeService.fetchResumes()
    const fetchedIds = new Set(fetched.map((resume) => resume.id))

    // Anything the server now returns is confirmed — stop shielding it.
    Array.from(unconfirmedIds.value).forEach((id) => {
      if (fetchedIds.has(id)) unconfirmedIds.value.delete(id)
    })

    const stillUnconfirmed = resumes.value.filter(
      (resume) => unconfirmedIds.value.has(resume.id) && !fetchedIds.has(resume.id),
    )

    resumes.value = [...stillUnconfirmed, ...fetched]
  }

  /**
   * Record a resume created outside of the list view (create screen, import,
   * clone) so it shows up as soon as the user is back on MySpy.
   */
  const addCreated = (resume: Resume) => {
    if (!resume.id) return

    const index = resumes.value.findIndex((existing) => existing.id === resume.id)
    if (index > -1) {
      resumes.value[index] = { ...resumes.value[index], ...resume }
    } else {
      resumes.value.unshift(resume)
    }
    unconfirmedIds.value.add(resume.id)
  }

  /** Remove a deleted resume. Returns the index it occupied, or -1. */
  const remove = (id: string) => {
    unconfirmedIds.value.delete(id)
    const index = resumes.value.findIndex((resume) => resume.id === id)
    if (index > -1) resumes.value.splice(index, 1)
    return index
  }

  /** Drop everything — called on sign-out so no list survives into another account. */
  const reset = () => {
    resumes.value = []
    unconfirmedIds.value.clear()
  }

  return {
    resumes,
    load,
    addCreated,
    remove,
    reset,
  }
})
