// @flow
import BasePage from './BasePage'

const DASH_BOARD_TAB_MENU = '#fdxMainNavMenu'
const DASH_BOARD_REPOSITORY = '#menuMdb'
const REPOSITORY_STUDIES = '#menuMdbStudies'
const TECH_STUDIES_MENU = '[id="fdxMdbContainerListItem0Wrapper"] .container-item-dropmenu'
const VIEW = '#fdxMdbContainerListItem0View'
const DATA_ACQUISITION = '#ViewAssetGroupdataAcquisition'
const DATA_ACQUISITION_FORM = '#FORMTypeView'
const MEDICAL_HISTORY = '//*[@class="secondary"]/child::span[contains(text(),"Medical History")]'
const MEDICAL_HISTORY_EDIT = '#switchEditMode'
const MEDICAL_HISTORY_DESCRIPTION_LABEL = '#formDescription'
const MEDICAL_HISTORY_DESCRIPTION_EXISTED = '//*[starts-with(@id,"assetLocaleEditTextTextareadescriptionlocaletest")]'
const USER_MENU ='#menuUser'
const USER_LOGOUT ='#menuUserLogout'
const ADD_DESCRIPTION = '#editPropsAddEntrydescription'
const MEDICAL_HISTORY_DESCRIPTION = '//*[starts-with(@id,"assetLocaleEditTextTextareadescription")]'
const LOCALE_INPUT_DESCRIPTION ='#localeInputdescription'
const ASSESTS_BUTTON = '#saveAsset'

function genRandonString(length) {
  var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  var charLength = chars.length;
  var result = '';
  for ( var i = 0; i < length; i++ ) {
     result += chars.charAt(Math.floor(Math.random() * charLength));
  }
  return result;
}


export default class DashBoard extends BasePage {
  async isLoaded () {
    await this.waitForDisplayed(DASH_BOARD_TAB_MENU)
  }

  async hoverRepositoryMenu () {
    await this.moveToLocatorPositionAndClick(DASH_BOARD_REPOSITORY)
  }

  
  async hoverUserMenuAndClickLogout () {
    await this.moveToLocatorPositionAndClick(USER_MENU)
    await this.click(USER_LOGOUT)
  }

  async hoverTechStudyMenuAndClickView () {
    await this.moveToLocatorPositionAndClick(TECH_STUDIES_MENU)
    await this.click(VIEW)
  }

  async tapRepositoryStudies () {
    await this.click(REPOSITORY_STUDIES)
  }

  async tapDataAcquisition () {
    await this.click(DATA_ACQUISITION)
  }

  async tapMedicalHistory() {
    await this.click(MEDICAL_HISTORY)
  }

  async tapEditMedicalHistory() {
    await this.click(MEDICAL_HISTORY_EDIT)
  }

  async tapDataAcquisitionForms () {
    await this.click(DATA_ACQUISITION_FORM)
  }

  async ediOrAddtDescriptionForm () {
    if(await this.isElementVisible(MEDICAL_HISTORY_DESCRIPTION_EXISTED)){
      await this.sendKeys(MEDICAL_HISTORY_DESCRIPTION_EXISTED, genRandonString(15))
    } else {
      await this. click(ADD_DESCRIPTION)
      await this.sendKeys(MEDICAL_HISTORY_DESCRIPTION, genRandonString(15))
      await this.sendKeys(LOCALE_INPUT_DESCRIPTION, genRandonString(7))
    }
    await this.click(ASSESTS_BUTTON)
  }

  async getTextDescription(){
    return await this.getValueByIndex(MEDICAL_HISTORY_DESCRIPTION_EXISTED, 0)
  }

  async getTextDescriptionFormLabel(){
    return await this.getText(MEDICAL_HISTORY_DESCRIPTION_LABEL)
  }
}
