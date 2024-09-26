import { useState } from 'react';
import { m } from 'framer-motion';

import { Stack } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useResponsive } from 'src/hooks/use-responsive';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

export default function EmployeePatientToggel() {
  const { enqueueSnackbar } = useSnackbar();

  const lgUp = useResponsive('up', 'lg');

  const { user } = useAuthContext();
  const [loading, setLoading] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ name_english: '', name_arabic: '' });

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(event.target.value)) {
      setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;

    if (englishRegex.test(event.target.value)) {
      setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleChangeRole = async () => {
    try {
      setLoading(true);
      if (!user.patient && (!formData.name_english || !formData.name_arabic)) {
        setShowDialog(true);
        setLoading(false);
        return;
      }
      await axios.patch(endpoints.auth.toggleRole, formData);
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
    <>
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
      <ConfirmDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title={t('patient account details')}
        content={
          <Stack gap={2} sx={{ m: 2 }}>
            <TextField
              name="name_english"
              label={t('patient name in english')}
              value={formData.name_english}
              sx={{ width: '100%' }}
              onChange={handleEnglishInputChange}
            />
            <TextField
              name="name_arabic"
              label={t('patient name in arabic')}
              value={formData.name_arabic}
              sx={{ width: '100%' }}
              onChange={handleArabicInputChange}
            />
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            color="warning"
            loading={loading}
            onClick={handleChangeRole}
          >
            {t('submit')}
          </LoadingButton>
        }
      />
    </>
  );
}
