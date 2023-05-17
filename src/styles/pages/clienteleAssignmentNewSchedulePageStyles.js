import { Colors } from '../styleGuides'

export const ClienteleAssignmentNewSchedulePageStyles = {
  discardClienteleAssignmentScheduleBtn: {
    marginRight: '16px',
    padding: '4px 8px',
    cursor: 'pointer',
    ...Colors.elsieAdmin.primary.main,
    '&:hover': {
      ...Colors.elsieAdmin.primary.mainHover
    },
  },
  backBtn: {
    marginBottom: '12px',
    cursor: 'pointer',
    ...Colors.elsieAdmin.primary.main,
    '&:hover': {
      ...Colors.elsieAdmin.primary.mainHover
    },
  },
  clienteleAssignmentContent: {
    marginTop: '12px',
    width: '100%'
  },
  cardRoot: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)',
  },
  cardContent: {
    padding: '16px',
  },
}
