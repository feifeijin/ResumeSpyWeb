import { ref } from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import KnowledgeBase from '../../../src/components/KnowledgeBase.vue'
import ResumeGuide from '../../../src/components/ResumeGuide.vue'
import AppFooter from '../../../src/components/app/AppFooter.vue'
import IconCommunity from '../../../src/components/icons/IconCommunity.vue'
import IconDocumentation from '../../../src/components/icons/IconDocumentation.vue'
import IconEcosystem from '../../../src/components/icons/IconEcosystem.vue'
import IconSupport from '../../../src/components/icons/IconSupport.vue'
import IconTooling from '../../../src/components/icons/IconTooling.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: ref('en'),
    t: (key: string) => {
      const map: Record<string, string> = {
        'home.readingRoom.title': '— Reading Room —',
        'home.readingRoom.subtitle': 'From the Archives',
        'home.readingRoom.description': 'Field notes on resume writing.',
        'articles.readMore': 'Read Archive',
        'articles.minRead': 'min',
        'home.process.title': '— Workflow —',
        'home.process.subtitle': 'How It Works',
        'home.process.step1Title': 'Write in Markdown',
        'home.process.step1Desc': 'Write in plain Markdown.',
        'home.process.step2Title': 'AI-Tailor for the Role',
        'home.process.step2Desc': 'Paste job description.',
        'home.process.step3Title': 'Export Your Dossier',
        'home.process.step3Desc': 'Download a polished PDF.',
        'home.process.cta': 'Start Building Your Dossier',
      }
      return map[key] ?? key
    },
  }),
}))

vi.mock('@/articles/articles', () => ({
  getArticlesByLocale: () => [
    {
      slug: 'test-article',
      title: 'Test Article',
      excerpt: 'A test excerpt.',
      tags: ['Test'],
      author: 'ResumeSpy Editorial',
      readTime: 5,
    },
  ],
}))

const tMock = (key: string) => {
  const map: Record<string, string> = {
    'home.readingRoom.title': '— Reading Room —',
    'home.readingRoom.subtitle': 'From the Archives',
    'home.readingRoom.description': 'Field notes on resume writing.',
    'articles.readMore': 'Read Archive',
    'articles.minRead': 'min',
    'home.process.title': '— Workflow —',
    'home.process.subtitle': 'How It Works',
    'home.process.step1Title': 'Write in Markdown',
    'home.process.step1Desc': 'Write in plain Markdown.',
    'home.process.step2Title': 'AI-Tailor for the Role',
    'home.process.step2Desc': 'Paste job description.',
    'home.process.step3Title': 'Export Your Dossier',
    'home.process.step3Desc': 'Download a polished PDF.',
    'home.process.cta': 'Start Building Your Dossier',
    'footer.resumeSpy': 'RESUMESPY',
    'footer.buyMeCoffee': '☕ Buy me a coffee',
    'footer.author': 'Made by Fei-Fei Jin',
  }
  return map[key] ?? key
}

describe('Static content components', () => {
  const factory = (component: object) =>
    shallowMount(component, {
      global: {
        mocks: {
          $t: tMock,
        },
        stubs: {
          ...commonVuetifyStubs,
          RouterLink: { template: '<a><slot /></a>' },
        },
      },
    })

  it('renders the reading room section title in KnowledgeBase', () => {
    // Purpose: ensure the section headline that anchors the page remains visible.
    const wrapper = factory(KnowledgeBase)
    expect(wrapper.text()).toContain('— Reading Room —')
  })

  it('renders article cards in KnowledgeBase', () => {
    // Purpose: verify article card list is populated from the articles data source.
    const wrapper = factory(KnowledgeBase)
    expect(wrapper.text()).toContain('Test Article')
  })

  it('renders the workflow section title in ResumeGuide', () => {
    // Purpose: ensure the how-it-works heading renders correctly.
    const wrapper = factory(ResumeGuide)
    expect(wrapper.text()).toContain('— Workflow —')
  })

  it('renders three steps in ResumeGuide', () => {
    // Purpose: protect the three-step workflow from accidental content loss.
    const wrapper = factory(ResumeGuide)
    expect(wrapper.text()).toContain('Write in Markdown')
    expect(wrapper.text()).toContain('AI-Tailor for the Role')
    expect(wrapper.text()).toContain('Export Your Dossier')
  })

  it('shows current year in AppFooter', () => {
    // Purpose: guard against stale footer year rendering.
    const wrapper = factory(AppFooter)
    expect(wrapper.text()).toContain(String(new Date().getFullYear()))
  })
})

describe('Icon components', () => {
  const icons = [IconCommunity, IconDocumentation, IconEcosystem, IconSupport, IconTooling]

  it.each(icons)('renders SVG markup for icon component', (iconComponent: object) => {
    // Purpose: ensure each icon component still renders valid SVG output.
    const wrapper = mount(iconComponent)
    expect(wrapper.find('svg').exists()).toBe(true)
    expect(wrapper.find('path').exists()).toBe(true)
  })
})
