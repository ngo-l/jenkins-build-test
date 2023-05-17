import { Colors, Backgrounds, Fonts } from '../styleGuides'

export const ClienteleAssignmentReviewPageStyles = {
  reviewChangeBtn: {
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
  detailsBtn: {
    margin: '16px',
    padding: 0,
    cursor: 'pointer',
    ...Colors.elsieAdmin.primary.main,
    '&:hover': {
      ...Colors.elsieAdmin.primary.mainHover
    },
  },
  chip: {
    marginLeft: '8px'
  },
  clienteleAssignmentContent: {
    marginTop: '12px',
    width: '100%'
  },
  elsieFileUploaderInput: {
    margin: '16px'
  },
  elsieDateSelectorInput: {
    margin: '16px'
  },
  details: {
    margin: '12px 16px 12px 16px',
    padding: '16px',
    borderRadius: '16px',
    ...Backgrounds.system.grey1
  },
  cancelBtn: {
    padding: '10px',
    cursor: 'pointer'
  },
  deleteBtn: {
    padding: '10px',
    cursor: 'pointer'
  },
  content: {
    padding: '10px'
  },
  cardRoot: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)',
  },
  cardContent: {
    padding: '16px',
  },
  warningChip: {
    height: 'auto',
    textTransform: 'Capitalize',
    ...Backgrounds.warning.light,
    ...Fonts.body1
  },
  warningChipIcon: {
    fill: Colors.warning.main.color,
    width: '10px'
  },
  successChip: {
    height: 'auto',
    textTransform: 'Capitalize',
    ...Backgrounds.success.light,
    ...Fonts.body1
  },
  successChipIcon: {
    fill: Colors.success.main.color,
    width: '10px'
  },
  errorChip: {
    height: 'auto',
    textTransform: 'Capitalize',
    ...Backgrounds.error.light,
    ...Fonts.body1
  },
  errorChipIcon: {
    fill: Colors.error.main.color,
    width: '10px'
  }
}
