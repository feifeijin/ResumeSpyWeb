import { createPinia, setActivePinia } from 'pinia'
import { useResumesStore } from '../../../src/stores/resumes'
import type { Resume } from '../../../src/models/resume.type'

const { fetchResumesMock } = vi.hoisted(() => ({
  fetchResumesMock: vi.fn(),
}))

vi.mock('@/api/resume-api', () => ({
  __esModule: true,
  default: class {
    fetchResumes = fetchResumesMock
  },
}))

const makeResume = (overrides: Partial<Resume> = {}): Resume => ({
  id: 'resume-1',
  title: 'Case File',
  resumeDetailCount: 1,
  resumeImgPath: '',
  createTime: '2026-01-01T00:00:00Z',
  lastModifyTime: '2026-01-01T00:00:00Z',
  preview: false,
  ...overrides,
})

describe('resumes store', () => {
  beforeEach(() => {
    // Purpose: ensure mocked dependencies and Pinia state are reset each run.
    setActivePinia(createPinia())
    fetchResumesMock.mockReset()
  })

  it('loads the list from the API on a cold visit', async () => {
    // Purpose: MySpy's first visit must still be filled straight from the server.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume({ id: 'a' }), makeResume({ id: 'b' })])

    await store.load()

    expect(fetchResumesMock).toHaveBeenCalledTimes(1)
    expect(store.resumes.map((resume) => resume.id)).toEqual(['a', 'b'])
  })

  it('keeps a just-created resume that the list response has not caught up with', async () => {
    // Purpose: the reported bug — creating a resume and returning to MySpy must
    // show it even when the list response does not include it yet.
    const store = useResumesStore()
    store.addCreated(makeResume({ id: 'new-1', title: 'Fresh Dossier' }))

    fetchResumesMock.mockResolvedValue([makeResume({ id: 'a' })])
    await store.load()

    expect(store.resumes.map((resume) => resume.id)).toEqual(['new-1', 'a'])
  })

  it('hands a created resume back to the server data once the list returns it', async () => {
    // Purpose: the placeholder must not linger or duplicate the server's entry.
    const store = useResumesStore()
    store.addCreated(makeResume({ id: 'new-1', title: 'Untitled' }))

    fetchResumesMock.mockResolvedValue([makeResume({ id: 'new-1', title: 'Server Title' })])
    await store.load()

    expect(store.resumes).toHaveLength(1)
    expect(store.resumes[0].title).toBe('Server Title')

    // A later list response no longer needs shielding for it.
    fetchResumesMock.mockResolvedValue([])
    await store.load()

    expect(store.resumes).toEqual([])
  })

  it('merges into an existing entry instead of duplicating it', async () => {
    // Purpose: saving twice, or cloning an id already listed, must not add a row.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume({ id: 'a', title: 'Old' })])
    await store.load()

    store.addCreated(makeResume({ id: 'a', title: 'New' }))

    expect(store.resumes).toHaveLength(1)
    expect(store.resumes[0].title).toBe('New')
  })

  it('ignores a created resume without an id', () => {
    // Purpose: a failed create must not push an unusable row into the list.
    const store = useResumesStore()

    store.addCreated(makeResume({ id: '' }))

    expect(store.resumes).toEqual([])
  })

  it('removes a resume and reports the index it occupied', async () => {
    // Purpose: delete keeps the view's parallel menu array in step.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume({ id: 'a' }), makeResume({ id: 'b' })])
    await store.load()

    expect(store.remove('b')).toBe(1)
    expect(store.resumes.map((resume) => resume.id)).toEqual(['a'])
    expect(store.remove('missing')).toBe(-1)
  })

  it('does not resurrect a created resume that was deleted before the server confirmed it', async () => {
    // Purpose: deleting must win over the "not confirmed yet" shielding.
    const store = useResumesStore()
    store.addCreated(makeResume({ id: 'new-1' }))
    store.remove('new-1')

    fetchResumesMock.mockResolvedValue([])
    await store.load()

    expect(store.resumes).toEqual([])
  })

  it('drops everything on reset', async () => {
    // Purpose: signing out must not leave one account's list for the next one.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume({ id: 'a' })])
    await store.load()
    store.addCreated(makeResume({ id: 'new-1' }))

    store.reset()
    expect(store.resumes).toEqual([])

    fetchResumesMock.mockResolvedValue([])
    await store.load()
    expect(store.resumes).toEqual([])
  })
})
