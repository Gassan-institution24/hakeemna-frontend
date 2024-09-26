import React, { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { Stack, Container } from '@mui/system';
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
  const { Data, refetch } = useGetPatientFamily(user?.patient?._id);
  const popover = usePopover();
  const confirm = useBoolean();
  const showPassword = useBoolean();
  const loading = useBoolean();
  const router = useRouter();

  const today = new Date();
  const dob = new Date(user?.patient?.birth_date);

  const age = today.getFullYear() - dob.getFullYear();

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
      const accessToken = localStorage.getItem('accessToken');
      localStorage.setItem('parentToken', accessToken);
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

  const handleRemoveFamilyMember = async (patientId, test) => {
    try {
      await axios.patch(endpoints.patients.deleteFamilyMember(patientId));
      await axios.patch(endpoints.patients.deleteFamilyMember(test));
      enqueueSnackbar(t('Family member deleted successfully'), { variant: 'success' });
      refetch();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };
  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: { md: 'row', xs: 'column' },
        gap: 5,
      }}
    >
      {Data?.map((info, index) => (
        <Card key={index} sx={{ width: { md: '350px', xs: '300px' }, mb: 5 }}>
          {age > 18 ? (
            <IconButton
              onClick={(event) => {
                popover.onOpen(event);
                setSelectedIndex(info?.email);
              }}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <Iconify icon="flat-color-icons:info" />
            </IconButton>
          ) : (
            ''
          )}

          <Stack sx={{ p: 3, pb: 2 }}>
            <Avatar
              alt={info?.name_english}
              src={info?.profile_picture}
              variant="rounded"
              sx={{ width: 48, height: 48, mb: 2 }}
            />

            <ListItemText
              primary={
                <span style={{ color: 'inherit' }}>
                  {curLangAr ? info?.name_arabic : info?.name_english}{' '}
                </span>
              }
              secondary={<span style={{ color: 'inherit' }}> {info?.email}</span>}
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
              {t('Relative Relation:')}{' '}
              {curLangAr
                ? info?.family_members[1]?.RelativeRelation?.name_arabic
                : info?.family_members[1]?.RelativeRelation?.name_english}
            </Stack>

            <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
              {t('IDno')}: {info?.identification_num}
            </Stack>
            <Stack
              spacing={0.5}
              direction="row"
              alignItems="center"
              sx={{ typography: 'caption', mt: 1 }}
            >
              {t(info?.gender)}
            </Stack>
          </Stack>
          <CustomPopover
            open={popover.open}
            onClose={popover.onClose}
            arrow="right-bottom"
            sx={{ boxShadow: 'none', width: 'auto' }}
          >
            {info?.family_members?.map((test, ii) =>
              test?.isendit === 'no' ? (
                <MenuItem
                  key={ii}
                  lang="ar"
                  onClick={() => {
                    popover.onClose();
                    confirm.onTrue();
                  }}
                  onClose={popover.onClose}
                >
                  <Iconify icon="mdi:account-switch-outline" />
                  {t('Switch account')}
                </MenuItem>
              ) : null
            )}

            <MenuItem
              lang="ar"
              onClick={() => handleRemoveFamilyMember(user?.patient?._id, info?._id)}
              onClose={popover.onClose}
            >
              <Iconify icon="material-symbols:group-remove" />
              {t('Remove')}
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
      ))}
    </Container>
  );
}
