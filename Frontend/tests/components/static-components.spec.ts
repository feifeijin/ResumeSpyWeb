import { mount, shallowMount } from '@vue/test-utils'
import KnowledgeBase from '../../../src/components/KnowledgeBase.vue'
import ResumeGuide from '../../../src/components/ResumeGuide.vue'
import ResumeTemplates from '../../../src/components/ResumeTemplates.vue'
import WhatWeOffer from '../../../src/components/WhatWeOffer.vue'
import AppFooter from '../../../src/components/app/AppFooter.vue'
import IconCommunity from '../../../src/components/icons/IconCommunity.vue'
import IconDocumentation from '../../../src/components/icons/IconDocumentation.vue'
import IconEcosystem from '../../../src/components/icons/IconEcosystem.vue'
import IconSupport from '../../../src/components/icons/IconSupport.vue'
import IconTooling from '../../../src/components/icons/IconTooling.vue'
import { commonVuetifyStubs } from '../helpers/vuetify-stubs'

describe('Static content components', () => {
  const factory = (component: object) =>
    shallowMount(component, {
      global: {
        stubs: {
          ...commonVuetifyStubs,
        },
      },
    })

  it('renders the article section title in KnowledgeBase', () => {
    // Purpose: ensure the section headline that anchors the page remains visible.
    const wrapper = factory(KnowledgeBase)
    expect(wrapper.text()).toContain('Articles')
  })

  it('renders all guide bullet points in ResumeGuide', () => {
    // Purpose: verify guide content count so accidental content loss is detected.
    const wrapper = factory(ResumeGuide)
    expect(wrapper.text()).toContain('This section is to guide users to create Resumes.')
    expect(wrapper.text()).toContain('Quias netus magni netsum eos qui ratione sequi')
  })

  it('renders three template cards in ResumeTemplates', () => {
    // Purpose: protect the expected number of template cards from regressions.
    const wrapper = factory(ResumeTemplates)
    expect(wrapper.text()).toContain('Resume Templates')
    expect(wrapper.findAll('img').length).toBeGreaterThanOrEqual(3)
  })

  it('renders all feature cards in WhatWeOffer', () => {
    // Purpose: verify user-facing feature list is present and readable.
    const wrapper = factory(WhatWeOffer)
    expect(wrapper.text()).toContain('What We Do')
    expect(wrapper.text()).toContain('Automatic Create Resumes')
    expect(wrapper.text()).toContain('Life-Long Version Control')
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
