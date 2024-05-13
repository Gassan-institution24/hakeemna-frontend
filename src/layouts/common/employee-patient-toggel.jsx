import { useState } from 'react';
import { m } from 'framer-motion';

import { LoadingButton } from '@mui/lab';
import { Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function EmployeePatientToggel() {
  const { enqueueSnackbar } = useSnackbar();

  const lgUp = useResponsive('up', 'lg');

  const { user } = useAuthContext();
  const [loading, setLoading] = useState();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleChangeRole = async () => {
    try {
      setLoading(true);
      await axios.patch(endpoints.auth.toggleRole);
      setLoading(false);
      window.location.href = paths.dashboard.root;
    } catch (error) {
      setLoading(false);
      console.error(error);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  return (
    <LoadingButton
      component={m.button}
      loading={loading}
      whileTap="tap"
      whileHover="hover"
      loadingIndicator="Loading…"
      variants={varHover(1.05)}
      onClick={handleChangeRole}
      sx={{
        p: 0,
        m: 2,
        // width: 40,
        // height: 40,
      }}
    >
      <Iconify icon="mage:exchange-b" />
      {lgUp && (
        <Typography variant="body2" textTransform="lowercase" sx={{ textAlign: 'center', ml: 1 }}>
          {user.role === 'patient' ? t('switch to employee') : t('switch to patient')}
        </Typography>
      )}
    </LoadingButton>
  );
}
