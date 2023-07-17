// @flow
import BasePage from './BasePage'

const EMAIL = '#username'
const LOGIN_BUTTON = '#btnSubmit'
const PASSWORD = '#password'

export default class LoginPage extends BasePage {
  async isLoaded () {
    await this.waitForDisplayed(LOGIN_BUTTON)
  }

  async loginExistingUser (username: string, password: string) {
    await this.sendKeys(EMAIL, username)
    await this.sendKeys(PASSWORD, password)
    await this.click(LOGIN_BUTTON)
  }
}
