import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import commonEN from './public/locales/en/common.json'
import clienteleAssignmentEN from './public/locales/en/clienteleAssignment.json'
import saHierarchyEN from './public/locales/en/saHierarchy.json'
import commonCN from './public/locales/cn/common.json'
import { config } from './src/config'

const resources = {
  en: {
    common: commonEN,
    clienteleAssignment: clienteleAssignmentEN,
    saHierarchy: saHierarchyEN
  },
  cn: {
    common: commonCN
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    debug: config.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
