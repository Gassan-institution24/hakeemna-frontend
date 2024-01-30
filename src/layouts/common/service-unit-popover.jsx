import { m } from 'framer-motion';
import { useCallback, useState } from 'react';

import { Button, InputAdornment, TextField, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { LoadingButton } from '@mui/lab';

import { useSnackbar } from 'notistack';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import axios, { endpoints } from 'src/utils/axios';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function ServiceUnitPopover() {
  const popover = usePopover();
  const confirm = useBoolean();
  const showPassword = useBoolean();
  const loading = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const [password, setPassword] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [error, setError] = useState();

  const selected = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];

  const handleCheckPassword = async () => {
    try {
      await axios.post(endpoints.auth.checkPassword, {
        id: user?._id,
        password,
      });
      popover.onClose();
      handleChangeUS();
    } catch (e) {
      console.error(e);
      setError(e);
      enqueueSnackbar('wrong password!', { variant: 'error' });
      loading.onFalse();
    }
  };

  const handleChangeUS = async () => {
    try {
      await axios.patch(endpoints.tables.employee(user?.employee?._id), {
        selected_engagement: selectedIndex,
      });
      window.location.reload();
      loading.onFalse();
    } catch (e) {
      console.error(e);
      loading.onFalse();
      enqueueSnackbar('wrong password!', { variant: 'error' });
      popover.onClose();
    }
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
        }}
      >
        <Typography variant="body1" sx={{ textAlign: 'center' }}>
          {selected?.unit_service?.name_english
            ?.split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('')}
        </Typography>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {user?.employee?.employee_engagements?.map((option, index) => (
          <MenuItem
            key={option.unit_service?._id}
            selected={option?.unit_service?._id === selected?.unit_service?._id}
            onClick={() => {
              setSelectedIndex(index);
              confirm.onTrue();
            }}
          >
            {option?.unit_service?.name_english}
          </MenuItem>
        ))}
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value || loading.value}
        onClose={confirm.onFalse}
        title="Confirm password"
        content={
          <>
            Enter your password to switch to different service unit
            <TextField
              name="password"
              type={showPassword.value ? 'text' : 'password'}
              sx={{ width: '100%', pt: 4 }}
              error={error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={showPassword.onToggle} edge="end">
                      <Iconify
                        icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="warning"
            loading={loading.value}
            onClick={async () => {
              loading.onTrue();
              await handleCheckPassword();
              // confirm.onFalse();
            }}
          >
            Switch
          </LoadingButton>
        }
      />
    </>
  );
}
