// @flow
import allureReporter from '@wdio/allure-reporter'

let baseUrl = process.env.URL
let browserName = process.env.TEST_BROWSER_NAME
export default {
  // eslint-disable-next-line require-await
  async goToHome () {
    return browser.url(baseUrl)
  },

  async close () {
    await browser.reloadSession()
  },

  async addAllureReport (allureReporter, dirName: string, feature: string, testTitle: string) {
    await allureReporter.addFeature(feature)
    await allureReporter.addStory(testTitle)
    await allureReporter.addEnvironment('Browser', browserName)
    await allureReporter.addEnvironment('Base URL', baseUrl)
  },

  async saveScreenshots (state: string, screencapture: boolean) {
    let url, title
    try {
      title = await browser.getTitle()
      url = await browser.getUrl()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
      if (!title) {
        title = 'Unable to get title'
      }
      if (!url) {
        url = 'Unable to get url of the current page'
      }
    }
    allureReporter.addArgument('Page URL', url)
    allureReporter.addArgument('Page Title', title)
    if (state !== 'passed' || screencapture) {
      await this.takeFullPageScreenshots(state)
    }
  },

  async takeFullPageScreenshots (state: string) {
    if (typeof state !== 'string') {
      state = ''
    }
    const currentScrollHeight = Number(await browser.execute('window.scrollY'))
    // fallback for unexpected values
    const initialScrollHeightPosition = Number.isFinite(currentScrollHeight) ? currentScrollHeight : 0
    try {
      const documentHeightScript = `return Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      )`
      const documentHeight = await browser.execute(documentHeightScript)
      const clientHeight = await browser.execute('return document.documentElement.clientHeight')
      let totalScreenshots = Math.ceil(documentHeight / clientHeight)
      const screenshotsLimit = 8
      totalScreenshots = (totalScreenshots < screenshotsLimit) ? totalScreenshots : screenshotsLimit
      for (let i = 0; i < totalScreenshots; i++) {
        await browser.execute(`window.scrollTo(0, document.documentElement.clientHeight * ${i})`)
        const screenshot = await browser.takeScreenshot()
        allureReporter.addAttachment(`Test ${state.toUpperCase()}, attached screenshot!`, Buffer.from(screenshot, 'base64'))
      }
    } catch (error) {
      const errorMessage = 'There was a problem taking screenshot of a full page\n' + error.toString()
      allureReporter.addArgument('Error taking screenshot', errorMessage)
      // eslint-disable-next-line no-console
      console.log(errorMessage)
    } finally {
      await browser.execute(`window.scrollTo(0, ${initialScrollHeightPosition})`)
    }
  },

  reloadSession () {
    return browser.reloadSession()
  },

  sleep (time: number) {
    return browser.pause(time)
  },

  refresh () {
    return browser.refresh()
  },

  getCurrentURL () {
    return browser.getUrl()
  }
}
