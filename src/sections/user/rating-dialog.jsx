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
import { useGetPatientFeedbacks } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider from 'src/components/hook-form/form-provider';
// ----------------------------------------------------------------------

export default function RatingRoomDialog() {
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const UpdateUserSchema = Yup.object().shape({
    Rate: Yup.number(),
    Body: Yup.string(),
    Selection: Yup.string().nullable(),
  });
  const [rating, setRating] = useState();
  const [bodyState, setBodyState] = useState();
  const [selectedValue, setSelectedValue] = useState(null);

  const { user } = useAuthContext();
  const { feedbackData, refetch } = useGetPatientFeedbacks(user?.patient?._id);

  const skipfunction = async () => {
    try {
      await axios.patch(`api/feedback/${feedbackData?._id}`, { skip: true });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleRatingClick = (e) => {
    setRating(parseFloat(e.target.value));
  };

  const toggleSelection = (option) => {
    setSelectedValue((prev) => (prev === option ? null : option));
  };

  const defaultValues = {
    Body: '',
    Selection: selectedValue,
    Rate: rating,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const dialog = useBoolean(true);

  const RATEELEMENTS = [
    'Negligence in treatment',
    'Staff behavior',
    'Cleanliness',
    'Price',
    'None of the above',
  ];

  const onSubmit = async (dataSubmit) => {
    try {
      await axios.patch(`api/feedback/${feedbackData?._id}`, {
        Selection: selectedValue,
        Rate: rating,
        Body: bodyState,
      });
      dialog.onFalse();
      enqueueSnackbar(t('Thanks for your cooperation'), { variant: 'success' });

      refetch();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        { variant: 'error' }
      );
    }
  };

  return (
    <Dialog
      open={dialog.value}
      onClose={dialog.onTrue}
      PaperProps={{
        sx: {
          width: '500px',
          maxWidth: '500px',
        },
      }}
    >
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
          <DialogContent>
            {t(`How was your experience with `)}{' '}
            {curLangAr
              ? `${feedbackData?.unit_service?.name_arabic}`
              : `${feedbackData?.unit_service?.name_english}`}
            <br />
            <span style={{ textAlign: 'center' }}>
              {curLangAr
                ? `${feedbackData?.employee?.name_arabic}`
                : `${feedbackData?.employee?.name_english}`}
            </span>
          </DialogContent>
          <Image
            src={feedbackData?.unit_service?.company_logo}
            sx={{ width: '60px', height: '60px', border: 1, borderRadius: '50px' }}
          />
          <Rating
            size="large"
            precision={1}
            max={5}
            name="Rate"
            value={rating}
            onChange={handleRatingClick}
          />
        </div>

        {rating < 4 ? (
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
                      <Radio
                        checked={selectedValue === infotwo}
                        onChange={() => toggleSelection(infotwo)}
                        name="Selection"
                      />
                      {t(infotwo)}
                    </Box>
                  </div>
                ))}
              </div>
              <FormControl sx={{ my: 5, minWidth: '100%' }}>
                <InputLabel htmlFor="max-width">{t('Other')}</InputLabel>
                <Input id="max-width" name="Body" onChange={(e) => setBodyState(e.target.value)} />
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
                <InputLabel htmlFor="max-width">{t('Leave a comment')}</InputLabel>
                <Input id="max-width" name="Body" onChange={(e) => setBodyState(e.target.value)} />
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
