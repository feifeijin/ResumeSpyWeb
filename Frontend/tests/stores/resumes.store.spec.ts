import { createPinia, setActivePinia } from 'pinia'
import type { Resume } from '../../../src/models/resume.type'
import { useResumesStore } from '../../../src/stores/resumes'

const { fetchResumesMock } = vi.hoisted(() => ({
  fetchResumesMock: vi.fn(),
}))

vi.mock('@/api/resume-api', () => ({
  __esModule: true,
  default: class {
    fetchResumes = fetchResumesMock
  },
}))

const makeResume = (id: string, title = `Resume ${id}`): Resume => ({
  id,
  title,
  resumeDetailCount: 1,
  resumeImgPath: '',
  createTime: '2026-08-15T00:00:00Z',
  lastModifyTime: '2026-08-15T00:00:00Z',
  preview: false,
})

describe('resumes store', () => {
  beforeEach(() => {
    // Purpose: reset Pinia state and the API mock between cases.
    setActivePinia(createPinia())
    fetchResumesMock.mockReset()
  })

  it('loads the list from the API on every call', async () => {
    // Purpose: a cold visit still fetches — the store adds no caching.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume('a')])

    await store.loadResumes()
    expect(store.resumes.map((r) => r.id)).toEqual(['a'])

    fetchResumesMock.mockResolvedValue([makeResume('a'), makeResume('b')])
    await store.loadResumes()

    expect(fetchResumesMock).toHaveBeenCalledTimes(2)
    expect(store.resumes.map((r) => r.id)).toEqual(['a', 'b'])
  })

  it('shows a resume created elsewhere even when the fetch omits it', async () => {
    // Purpose: the reported bug — a resume saved on the create screen must be
    // visible on the next MySpy load without a manual browser refresh.
    const store = useResumesStore()
    store.noteCreated(makeResume('new', 'Just created'))

    fetchResumesMock.mockResolvedValue([makeResume('a')])
    await store.loadResumes()

    expect(store.resumes.map((r) => r.id)).toEqual(['new', 'a'])
    expect(store.resumes[0].title).toBe('Just created')
  })

  it('drops the local record once the server returns the resume, without duplicating it', async () => {
    // Purpose: the local record must not outlive the server's own view of it.
    const store = useResumesStore()
    store.noteCreated(makeResume('new', 'Local title'))

    fetchResumesMock.mockResolvedValue([makeResume('new', 'Server title'), makeResume('a')])
    await store.loadResumes()

    expect(store.resumes.map((r) => r.id)).toEqual(['new', 'a'])
    expect(store.resumes[0].title).toBe('Server title')
    expect(store.pendingCreated).toEqual([])
  })

  it('ignores a repeated notification for the same resume', async () => {
    // Purpose: saving twice on the create screen must not add a second card.
    const store = useResumesStore()
    store.noteCreated(makeResume('new'))
    store.noteCreated(makeResume('new'))

    fetchResumesMock.mockResolvedValue([])
    await store.loadResumes()

    expect(store.resumes.map((r) => r.id)).toEqual(['new'])
  })

  it('removes a deleted resume from the list and from the local record', async () => {
    // Purpose: deleting behaves as before, and a deleted resume cannot come
    // back through the locally-created record.
    const store = useResumesStore()
    store.noteCreated(makeResume('new'))
    fetchResumesMock.mockResolvedValue([makeResume('a')])
    await store.loadResumes()

    store.removeResume('new')
    expect(store.resumes.map((r) => r.id)).toEqual(['a'])
    expect(store.pendingCreated).toEqual([])

    await store.loadResumes()
    expect(store.resumes.map((r) => r.id)).toEqual(['a'])
  })

  it('adds a cloned resume to the top of the list', async () => {
    // Purpose: cloning keeps its existing newest-first placement.
    const store = useResumesStore()
    fetchResumesMock.mockResolvedValue([makeResume('a')])
    await store.loadResumes()

    store.addResume(makeResume('clone'))

    expect(store.resumes.map((r) => r.id)).toEqual(['clone', 'a'])
  })
})
