import * as Yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Button,
  Dialog,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function Testpage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const dialog = useBoolean();
  const { user } = useAuthContext();
  const AdjustabledocumentSchema = Yup.object().shape({
    employee: Yup.string(),
    title: Yup.string(),
    topic: Yup.string(),
    applied: Yup.string(),
  });
  const defaultValues = {
    employee: user?.employee?._id,
  };

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(AdjustabledocumentSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      employee: user?.employee?._id,
    });
  }, [user, reset]);

  const Applied = ['before', 'after'];

  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.post('/api/adjustabledocument', submitdata);
      enqueueSnackbar('sick leave created successfully', { variant: 'success' });
      dialog.onFalse();
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };
  return (
    <>
      <Button variant="outlined" color="success" onClick={dialog.onTrue} sx={{ mt: 1 }}>
        create Adjustable document
        <Iconify icon="mingcute:add-line" />
      </Button>
      <Dialog open={dialog.value} onClose={dialog.onFalse}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ color: 'red', position: 'relative', top: '10px' }}>
            {t('IMPORTANT')}
          </DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 5, fontSize: 14 }}>
              {curLangAr
                ? 'قم بارفاق المعلومات التي يجب على المريض اتباعها قبل او بعد الموعد'
                : 'Attach information that the patient must follow before or after the appointment'}
            </Typography>
            <RHFTextField name="title" multiline label="tiltle" />
            <RHFTextField name="topic" multiline label="topic" />
            <RHFSelect
              label={t('applied Time')}
              fullWidth
              name="applied"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 2 }}
            >
              {Applied?.map((test, idx) => (
                <MenuItem lang="ar" value={test} key={idx} sx={{ mb: 1 }}>
                  {test}
                </MenuItem>
              ))}
            </RHFSelect>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={dialog.onFalse}>
              {t('Cancel')}
            </Button>

            <Button type="submit" variant="contained" loading={isSubmitting}>
              {t('Upload')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
}
