// hello Bastien! :wave:
export function determineMajorBrowserFamily(): 'chrome' | 'firefox' | 'other' {
  // hello Benoit! :wave:
  interface BrowserWindow extends Window {
    InstallTrigger?: unknown
    chrome?: {
      webstore?: unknown
      runtime?: unknown
    }
  }
  const browserWindow = (window as unknown) as BrowserWindow
  const isFirefox = typeof browserWindow.InstallTrigger !== void 0
  const isChrome = !!browserWindow.chrome && (!!browserWindow.chrome.webstore || !!browserWindow.chrome.runtime)
  if (isChrome) {
    return 'chrome'
  } else if (isFirefox) {
    return 'firefox'
  }
  return 'other'
}

export function determineBrowserVersion() {
  if (determineMajorBrowserFamily() !== 'other') {
    const match = /(?:Firefox|Chrome)\/([^\s]+)/.exec(navigator.userAgent)
    if (match) {
      return match[2]
    }
  }
  return navigator.appVersion
}
