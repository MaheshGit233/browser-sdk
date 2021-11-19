/* eslint-disable camelcase */
declare type ApiTestSubtypeSingle = 'http' | 'ssl' | 'dns' | 'tcp' | 'udp' | 'icmp' | 'websocket'
declare type ApiTestSubtype = ApiTestSubtypeSingle | 'multi'

interface BaseTest {
  locations: string[]
  id: string
  // message: string
  // monitor_id: number
  name: string
  public_id: string
  // status: string
  // subtype: ApiTestSubtype
  // tags: string[]
  // type: TestType
}

export interface BrowserTest extends BaseTest {
  // config: {
  //   assertions: Assertion[]
  //   request: {
  //     url: string
  //     headers: Record<string, string>
  //   }
  // }
  // variables: DogwebTestVariable[]
  device_ids: string[]
  steps: AssertionStep[]
  startUrl: string
}

interface BaseStep {
  allowFailure?: boolean
  id: number
  isCritical?: boolean
  name: string
  noScreenshot?: boolean
  public_id?: string
  timeout?: number
}

declare const ASSERTION_STEP_TYPES: readonly [
  //   'assertCurrentUrl',
  //   'assertCheckboxState',
  //   'assertElementAttribute',
  //   'assertElementContent',
  //   'assertElementPresent',
  //   'assertEmail',
  //   'assertFileDownload',
  //   'assertFromJavascript',
  'assertPageContains'
  //   'assertPageLacks'
]
declare type AssertionStepType = typeof ASSERTION_STEP_TYPES[number]

interface AssertionStep extends BaseStep {
  type: AssertionStepType
}

interface AssertionStepResult {
  success: boolean
  error: any
  value: string
}

interface AssertionStepParams {
  attribute?: string
  check?: string
  value?: string
  // element?: CompleteStepElement
}

// type CompleteStepElement = {
//   multiLocator?: MultiLocator
//   targetOuterHTML: string
//   url: string
//   // userLocator?: UserLocator
//   version?: number
// }

// export type MultiLocator = {
//   ab?: string
//   at?: string
//   cl?: string
//   clt?: string
//   co?: string
//   ro?: string
// }

export interface PageContainsAssertionStep extends AssertionStep {
  params: AssertionStepParams
}

export interface ExecutionContext {
  resultID: string
  runType: number
  runnedAt: number
  status: 0 | 1 | 2
  testID: string
  testResult: BrowserResults
  testVersion: 1
}

export interface BrowserResults {
  browserType?: string
  browserVersion: string
  checkID?: string
  checkTimestamp?: number
  checkType?: 'browser'
  checkVersion?: number
  stepDetails?: StepResultsData[]
  device: {
    browser: 'chrome' | 'firefox' | 'other'
    height: number
    width: number
    id: string
    isMobile: false
    name: string
    userAgent: string
  }
  duration: number
  eventType: 'finished'
  orgID: number
  passed: boolean
  processedTimestamp: number
  publicID?: string
  resultID: string
  rumContext?: {
    applicationId: string
    sessionId: string
  }
  runType: number
  startUrl: string
  subtype: null
  timeToInteractive?: number
}

export interface StepResultsData {
  allowFailure: boolean
  description: string
  duration: number
  skipped: boolean
  stepId: number
  type: string
  url: string
  value: string
  warnings: any[]
  browserErrors: any[]
  vitalsMetrics: any[]
}

export interface TestResults {
  data: StepResultsData
  success: boolean
}

interface BrowserWindow extends Window {
  requestIdleCallback: (callback: (deadline: any) => void, opts?: { timeout?: number }) => number
  NATURALS8S_APPKEY?: string
  NATURALS8S_APIKEY?: string
  NATURALS8S_PROXY?: string
  NATURALS8S_HEADERNAME?: string
  NATURALS8S_HEADERVALUE?: string
  NATURALS8S_HOST?: string
  NATURALS8S_INTAKE?: string
}
