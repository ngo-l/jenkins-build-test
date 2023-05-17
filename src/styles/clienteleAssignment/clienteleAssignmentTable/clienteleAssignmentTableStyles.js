import { Backgrounds, Colors, Fonts } from "../../styleGuides"

export const ClienteleAssignmentTableStyles = {
  root: {
    boxShadow: '0 0 10px 1px rgb(34 41 47 / 10%)',
  },
  cardContent: {
    padding: 0,
    ':last-child': {
      padding: 0
    }
  },
  row: {
    '&:hover': {
      ...Backgrounds.elsieAdmin.primary.lightHover,
      cursor: 'pointer'
    }
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
