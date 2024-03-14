import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import { DatePicker } from '@mui/x-date-pickers';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Button, MenuItem, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetInsuranceTypes, useGetActiveInsuranceCos } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import InsurancePage from '../appointments/insurancePage';

// ----------------------------------------------------------------------

export default function Insuranceinfo() {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const dialog = useBoolean(false);
  const { currentLang } = useLocales();
  const { insuranseCosData } = useGetActiveInsuranceCos();
  const { insuranseTypesData } = useGetInsuranceTypes();

  const curLangAr = currentLang.value === 'ar';
  const [checkChange, setCheckChange] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const oldMedicalReportsSchema = Yup.object().shape({
    type: Yup.string(),
    patient: Yup.string(),
    // file: Yup.array().required('File name is required'),
    // insurance: Yup.string().required(),
    // insurance_client_num: Yup.string(),
    agree: Yup.boolean().required(),
    insurance_expiry_time: Yup.date().required('Date is required'),
  });

  const defaultValues = {
    type: '',
    patient: user?.patient?._id,
    // file: [],
    insurance: '',
    insurance_client_num: '',
    insurance_expiry_time: '',
    agree: !checkChange,
  };
  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(oldMedicalReportsSchema),
    defaultValues,
  });
  const {
    // setValue,
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/insurance/data', data);
      enqueueSnackbar('medical report uploaded successfully', { variant: 'success' });
      dialog.onFalse();
      reset();
      setCheckChange(!checkChange);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(typeof error === 'string' ? error : error.message, { variant: 'error' });
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('My insurance cards')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('My insurance cards') },
        ]}
        action={
          <Button
            onClick={dialog.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add New
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ position: 'relative', top: '10px' }}>
            {t('Add your insurance cards here')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ color: 'red', mb: 5, fontSize: 14 }}>
              The attached card must be present and real
            </Typography>
            <Controller
              name="insurance_expiry_time"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  {...field}
                  sx={{ mb: 1 }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!error,
                      helperText: error?.message,
                      label: 'Expiry date',
                    },
                  }}
                />
              )}
            />
            <RHFTextField
              lang="en"
              name="insurance_client_num"
              label={t('Card number*')}
              sx={{ mb: 1.5 }}
            />
            <RHFSelect
              label={t('insuranse*')}
              fullWidth
              name="insurance"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1.5 }}
            >
              {insuranseCosData.map((test, idx) => (
                <MenuItem value={test?._id} key={idx} sx={{ mb: 1 }}>
                  {test?.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFSelect
              label={t('Type*')}
              fullWidth
              name="type"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 1.5 }}
            >
              {insuranseTypesData.map((test, idx) => (
                <MenuItem value={test?._id} key={idx} sx={{ mb: 1 }}>
                  {test?.Coverage_name}
                </MenuItem>
              ))}
            </RHFSelect>

            {/* <RHFUpload
              autoFocus
              fullWidth
              name="file"
              margin="dense"
              sx={{ mb: 1 }}
              variant="outlined"
              // onDrop={handleDrop}
              multiple
            /> */}
          </DialogContent>
          <Checkbox
            size="small"
            name="agree"
            color="success"
            sx={{ position: 'relative', top: 5, left: 25 }}
            onChange={() => {
              setCheckChange(!checkChange);
            }}
          />
          <Typography
            sx={{
              color: 'text.secondary',
              mt: { md: -2.5, xs: -2.3 },
              ml: curLangAr ? { md: -31, xs: -5 } : { md: -21, xs: 4 },
              typography: 'caption',
              textAlign: 'center',
              fontSize: { md: 12, xs: 10 },
            }}
          >
            {t('I reed the ')}
            <Link underline="always" color="text.primary">
              {t(' Privacy Policy ')}
            </Link>
            {t('And agree to ')}
            <Link underline="always" color="text.primary">
              {t('Terms of Service ')}
            </Link>
            .
          </Typography>
          <DialogActions>
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
              {t('Cancel')}
            </Button>
            {checkChange === false ? (
              <Button type="submit" loading={isSubmitting} variant="contained" disabled>
                {t('Upload')}
              </Button>
            ) : (
              <Button type="submit" loading={isSubmitting} variant="contained">
                {t('Upload')}
              </Button>
            )}
          </DialogActions>
        </FormProvider>
      </Dialog>{' '}
      <InsurancePage />
    </Container>
  );
}
