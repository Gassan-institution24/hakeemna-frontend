import { useState } from 'react';
import { m } from 'framer-motion';

import { LoadingButton } from '@mui/lab';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import { TextField, Typography, InputAdornment } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function ServiceUnitPopover() {
  const popover = usePopover();
  const confirm = useBoolean();
  const showPassword = useBoolean();
  const loading = useBoolean();

  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [password, setPassword] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const selected = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];

  const handleCheckPassword = async () => {
    try {
      await axios.post(endpoints.auth.checkPassword, {
        id: user?._id,
        password,
      });
      popover.onClose();
      handleChangeUS();
    } catch (error) {
      console.error(error);
      setErrorMsg(error);
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      loading.onFalse();
    }
  };

  const handleChangeUS = async () => {
    try {
      await axios.patch(endpoints.employees.one(user?.employee?._id), {
        selected_engagement: selectedIndex,
      });
      window.location.reload();
      loading.onFalse();
    } catch (error) {
      console.error(error);
      loading.onFalse();
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      popover.onClose();
    }
  };

  return (
    <>
      {user?.employee?.employee_engagements?.length > 1 && (
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
              .map((word, idx) => word.charAt(0).toUpperCase())
              .join('')}
          </Typography>
        </IconButton>
      )}
      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {user?.employee?.employee_engagements?.map((option, index, idx) => (
          <MenuItem
            lang="ar"
            key={idx}
            selected={option?.unit_service?._id === selected?.unit_service?._id}
            onClick={() => {
              setSelectedIndex(index);
              confirm.onTrue();
            }}
          >
            {curLangAr ? option?.unit_service?.name_arabic : option?.unit_service?.name_english}
          </MenuItem>
        ))}
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value || loading.value}
        onClose={confirm.onFalse}
        title={t('confirm password')}
        content={
          <>
            {curLangAr
              ? 'ادخل كلمة المرور الخاصة بك لتبديل وحدة الخدمة'
              : 'Enter your password to switch to different unit of service'}
            <TextField
              name="password"
              type={showPassword.value ? 'text' : 'password'}
              sx={{ width: '100%', pt: 4 }}
              error={errorMsg}
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
            {curLangAr ? 'تبديل' : 'Switch'}
          </LoadingButton>
        }
      />
    </>
  );
}
