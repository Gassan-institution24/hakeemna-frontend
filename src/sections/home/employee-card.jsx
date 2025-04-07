import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, Paper, Stack, Dialog, Rating, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { addToCalendar } from 'src/utils/calender';
import { fCurrency } from 'src/utils/format-number';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { JwtLoginView } from '../auth';
import BookDetails from './book-details';
import ClassicVerifyView from '../auth/verify-email';
import JwtRegisterView from '../auth/jwt-register-view';

export default function EmployeeCard({ employee }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const confirm = useBoolean();
  const { enqueueSnackbar } = useSnackbar();

  const { authenticated, user } = useAuthContext();

  const [note, setNote] = useState('');
  const [page, setPage] = useState(1);
  const [signupDialog, setSignupDialog] = useState(false);
  const [patientId, setPatientId] = useState();
  const [selected, setSelected] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [submitting, setSubmitting] = useState(false);

  const { appointmentsData, AppointDates, loading, refetch } = useGetEmployeeAppointments(
    employee._id,
    {
      select: 'start_time',
      status: 'available',
      startDate: selectedDate,
      online_available: true,
    }
  );
  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(AppointDates[0]);
    }
  }, [AppointDates, selectedDate]);

  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    if (authenticated) {
      confirm.onTrue();
    } else {
      setSignupDialog(true);
    }
  };

  const handleBook = async () => {
    setSubmitting(true);
    try {
      await axiosInstance.patch(endpoints.appointments.book(selected), {
        patient: user?.patient?._id,
        note,
        lang: curLangAr,
      });
      await addToCalendar(appointmentsData.filter((one) => one._id === selected)?.[0]);
      enqueueSnackbar(t('booked successfully!'));
      setSubmitting(false);
      confirm.onFalse();
      setNote('');
      refetch();
    } catch (error) {
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      setSubmitting(false);
      confirm.onFalse();
      setNote('');
      console.error(error);
    }
  };

  return (
    <>
      <Stack
        direction={{ lg: 'row' }}
        justifyContent="space-between"
        padding={5}
        sx={{
          backgroundColor: '#3CB099',
          borderRadius: 2,
          boxShadow: 3,
          mx: 15,
        }}
      >
        <Stack
          direction={{ md: 'row' }}
          alignItems={{ sm: 'center', md: 'start' }}
          gap={{ md: 10 }}
        >
          <Box>
            <Paper
              elevation={3}
              sx={{
                overflow: 'hidden',
                borderRadius: 3,
                textAlign: 'center',
                backgroundColor: 'white',
                position: 'relative',
                cursor: 'pointer',
                mb: 2,
                width: 250,
                minHeight: 200,
              }}
              onClick={() =>
                router.push(
                  paths.pages.doctor(
                    `${employee._id}_${employee?.employee?.[t('name_english')]?.replace(
                      / /g,
                      '-'
                    )}_${employee?.employee?.speciality?.[t('name_english')]?.replace(/ /g, '-')}`
                  )
                )
              }
            >
              <Image
                src={employee?.employee?.image}
                alt={employee.employee?.name_english}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />

              {/* Green Overlay at the Bottom */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '80px',
                  backgroundColor: '#2EA98D',
                  clipPath: 'ellipse(100% 60% at center bottom)', // Curved bottom shape
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', color: 'white', fontSize: 18, pt: 5 }}
                >
                  {curLangAr ? employee.employee?.name_arabic : employee.employee?.name_english}
                </Typography>
              </Box>
            </Paper>
            {employee?.employee?.phone && (
              <Stack direction="row" gap={1}>
                <Typography sx={{ color: 'white' }} variant="body2">
                  {t('phone number')}:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ direction: curLangAr ? 'rtl' : 'ltr', color: 'white' }}
                >
                  {employee?.employee?.phone}
                </Typography>
              </Stack>
            )}
            {employee?.employee?.email && (
              <Stack direction="row" gap={1}>
                <Typography sx={{ color: 'white' }} variant="body2">
                  {t('email')}:
                </Typography>
                <Typography sx={{ color: '#3C5CD2' }} variant="body2">
                  {employee?.employee?.email}
                </Typography>
              </Stack>
            )}
          </Box>

          <Stack sx={{ gap: 1 }}>
            <Stack>
              <Stack direction="row" spacing={1} sx={{ justifyContent: 'start' }}>
                <Rating
                  size="small"
                  readOnly
                  value={employee.employee?.rate}
                  max={1}
                  sx={{
                    '& .MuiRating-icon': {
                      color: '#FFD700', // Replace with the color you want
                    },
                  }}
                />
                <Typography variant="body" sx={{ color: 'white' }}>
                  {employee.employee?.rated_times}
                </Typography>
              </Stack>
              <Typography variant="body1" mb={1} sx={{ fontWeight: 500, color: 'white' }}>
                {curLangAr
                  ? employee?.employee?.speciality?.name_arabic
                  : employee?.employee?.speciality?.name_english}
              </Typography>
              <Typography mb={1} variant="body1" color="white">
                {curLangAr
                  ? employee?.unit_service?.name_arabic
                  : employee?.unit_service?.name_english}
              </Typography>
            </Stack>
            {employee?.fees && (
              <Stack gap={1} mb={2}>
                <Stack gap={1} direction="row">
                  <Typography color="white" variant="body2">
                    {t('fees')}:
                  </Typography>

                  <Typography
                    sx={{
                      textDecoration: 'line-through',
                      textDecorationColor: 'red',
                      textDecorationThickness: '2px',
                      color: 'white',
                    }}
                    variant="body2"
                  >
                    {fCurrency(employee?.fees, employee.currency?.symbol)}
                  </Typography>
                  {employee?.fees_after_discount && (
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                      {fCurrency(employee?.fees_after_discount, employee.currency?.symbol)}
                    </Typography>
                  )}
                </Stack>
                {employee?.fees_after_discount && (
                  <Typography color="#1F2C5C" variant="caption" sx={{ display: 'block' }}>
                    {t('special offer for Hakeemna users')}
                  </Typography>
                )}
              </Stack>
            )}

            {employee?.unit_service?.insurance?.length > 0 && (
              <Stack gap={1} color="white">
                <Typography variant="body2">{t('Insurance')}:</Typography>
                <Stack direction="row" gap={1}>
                  {employee?.unit_service?.insurance?.length > 5
                    ? employee?.unit_service?.insurance
                        ?.filter((one, index) => index <= 5)
                        .map((one) => (
                          <Typography variant="body2">
                            {curLangAr ? one.name_arabic : one.name_english}
                          </Typography>
                        ))
                    : employee?.unit_service?.insurance?.map((one) => (
                        <Typography variant="body2">
                          {curLangAr ? one.name_arabic : one.name_english}
                        </Typography>
                      ))}
                  {employee?.unit_service?.insurance?.length > 5 &&
                    `+${employee.unit_service.insurance.length - 5}`}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack direction={{ md: 'row' }} gap={{ md: 10 }}>
          {AppointDates.length > 0 && (
            <BookDetails
              selected={selected}
              AppointDates={AppointDates}
              loading={loading}
              timeListChangeHandler={timeListChangeHandler}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              list={appointmentsData}
            />
          )}
          {AppointDates.length < 1 && (
            <Typography>{t('no online appointment for this doctor')}</Typography>
          )}
        </Stack>
      </Stack>
      <Dialog fullWidth open={signupDialog} minWidth="lg" onClose={() => setSignupDialog(false)}>
        <Stack sx={{ p: 4 }}>
          {page === 1 && (
            <JwtRegisterView
              afterSignUp={() => setPage(2)}
              onSignIn={() => setPage(3)}
              setPatientId={setPatientId}
            />
          )}
          {page === 2 && (
            <ClassicVerifyView
              onVerify={() => setSignupDialog(false)}
              patientId={patientId}
              selected={selected}
              refetch={refetch}
            />
          )}
          {page === 3 && (
            <JwtLoginView
              onSignin={() => setSignupDialog(false)}
              onSignUp={() => setPage(1)}
              setPatientId={setPatientId}
              selected={selected}
              refetch={refetch}
            />
          )}
        </Stack>
      </Dialog>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={t('confirm booking appointment')}
        content={
          <>
            <Card sx={{ p: 2, m: 2 }}>
              <Typography>
                {t('patient')} :{' '}
                {curLangAr ? user?.patient?.name_arabic : user?.patient?.name_english}
              </Typography>
              <Typography>
                {t('doctor')} :{' '}
                {curLangAr ? employee.employee?.name_arabic : employee.employee?.name_english}
              </Typography>
              <Typography>
                {t('appointment')} :{' '}
                {fDateTime(appointmentsData.filter((one) => one._id === selected)?.[0]?.start_time)}
              </Typography>
            </Card>
            <TextField
              multiline
              fullWidth
              label={t('note')}
              rows={2}
              sx={{ my: 2 }}
              onChange={(e) => setNote(e.target.value)}
              value={note}
            />
          </>
        }
        action={
          <LoadingButton variant="contained" color="info" loading={submitting} onClick={handleBook}>
            {t('confirm')}
          </LoadingButton>
        }
      />
    </>
  );
}

EmployeeCard.propTypes = {
  employee: PropTypes.object,
};
