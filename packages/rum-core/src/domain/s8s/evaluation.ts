import type { BrowserTest, TestResults, StepResultsData, AssertionStepResult } from './s8s'
import { assertPageContains } from './assertions/assertPageContains'

function checkPageURL(url: string): boolean {
  return `${location.origin}${location.pathname}` === url
}

export function evaluateTest(test: BrowserTest): TestResults[] {
  const testResults: TestResults[] = []
  // ensure we are at target page
  if (!checkPageURL(test.startUrl)) {
    return testResults
  }
  // run assertion steps
  test.steps.forEach((step, index) => {
    const stepTimeOrigin = performance.now()
    let stepResult: AssertionStepResult = { success: false, error: null, value: '' }
    switch (step.type) {
      case 'assertPageContains':
        stepResult = assertPageContains(step)
        break

      default:
        break
    }
    const data: StepResultsData = {
      allowFailure: step.allowFailure!,
      description: step.name,
      duration: Math.ceil(performance.now() - stepTimeOrigin),
      skipped: false,
      stepId: index - 1,
      type: step.type,
      url: test.startUrl,
      value: stepResult.value,
      warnings: [],
      browserErrors: stepResult.error ? [stepResult.error] : [],
      vitalsMetrics: [],
    }
    testResults.push({ data, success: stepResult.success })
  })

  return testResults
}
