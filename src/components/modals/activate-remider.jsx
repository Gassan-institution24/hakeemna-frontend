
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';





// ----------------------------------------------------------------------

export default function BookManually({ onClose, ...other }) {
  return (
    <Dialog maxWidth="lg" onClose={onClose} {...other}>
      <DialogTitle sx={{ mb: 1 }}>Activation needed </DialogTitle>

      <DialogContent sx={{ overflow: 'unset' }}>
        <Typography>Your Account needs to activate</Typography>
        <Typography>Did you get the activation email ?</Typography>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="contained">
          Resend
        </Button>
      </DialogActions>
    </Dialog>
  );
}

BookManually.propTypes = {
  onClose: PropTypes.func,
};
