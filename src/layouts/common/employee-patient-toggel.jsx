import * as Yup from 'yup';
import { useState } from 'react';
import { m } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
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
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function EmployeePatientToggel() {
  const { enqueueSnackbar } = useSnackbar();

  const lgUp = useResponsive('up', 'lg');

  const { user } = useAuthContext();
  const [loading, setLoading] = useState();
  const [showDialog, setShowDialog] = useState(false);

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const RegisterSchema = Yup.object().shape({
    name_english: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
    name_arabic: Yup.string()
      .required(t('required field'))
      .test('at-least-three-words', t('must be at least three words'), (value) => {
        if (!value) return false; // If no value, fail the validation
        const words = value.trim().split(/\s+/); // Split the input by spaces
        return words.length >= 3; // Return true if there are at least three words
      }),
  });

  const defaultValues = {
    name_english: '',
    name_arabic: '',
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    watch,
    setValue,
    formState: { errors },
  } = methods;

  const handleArabicInputChange = (event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };

  const handleEnglishInputChange = (event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;

    if (englishRegex.test(event.target.value)) {
      setValue(event.target.name, event.target.value);
    }
  };


  const handleChangeRole = async () => {
    try {
      if (Object.keys(errors).length) return
      setLoading(true);
      if (!user.patient && (!watch('name_english') || !watch("name_arabic"))) {
        setShowDialog(true);
        setLoading(false);
        return;
      }
      await axios.patch(endpoints.auth.toggleRole, watch());
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
      {!user?.strict_employee && (
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
            <Typography
              variant="body2"
              textTransform="lowercase"
              sx={{ textAlign: 'center', ml: 1 }}
            >
              {user.role === 'patient' ? t('switch to employee') : t('switch to patient')}
            </Typography>
          )}
        </LoadingButton>
      )}
      <ConfirmDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        title={t('patient account details')}
        content={
          <FormProvider methods={methods}>
            <Stack gap={2} sx={{ m: 2 }}>
              <RHFTextField
                name="name_english"
                label={t('patient name in english')}
                sx={{ width: '100%' }}
                onChange={handleEnglishInputChange}
              />
              <RHFTextField
                name="name_arabic"
                label={t('patient name in arabic')}
                sx={{ width: '100%' }}
                onChange={handleArabicInputChange}
              />
            </Stack>
          </FormProvider>
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
