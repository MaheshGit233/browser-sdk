import { RumSession } from '../rumSession'
import { BrowserResults, BrowserTest, BrowserWindow, ExecutionContext, TestResults } from './s8s'
import { determineBrowserVersion, determineMajorBrowserFamily } from './utils'

function generateRandom(choices: string, length: number) {
  return [...Array(length)].map(() => choices.charAt(Math.floor(Math.random() * choices.length))).join('')
}

export function buildResults(
  session: RumSession,
  applicationId: string,
  test: BrowserTest,
  execution: TestResults[]
): ExecutionContext {
  const browserWindow = (window as unknown) as BrowserWindow
  const resultID = generateRandom('0123456789', 19)
  const date = Math.ceil(performance.timeOrigin + performance.now())
  const results: BrowserResults = {
    browserType: determineMajorBrowserFamily(),
    browserVersion: determineBrowserVersion(),
    checkID: `1253610`,
    checkTimestamp: date,
    checkType: 'browser',
    checkVersion: 1,
    stepDetails: execution.map((exec) => exec.data),
    device: {
      browser: determineMajorBrowserFamily(),
      height: browserWindow.innerHeight,
      width: browserWindow.innerWidth,
      isMobile: false,
      name: 'Real user',
      userAgent: navigator.userAgent,
      id: test.device_ids[0],
    },
    duration: Math.ceil(performance.now()),
    eventType: 'finished',
    orgID: 2,
    passed: execution.every((exec) => exec.success),
    processedTimestamp: 0,
    publicID: test.public_id,
    resultID,
    rumContext: {
      applicationId,
      sessionId: session.getId()!,
    },
    runType: 3,
    startUrl: test.startUrl,
    subtype: null,
    timeToInteractive: 0,
  }

  return {
    resultID,
    runType: 3,
    runnedAt: date,
    status: results.passed ? 0 : 1,
    testID: test.public_id,
    testResult: results,
    testVersion: 1,
  }
}
