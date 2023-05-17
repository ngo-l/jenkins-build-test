import { Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'

import { ElsieAlertStyles } from '../../../styles/_common/elsieAlert'
import { Fonts, Colors } from '../../../styles/styleGuides'

export const ElsieAlert = ({ title, children, cancelBtn, confirmBtn, isOpen, handleClose }) => {
  return (
    <Dialog
      open={isOpen}
      maxWidth='sm'
      PaperProps={{ sx: ElsieAlertStyles.paper }}
      onClose={handleClose}
    >
      <DialogTitle data-testid='elsieAlertTitle' sx={[Fonts.h4, Colors.system.black]} >
        {title}
      </DialogTitle>
      <DialogContent data-testid='elsieAlertContent'  >
        <DialogContentText sx={[Fonts.body1, Colors.system.black]} >
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions data-testid='elsieAlertActions'>
        {cancelBtn && cancelBtn()}
        {confirmBtn && confirmBtn()}
      </DialogActions>
    </Dialog>
  )
}
