/* eslint-disable no-console */
// @flow

import allureReporter from '@wdio/allure-reporter'

export default class BasePage {
  /**
     * Function that wait until locator is located and web element is visible
     * return true if element is visible. Waits for element to be displayed
     * @param {string} locator
     * @param {number} retries
     * @returns {Promise<boolean>}
    */
  async waitForDisplayed (locator: string, retries: number = 1): Promise<boolean> {
    try {
      const element = $(locator)
      await element.waitForDisplayed()
      return element.isDisplayed()
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(`Failed waiting for element ${locator} to be displayed`, undefined, 'failed')
        throw new Error(`Element ${locator} is not displayed after maximum retries, Error message: ${err.message.toString()}`)
      }
    }
    return this.waitForDisplayed(locator, retries - 1)
  }

    /**
     * Function to move mouse to defined web elements using locator and clicking
     * @param {string} locator
     * @param {number} retries
     * @returns {Promise<void>}
     */
    async moveToLocatorPositionAndClick (locator: string, retries: number = 3): Promise<void> {
      allureReporter.startStep(`Move mouse and click element "${locator}"`)
      try {
        let element = await $(locator)
        await element.waitForExist()
        await element.scrollIntoView()
        await element.moveTo()
        await this.sleep(500)
        await element.click()
        allureReporter.endStep('passed')
      } catch (err) {
        if (retries === 0) {
          allureReporter.endStep('failed')
          throw new Error(`Still not able to move to and click ${locator} after maximum retries, Error message: ${err.message.toString()}`)
        }
        allureReporter.endStep('skipped')
        await this.sleep(250)
        return this.moveToLocatorPositionAndClick(locator, retries - 1)
      }
    }

      /**
     * Function to wait until number of elements is >= expectedNumberOfElements. Returns elements Array after waiting
     * @param {string} locator
     * @param expectedNumberOfElements
     * @returns {Promise<WebdriverIO.ElementArray>}
    */
  async waitUntilNumberOfElementsIsAtLeast (locator: string, expectedNumberOfElements: number) {
    const getElements = () => $$(locator)
    await browser.waitUntil(async () => {
      const elements = await getElements()
      return elements.length >= expectedNumberOfElements
    }, {timeoutMsg: `Timeout waiting for number of elements with locator: ${locator} to be at least ${expectedNumberOfElements}.\n Actual number of elements: ${(await getElements()).length}`})
    return getElements()
  }

  /**
     * Function to wait until locator is located
     * @param {string} locator
     * @param {number} retries
     * @returns {Promise<WebdriverIO.Element>}
    */
  async waitForExist (locator: string, retries: number = 1): Promise<WebdriverIO.Element> {
    try {
      const element = await $(locator)
      await element.waitForExist()
      return element
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(`Failed waiting for element ${locator} to exist`, undefined, 'failed')
        throw new Error(`Element ${locator} does not exist after maximum retries, Error message: ${err.message.toString()}`)
      }
    }
    return this.waitForExist(locator, retries - 1)
  }


  /**
     * Function to send values to text box using defined locator
     * @param {string} locator
     * @param {string} keys
     * @param {number} retries
     * @returns {Promise<void>}
    */
  async sendKeys (locator: string, keys: string, retries: number = 2): Promise<void> {
    allureReporter.startStep(`Type text: "${keys}" into element: "${locator}"`)
    try {
      const element = await $(locator)
      await element.click()
      await element.clearValue()
      await element.setValue(keys)
      allureReporter.endStep('passed')
    } catch (err) {
      if (retries === 0) {
        allureReporter.endStep('failed')
        throw new Error(`Unable to send keys to ${locator} after maximum retries, Error message: ${err.message}`)
      }
      allureReporter.endStep('skipped')
      await this.sleep(1000)
      return this.sendKeys(locator, keys, retries - 1)
    }
  }

  /**
     * Function to get text using defined locator
     * @param {string} locator
     * @param {number} retries
     * @returns {Promise<string>}
    */
  async getText (locator: string, retries: number = 1): Promise<string> {
    const stepName = `Get text from element:\n "${locator}"`
    try {
      const element = await this.waitForExist(locator)
      const text = await element.getText()
      allureReporter.addStep(stepName, {type: 'text/plain', name: 'text', content: text}, 'passed')
      return text
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(stepName, undefined, 'failed')
        throw new Error(`Unable to get ${locator} text after maximum retries, Error message: ${err.message}`)
      }
      allureReporter.addStep(stepName, undefined, 'skipped')
      await this.sleep(250)
      return this.getText(locator, retries - 1)
    }
  }

 
  /**
     * Function to get web element attributes value using locator
     * @param {string} locator
     * @param attribute - attributes to extract value of
     * @param {number} retries
     * @returns {Promise<string>}
    */
  async getAttributesValue (locator: string, attribute: string, retries: number = 1): Promise<string> {
    const stepName = `Get "${attribute}" attribute from element:\n "${locator}"`
    try {
      const element = await this.waitForExist(locator)
      const attributeValue = await element.getAttribute(attribute)
      allureReporter.addStep(stepName, {type: 'text/plain', name: 'attribute value', content: attributeValue}, 'passed')
      return attributeValue
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(stepName, undefined, 'failed')
        throw new Error(`Unable to get ${locator} attributes value after maximum retries, Error message: ${err.message}`)
      }
      allureReporter.addStep(stepName, undefined, 'skipped')
      await this.sleep(250)
      return this.getAttributesValue(locator, attribute, retries - 1)
    }
  }



  /**
     * Function to get the value of a <textarea>, <select> or text <input> found by given selector with index
     * @param {string} locator
     * @param index
     * @param {number} retries
     * @returns {Promise<string>}
     */
  async getValueByIndex (locator: string, index: number, retries: number = 1): Promise<string> {
    const stepName = `Get value from element:\n "${locator}" with index ${index}`
    try {
      await this.waitUntilNumberOfElementsIsAtLeast(locator, index + 1)
      const elements = await $$(locator)
      const value = await elements[index].getValue()
      allureReporter.addStep(stepName, {type: 'text/plain', name: 'value', content: value}, 'passed')
      return value
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(stepName, undefined, 'failed')
        throw new Error(`Unable to get value of ${locator} with index ${index} after maximum retries, Error message: ${err.message}`)
      }
      allureReporter.addStep(stepName, undefined, 'skipped')
      await this.sleep(250)
      return this.getValueByIndex(locator, index, retries - 1)
    }
  }

  /**
     * Function to click on web element using defined locator
     * @param {string} locator
     * @param {number} retries
     * @returns {Promise<void>}
     */
  async click (locator: string, retries: number = 3): Promise<void> {
    allureReporter.startStep(`Click element "${locator}"`)
    try {
      const element = await $(locator)
      await element.click()
      allureReporter.endStep('passed')
    } catch (err) {
      if (retries === 0) {
        allureReporter.endStep('failed')
        throw new Error(`Still not able to click ${locator} after maximum retries, Error message: ${err.message.toString()}`)
      }
      allureReporter.endStep('skipped')
      await this.sleep(250)
      return this.click(locator, retries - 1)
    }
  }


 
  async isElementVisible (locator: string, retries: number = 1): Promise<any> {
    try {
      const element = await $(locator)
      const isVisible = element.isDisplayed()
      allureReporter.addStep(`Is element "${locator}" visible = ${isVisible}`, undefined, 'passed')
      return isVisible
    } catch (err) {
      if (retries === 0) {
        allureReporter.addStep(`Failed to check if element "${locator}" is visible`, undefined, 'failed')
        throw new Error(`Unable to check ${locator} visibility after maximum retries, Error message: ${err.message}`)
      }
      allureReporter.addStep(`Skip check if element "${locator}" is visible`, undefined, 'skipped')
      await this.sleep(250)
      return this.isElementVisible(locator, retries - 1)
    }
  }
  async sleep (timeout: number) {
    // skip logging sleeps less than 1000ms
    if (timeout > 999) {
      allureReporter.addStep(`Sleep for ${timeout / 1000} seconds`)
    }
    await browser.pause(timeout)
  }
}
