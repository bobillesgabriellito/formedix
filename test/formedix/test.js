// @flow
import LoginPage from '@page-objects/LoginPage'
import driverutils from '@core-libs/driver-utils'
import CustomerTestData from '@input-data/CustomerTestData'
import DashBoard from '@page-objects/DashBoardPage'
import { assert } from 'chai'


const loginpage = new LoginPage()
const dashboard = new DashBoard()

  describe(`Acceptance Tests - Login, navigate and logout feature`, function () {
    it('Login, navigate and logout feature', async function () {
        await driverutils.goToHome();
        await loginpage.isLoaded();
        await loginpage.loginExistingUser(CustomerTestData.loginCredentials.username, CustomerTestData.loginCredentials.password);
        await dashboard.isLoaded()
      })

    it('Navigate to ‘Repository->Studies’ and perform the following actions', async function () {
        await dashboard.hoverRepositoryMenu()
        await dashboard.tapRepositoryStudies()
        await dashboard.hoverTechStudyMenuAndClickView()
        await dashboard.tapDataAcquisition()
        await dashboard.tapDataAcquisitionForms()
      })

    it('Perform the following user actions:Select to view the ‘Medical History’ form', async function () {
        await dashboard.tapMedicalHistory()
        await dashboard.tapEditMedicalHistory()
        await dashboard.ediOrAddtDescriptionForm()
    })

    it('Logout of the application', async function () {
        await dashboard.hoverUserMenuAndClickLogout()
        assert.equal(await dashboard.getTextDescription(), await dashboard.getTextDescriptionFormLabel(), 'Label form description was not equal to the actual description')

    })
  })

