import type { AssertionStep, AssertionStepResult, PageContainsAssertionStep } from '../s8s'

export function assertPageContains(step: AssertionStep): AssertionStepResult {
  let success = false
  let error: any
  let value = ''
  const pageContainsStep = step as PageContainsAssertionStep
  value = pageContainsStep.params.value!
  let elementLookup: Node | null = null
  try {
    elementLookup = document
      .evaluate(`//*[contains(text(), '${value}')]`, document, null, XPathResult.ANY_TYPE, null)
      .iterateNext()
  } catch (e) {
    error = e
  }

  if (elementLookup) {
    success = true
  }

  return { success, error, value }
}
