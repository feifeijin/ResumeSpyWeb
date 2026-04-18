import { driver } from 'driver.js'
import type { DriverHook } from 'driver.js'
import 'driver.js/dist/driver.css'
import '@/assets/driver-noir.css'
import { useI18n } from 'vue-i18n'
import { useOnboardingStore } from '@/stores/onboarding'

// v-md-editor assigns CSS classes based on toolbar key names:
//   v-md-editor__toolbar-item-{key}
const TOOLBAR = {
  save: '.v-md-editor__toolbar-item-save',
  setDefault: '.v-md-editor__toolbar-item-set-default',
  addLanguage: '.v-md-editor__toolbar-item-add-language',
  sync: '.v-md-editor__toolbar-item-sync',
  exportPdf: '.v-md-editor__toolbar-item-export-pdf',
}

export function useOnboarding() {
  const { t } = useI18n()
  const store = useOnboardingStore()

  function buildDesc(text: string, step: number, total: number): string {
    return `<span class="tour-step-badge">— ${step} / ${total} —</span>${text}`
  }

  // ── Part 1: Write & Save ─────────────────────────────────────
  // Triggered on first visit to CreateView.
  // Guides the user to write content and hit Save.
  function startPart1Tour() {
    const d = driver({
      animate: true,
      allowClose: true,
      overlayOpacity: 0.55,
      popoverClass: 'noir-tour-popover',
      nextBtnText: t('onboarding.nav.next'),
      prevBtnText: t('onboarding.nav.back'),
      doneBtnText: t('onboarding.nav.skip'),

      onDestroyed: () => {
        // Mark Part 1 done whether the user finished or skipped,
        // so Part 2 can trigger after their first save.
        store.completePart1()
      },

      steps: [
        {
          element: '[data-onboarding="editor-wrap"]',
          popover: {
            title: t('onboarding.part1.step1.title'),
            description: buildDesc(t('onboarding.part1.step1.description'), 1, 2),
            side: 'top',
            align: 'center',
          },
        },
        {
          element: TOOLBAR.save,
          popover: {
            title: t('onboarding.part1.step2.title'),
            description: buildDesc(t('onboarding.part1.step2.description'), 2, 2),
            side: 'bottom',
            align: 'start',
            onNextClick: ((_el, _step, opts) => {
              opts.driver.destroy()
            }) as DriverHook,
          },
        },
      ],
    })

    d.drive()
  }

  // ── Part 2: Feature Discovery ────────────────────────────────
  // Triggered after the user saves their first resume.
  // Walks through default, add-language, sync, export-pdf.
  function startPart2Tour() {
    const d = driver({
      animate: true,
      allowClose: true,
      overlayOpacity: 0.55,
      popoverClass: 'noir-tour-popover',
      nextBtnText: t('onboarding.nav.next'),
      prevBtnText: t('onboarding.nav.back'),
      doneBtnText: t('onboarding.nav.done'),

      onDestroyed: () => {
        store.completePart2()
      },

      steps: [
        {
          element: TOOLBAR.setDefault,
          popover: {
            title: t('onboarding.part2.step1.title'),
            description: buildDesc(t('onboarding.part2.step1.description'), 1, 4),
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: TOOLBAR.addLanguage,
          popover: {
            title: t('onboarding.part2.step2.title'),
            description: buildDesc(t('onboarding.part2.step2.description'), 2, 4),
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: TOOLBAR.sync,
          popover: {
            title: t('onboarding.part2.step3.title'),
            description: buildDesc(t('onboarding.part2.step3.description'), 3, 4),
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: TOOLBAR.exportPdf,
          popover: {
            title: t('onboarding.part2.step4.title'),
            description: buildDesc(t('onboarding.part2.step4.description'), 4, 4),
            side: 'bottom',
            align: 'end',
            onNextClick: ((_el, _step, opts) => {
              opts.driver.destroy()
            }) as DriverHook,
          },
        },
      ],
    })

    d.drive()
  }

  return { startPart1Tour, startPart2Tour }
}
