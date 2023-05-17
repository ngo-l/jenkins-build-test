import { Users } from 'react-feather'
import { useTranslation } from 'react-i18next'
// import { AccountTreeOutlined } from '@mui/icons-material'

import { Colors } from '../../../styles/styleGuides'

export const Pathname = () => {
  const { t } = useTranslation(['clienteleAssignment', 'saHierarchy'])

  return [
    { name: t('name', { ns: 'clienteleAssignment' }), path: '/clientele-assignment/new-schedule', icon: (selected) => <Users style={selected ? Colors.elsieAdmin.primary.main : Colors.system.black} /> },
    //Todo add saHierarchy section
    // { name: t('name', { ns: 'saHierarchy' }), path: '/sa-hierarchy', icon: () => <AccountTreeOutlined style={Colors.system.grey2} />, disabled: true }
  ]
} 
