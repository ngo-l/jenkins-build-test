import { Colors } from '../styleGuides'

export const ClienteleAssignmentPageStyles = {
  downloadAssignmentTemplateBtn: {
    marginRight: '16px',
    padding: '4px 8px',
    cursor: 'pointer',
    ...Colors.elsieAdmin.primary.main,
    '&:hover': {
      ...Colors.elsieAdmin.primary.mainHover
    },
  },
  clienteleAssignmentPageTable: {
    marginTop: '12px',
    width:'100%'
  }
}
