import * as Yup from 'yup';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Input, Rating } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUnitservice, useGetUSFeedbackes, useGetPatientOneAppointments } from 'src/api';

import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import FormProvider from 'src/components/hook-form/form-provider';
// ----------------------------------------------------------------------

export default function WatingRoom() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const UpdateUserSchema = Yup.object().shape({
    Body: Yup.string(),
    Selection: Yup.string().nullable(),
  });
  const [rating, setRating] = useState();

  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientOneAppointments(user?.patient?._id);
  const { data } = useGetUnitservice(appointmentsData?.unit_service?._id);
  const { feedbackData } = useGetUSFeedbackes(appointmentsData?.unit_service?._id);

  console.log('appointmentsData', appointmentsData);
  console.log('data', data);

  const skipfunction = async () => {
    try {
      const response = await axios.patch(`api/appointments/${appointmentsData._id}`, {
        hasFeedback: true,
      });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRatingClick = (e) => {
    setRating(parseFloat(e.target.value));
  };
  const defaultValues = {
    Body: '',
    Selection: null,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dialog = useBoolean(true);

  const [selectedValue, setSelectedValue] = React.useState(undefined);

  const RATEELEMENTS = ['Neglectful treatment', 'Employee Behavior', 'Cleanliness', 'Price'];
  const controlProps = (item) => ({
    checked: selectedValue === item,
    onChange: (e) => handleChange(e, item),
    value: item,
    name: 'color-radio-button-demo',
    inputProps: { 'aria-label': item },
  });

  const handleChange = (event, item) => {
    setSelectedValue(item);
  };

  const [fullWidth, setFullWidth] = useState(true);
  const [maxWidth, setMaxWidth] = useState('xs');
  const onSubmit = async (dataSumbmit) => {
    try {
      const newData = {
        ...dataSumbmit,
        Selection: selectedValue,
        Rate: rating,
        patient: user?.patient._id,
        appointment: appointmentsData._id,
        department: appointmentsData.department?._id,
        unit_service: data?._id,
      };
      const response = await axios.post('api/feedback', newData);
      await axios.patch(`api/appointments/${appointmentsData._id}`, {
        hasFeedback: true, // Increment the skip value by 1
      });
      enqueueSnackbar(t('Thanks for your cooperation'), { variant: 'success' });
      console.log(response);
      setTimeout(() => {
        dialog.onFalse();
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Failed to upload Your answer'), { variant: 'error' });
    }
  };

  return appointmentsData?.hasFeedback === false ? (
    <span>
      <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              margin: '20px',
              gap: '10px',
            }}
          >
            <DialogTitle>{t('Rate your appointment')}</DialogTitle>
            <Image
              src="https://cdn.altibbi.com/cdn/large/0/10/logo_1296490409_651.gif"
              sx={{ width: '60px', height: '60px', border: 1, borderRadius: '50px' }}
            />
            <Typography sx={{ color: 'black' }}>
              {currentLang ? `${data?.name_arabic}` : `${data.name_english}`}{' '}
            </Typography>
            <Rating
              size="large"
              precision={1}
              max={5}
              name="Rate"
              value={rating}
              onChange={handleRatingClick}
            />
          </div>

          {rating < 5 ? (
            <DialogContent>
              <Box component="form" noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                  {RATEELEMENTS?.map((infotwo, indextwo) => (
                    <div key={indextwo}>
                      <Box
                        sx={{
                          fontSize: { md: '15px', xs: '9px' },
                          fontWeight: { md: '400', xs: 'bolder' },
                        }}
                      >
                        <Radio {...controlProps(infotwo)} name="Selection" />
                        {infotwo}
                      </Box>
                    </div>
                  ))}
                </div>
                <FormControl sx={{ my: 3, minWidth: '100%' }}>
                  <InputLabel htmlFor="max-width">Other</InputLabel>
                  <Input id="max-width" {...register('Body')} />
                </FormControl>
              </Box>
            </DialogContent>
          ) : (
            <Typography sx={{ ml: 2, mb: 1, fontSize: 15 }}>
              {t('We hope that everything was to your satisfaction')}
            </Typography>
          )}

          <DialogActions>
            <Button
              onClick={skipfunction}
              loading={isSubmitting}
              variant="outlined"
              color="inherit"
              type="submit"
            >
              {t('Skip')}
            </Button>
            <Button type="submit" variant="contained">
              {t('Submit')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </span>
  ) : (
    <EmptyContent filled title={t('No Data')} sx={{ py: 10 }} />
  );
}
