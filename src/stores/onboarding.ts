import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const PART1_KEY = 'resumeSpy.onboarding.part1' // write & save tutorial
const PART2_KEY = 'resumeSpy.onboarding.part2' // feature discovery tour

export const useOnboardingStore = defineStore('onboarding', () => {
  const part1Done = ref(localStorage.getItem(PART1_KEY) === 'true')
  const part2Done = ref(localStorage.getItem(PART2_KEY) === 'true')

  // Part 1 shows on first visit to CreateView
  const shouldShowPart1 = computed(() => !part1Done.value)

  // Part 2 shows after the user saves their first resume
  const shouldShowPart2 = computed(() => part1Done.value && !part2Done.value)

  function completePart1() {
    part1Done.value = true
    try { localStorage.setItem(PART1_KEY, 'true') } catch {}
  }

  function completePart2() {
    part2Done.value = true
    try { localStorage.setItem(PART2_KEY, 'true') } catch {}
  }

  // Restart only Part 2 (the feature tour) — used by the Help button
  function restartPart2() {
    part2Done.value = false
    try { localStorage.removeItem(PART2_KEY) } catch {}
  }

  // Reset everything — for dev/testing
  function resetAll() {
    part1Done.value = false
    part2Done.value = false
    try {
      localStorage.removeItem(PART1_KEY)
      localStorage.removeItem(PART2_KEY)
    } catch {}
  }

  return {
    part1Done,
    part2Done,
    shouldShowPart1,
    shouldShowPart2,
    completePart1,
    completePart2,
    restartPart2,
    resetAll,
  }
})
