/* eslint-disable no-console */
// eslint-disable-next-line local-rules/disallow-side-effects
import { runOnReadyState } from '@datadog/browser-core/src'
import { RumSession } from '../rumSession'
import type { BrowserTest, BrowserWindow, TestResults } from './s8s'
import { buildResults } from './results'
import { evaluateTest } from './evaluation'

const INTAKE_API_PATH = '/api/v1/synthetics/private-locations/tests'
const ASSERTIONS_API_PATH = '/api/v1/synthetics/browser/tests/'
const S8S_TEST_ID = '4a6-tcb-2n2'

const GET_ASSERTIONS_URL = (_str: TemplateStringsArray, apiKey: string, appKey: string) =>
  `${corsProxy}` + `${assertionsHost}${ASSERTIONS_API_PATH}${S8S_TEST_ID}?api_key=${apiKey}&application_key=${appKey}`
const GET_INTAKE_URL = (_str: TemplateStringsArray, publicId: string) =>
  `${corsProxy}` + `${intakeHost}${INTAKE_API_PATH}/${publicId}/results`

let applicationKey: string
let apiKey: string
let corsProxy: string
let headerName: string
let headerValue: string
let assertionsHost: string
let intakeHost: string
let applicationId: string
let testConfig: BrowserTest
let session: RumSession
let execution: TestResults[]

const browserWindow = (window as unknown) as BrowserWindow

export function bootNaturalSynthetics(appId: string, rumSession: RumSession): void {
  session = rumSession
  applicationId = appId
  applicationKey = browserWindow.NATURALS8S_APPKEY!
  apiKey = browserWindow.NATURALS8S_APIKEY!
  corsProxy = browserWindow.NATURALS8S_PROXY!
  headerName = browserWindow.NATURALS8S_HEADERNAME!
  headerValue = browserWindow.NATURALS8S_HEADERVALUE!
  assertionsHost = browserWindow.NATURALS8S_HOST!
  intakeHost = browserWindow.NATURALS8S_INTAKE!

  if (!applicationKey || !apiKey || !corsProxy || !headerName || !headerValue || !assertionsHost || !intakeHost) {
    return
  }

  runOnReadyState('complete', () => {
    browserWindow.requestIdleCallback(fetchSyntheticsAssertions)
  })
}

function fetchSyntheticsAssertions(): void {
  fetch(GET_ASSERTIONS_URL`${apiKey}${applicationKey}`)
    .then((response) => response.json())
    .then((jsonBody: BrowserTest) => {
      testConfig = jsonBody
      execution = evaluateTest(testConfig)
      browserWindow.requestIdleCallback(reportResults)
    })
    .catch(testFetchFailure)
}

function testFetchFailure(failure: any): void {
  console.error('[RUM-S8S] Failed to fetch Synthetic assertions', failure)
}

function reportResults(): void {
  if (!execution || !execution.length) {
    return
  }
  const results = buildResults(session, applicationId, testConfig, execution)
  // eslint-disable-next-line no-console
  console.log(results)
  fetch(GET_INTAKE_URL`${testConfig.public_id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [headerName]: headerValue,
      'x-dd-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, ''),
    },
    body: JSON.stringify(results),
  })
    .then((response) => response.text())
    .then((_response) => {
      console.info('[RUM-S8S] Success sending results')
    })
    .catch((failure) => {
      console.error('[RUM-S8S] Failed sending results', failure)
    })
}
