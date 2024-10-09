import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import { Card, Stack, Dialog, Rating, TextField, Typography } from '@mui/material';

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
      setSelectedDate(AppointDates[0])
    }
  }, [AppointDates,selectedDate])
  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    if (authenticated) {
      confirm.onTrue();
    } else {
      setSignupDialog(true);
    }
    // setTimeListItem(newValue);
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
      // error emitted in backend
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
        gap={3}
        justifyContent="space-between"
        padding={3}
        sx={{ backgroundColor: 'white', borderRadius: 1 }}
      >
        <Stack
          direction={{ md: 'row' }}
          alignItems={{ sm: 'center', md: 'start' }}
          gap={{ md: 10 }}
        >
          <Image
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
            sx={{ width: 150, height: 150, cursor: 'pointer' }}
            src={employee.employee?.picture}
          />
          <Stack sx={{ gap: 1 }}>
            <Stack mb={3}>
              <Stack direction="row" alignItems="flex-end">
                <Typography
                  onClick={() =>
                    router.push(
                      paths.pages.doctor(
                        `${employee._id}_${employee?.employee?.[t('name_english')]?.replace(
                          / /g,
                          '-'
                        )}_${employee?.employee?.speciality?.[t('name_english')]?.replace(
                          / /g,
                          '-'
                        )}`
                      )
                    )
                  }
                  variant="h6"
                  mr={5}
                  sx={{ cursor: 'pointer' }}
                >
                  {curLangAr ? employee?.employee?.name_arabic : employee?.employee?.name_english}
                </Typography>
                <Rating
                  size="small"
                  readOnly
                  value={employee.employee?.rate}
                  precision={0.1}
                  max={5}
                />
                <Typography variant="caption" textTransform="lowercase">
                  ({employee.employee?.rated_times}) {t('people rate')}
                </Typography>
              </Stack>
              <Typography variant="body2">
                {curLangAr
                  ? employee?.employee?.speciality?.name_arabic
                  : employee?.employee?.speciality?.name_english}
              </Typography>
              <Typography variant="body2">
                {curLangAr
                  ? employee?.unit_service?.name_arabic
                  : employee?.unit_service?.name_english}
              </Typography>
            </Stack>
            {employee?.fees && (
              <Stack direction="row" gap={1} mb={2}>
                <Typography variant="body2">{t('fees')}:</Typography>
                <Typography variant="body2">
                  {fCurrency(employee?.fees, employee.currency?.symbol)}
                </Typography>
              </Stack>
            )}
            {employee?.unit_service?.address && (
              <Stack direction="row" gap={1}>
                <Typography variant="body2">{t('address')}:</Typography>
                <Typography variant="body2" >{employee?.unit_service?.address}</Typography>
              </Stack>
            )}
            {employee?.employee?.phone && (
              <Stack direction="row" gap={1}>
                {/* <Iconify width={16} icon='solar:phone-bold' /> */}
                <Typography variant="body2">{t('phone number')}:</Typography>
                <Typography variant="body2" sx={{ direction: curLangAr ? 'rtl' : 'ltr' }}>{employee?.employee?.phone}</Typography>
              </Stack>
            )}
            {employee?.employee?.email && (
              <Stack direction="row" gap={1}>
                {/* <Iconify width={16} icon='ic:outline-alternate-email' /> */}
                <Typography variant="body2">{t('email')}:</Typography>
                <Typography variant="body2">{employee?.employee?.email}</Typography>
              </Stack>
            )}
            {employee?.unit_service?.insurance?.length > 0 && (
              <Stack direction="row" gap={1}>
                <Typography variant="body2">{t('Insurance')}:</Typography>
                <Stack>
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
