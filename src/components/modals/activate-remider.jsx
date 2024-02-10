import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { MenuItem, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import InputAdornment from '@mui/material/InputAdornment';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';

import axios, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';
import FormProvider, { RHFSelect, RHFTextField, RHFMultiSelect } from 'src/components/hook-form';
import {
  useGetAppointmentTypes,
  useGetUSServiceTypes,
  useGetUSEmployeeWorkGroups,
  useGetUSWorkShifts,
} from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

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
