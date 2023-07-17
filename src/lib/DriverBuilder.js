// @flow

// LOCAL SERVER for local development
const localServer = 'localhost'


// Selenium server:
let remoteServer = process.env.SELENIUM_SERVER_URL

export default class DriverBuilder {
  static getSeleniumServer () {
    const server = process.env.SELENIUM_SERVER
    switch (server) {
      case 'LOCAL' :
      case 'HEADLESS':
        return {
          server: localServer,
          port: 4444,
          path: '/'
        }
      case 'REMOTE':
        return {
          server: remoteServer,
          port: 4444,
          path: '/'
        }
    }
  }

  static getCapabilities () {
    let localCapabilities = {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      strictSSL: false,
      'goog:chromeOptions': {
        args: ['--ignore-certificate-errors', '--window-size=1920,1080', '--disable-browser-side-navigation']
      }
    }

    let remoteCapabilities = {
      browserName: 'chrome',
      acceptInsecureCerts: true,
      'goog:chromeOptions': {
        //        'w3c': false,
        args: ['--ignore-certificate-errors', '--headless', '--disable-gpu', '--window-size=1920,1080']
      }
    }
    const server = process.env.SELENIUM_SERVER
    switch (server) {
      case 'LOCAL' :
        return localCapabilities
      case 'REMOTE':
      case 'HEADLESS':
        return remoteCapabilities
    }
  }
}
