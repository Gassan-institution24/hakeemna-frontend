import * as Yup from 'yup';
import PropTypes from 'prop-types';
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
import { useGetPatientOneAppointments } from 'src/api';

import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form/form-provider';
// ----------------------------------------------------------------------

export default function WatingRoomDialog({ employeesData }) {
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
  console.log(appointmentsData, 'appointmentsData');
  const skipfunction = async () => {
    try {
      await axios.patch(`api/appointments/${appointmentsData._id}`, {
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
    mode: 'onTouched',
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

  const { fullWidth } = useState(false);
  const { maxWidth } = useState('xs');
  const onSubmit = async (dataSumbmit) => {
    try {
      const newData = {
        ...dataSumbmit,
        Selection: selectedValue,
        Rate: rating,
        patient: user?.patient._id,
        appointment: appointmentsData._id,
        department: appointmentsData.department?._id,
        employee: employeesData?.employee?.employee?._id,
      };
      await axios.post('api/feedback', newData);
      await axios.patch(`api/appointments/${appointmentsData._id}`, {
        hasFeedback: true,
      });
      dialog.onFalse();
      enqueueSnackbar(t('Thanks for your cooperation'), { variant: 'success' });

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  };
  return (
    <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textalign: 'center',
            margin: '20px',
            gap: '10px',
          }}
        >
          <DialogTitle>{t('Rate your appointment')}</DialogTitle>
          <DialogContent>
            {t(`How was your experience with `)}{' '}
            {curLangAr
              ? `${appointmentsData?.unit_service?.name_arabic}`
              : `${appointmentsData?.unit_service?.name_english}`}
          </DialogContent>
          <Image
            src={appointmentsData?.unit_service?.company_logo}
            sx={{ width: '60px', height: '60px', border: 1, borderRadius: '50px' }}
          />
          {/* <Typography sx={{ color: 'black' }}>
              
            </Typography> */}
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
                {RATEELEMENTS?.map((infotwo, idx) => (
                  <div key={idx}>
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
              <FormControl sx={{ my: 5, minWidth: '100%' }}>
                <InputLabel htmlFor="max-width">Other</InputLabel>
                <Input id="max-width" {...register('Body')} />
              </FormControl>
            </Box>
          </DialogContent>
        ) : (
          <DialogContent>
            <Typography sx={{ ml: 2, mb: 1, fontSize: 15 }}>
              {t('We hope that everything was to your satisfaction')}
            </Typography>
            <Box component="form" noValidate>
              <FormControl sx={{ my: 3, minWidth: '100%' }}>
                <InputLabel htmlFor="max-width">Other</InputLabel>
                <Input id="max-width" {...register('Body')} />
              </FormControl>
            </Box>
          </DialogContent>
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
  );
}
WatingRoomDialog.propTypes = {
  employeesData: PropTypes.object,
};
