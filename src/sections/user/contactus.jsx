import * as Yup from 'yup';
import { useState } from 'react';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { m } from 'framer-motion';
import { useTranslate, useLocales } from 'src/locales';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosHandler from 'src/utils/axios-handler';
import { varFade, MotionViewport } from 'src/components/animate';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function ContactUs() {
  const { enqueueSnackbar } = useSnackbar();
  const [error, setError] = useState();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';


  const contactUsSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    Body: Yup.string().required('Message is required'),
  });

  const defaultValues = {
    title: '',
    Body: '',
  };

  const methods = useForm({
    resolver: yupResolver(contactUsSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (info) => {
    try {
      const response = await axiosHandler({
        setError,
        method: 'POST',
        path: `/api/contactus`,
        data: info,
      });
      if (response) {
        enqueueSnackbar(`${curLangAr ? 'تم ارسال الرسالة بنجاح':'Your message sent successfully'}`, { variant: 'success' });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاولة لاحقا' : 'Somthing went wront, please try again later'}`, { variant: 'error' });
      }
    } catch (err) {
      setError(err.message);
      enqueueSnackbar(`${curLangAr ? 'حدث خطأ ما, الرجاء المحاولة لاحقا' : 'Somthing went wront, please try again later'}`, { variant: 'error' });
    }
  });
  return (
    <FormProvider onSubmit={onSubmit}>
      <Stack
        component={MotionViewport}
        spacing={3}
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 7,
          borderRadius: 2,
          p: 3,
          minWidth: 300,
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography variant="h5">
            {t('Any proplem!')} <br />
            {t('Feel free to contact us.')}
          </Typography>
        </m.div>

        <Stack spacing={3}>
          <m.div variants={varFade().inUp}>
            <TextField fullWidth label={curLangAr? 'الموضوع' : 'Subject*'} {...methods.register('title')} />
          </m.div>

          <m.div variants={varFade().inUp}>
            <TextField
              fullWidth
              label= {curLangAr? 'اخبرنا ما الخطب' : 'Enter your message here*'}
              multiline
              rows={5}
              {...methods.register('Body')}
            />
          </m.div>
        </Stack>

        <m.div variants={varFade().inUp}>
          <Button size="large" type="submit" variant="contained" methods={methods}>
            {t('Submit')}
          </Button>
        </m.div>
      </Stack>
    </FormProvider>
  );
}
