import React, { useState } from 'react';

import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import { Card, Avatar, MenuItem, TextField, ListItemText, InputAdornment } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';

import { useGetPatientFamily } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function FamilyMembers() {
  const { user, login } = useAuthContext();
  const { Data } = useGetPatientFamily(user?.patient?._id);
  const popover = usePopover();
  const confirm = useBoolean();
  const showPassword = useBoolean();
  const loading = useBoolean();
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [password, setPassword] = useState();
  const [selectedIndex, setSelectedIndex] = useState();
  const [errorMsg, setErrorMsg] = useState();

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
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      loading.onFalse();
    }
  };

  const handleChangeUS = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      sessionStorage.setItem('parentToken', accessToken);
      await login?.(selectedIndex, password);

      router.push(PATH_AFTER_LOGIN);
      // window.location.reload();
      loading.onFalse();
    } catch (error) {
      console.error(error);
      loading.onFalse();
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
      popover.onClose();
    }
  };
  return Data?.map((info, index) => (
    <Card key={index}>
      <IconButton
        onClick={(event) => {
          popover.onOpen(event);
          setSelectedIndex(info?.email);
        }}
        sx={{ position: 'absolute', top: 8, right: 8 }}
      >
        <Iconify icon="flat-color-icons:info" />
      </IconButton>

      <Stack sx={{ p: 3, pb: 2 }}>
        <Avatar
          alt={info?.name_english}
          src={info?.unit_service?.company_logo}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        />

        <ListItemText
          primary={<span style={{ color: 'inherit' }}>{info?.name_english}</span>}
          // secondary={<span style={{ color: 'inherit' }}> <Iconify icon="flat-color-icons:cell-phone"/> {info?.mobile_num1}</span>}
          primaryTypographyProps={{
            variant: 'subtitle1',
          }}
          secondaryTypographyProps={{
            mt: 1,
            component: 'span',
            variant: 'caption',
            color: 'text.disabled',
          }}
        />

        <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
          IDno: {info?.identification_num}
        </Stack>
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', mt: 1 }}
        >
          {info?.gender}
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-bottom"
        sx={{ boxShadow: 'none', width: 'auto' }}
      >
        <MenuItem
          lang="ar"
          onClick={() => {
            // Close the popover
            popover.onClose();

            // Open the ConfirmDialog
            confirm.onTrue();
          }}
          onClose={popover.onClose}
        >
          <Iconify icon="mdi:account-switch-outline" />
          Switch account
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={confirm.value || loading.value}
        onClose={confirm.onFalse}
        title={t('confirm password')}
        content={
          <>
            {curLangAr
              ? 'ادخل كلمة المرور الخاصة بك لتبديل الحساب '
              : 'Enter your password to switch to different account'}
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
            }}
          >
            {curLangAr ? 'تبديل' : 'Switch'}
          </LoadingButton>
        }
      />
    </Card>
  ));
}
