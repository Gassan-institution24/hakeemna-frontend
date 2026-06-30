import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Card,
  Stack,
  Dialog,
  Avatar,
  Divider,
  TextField,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDateTime } from 'src/utils/format-time';
import { addToCalendar } from 'src/utils/calendar';
import { fCurrency } from 'src/utils/format-number';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetEmployeeAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
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

  const doctorName = curLangAr
    ? employee.employee?.name_arabic
    : employee.employee?.name_english;

  const goToDoctorPage = () =>
    router.push(
      paths.pages.doctor(
        `${employee._id}_${employee?.employee?.[t('name_english')]?.replace(
          / /g,
          '-'
        )}_${employee?.employee?.speciality?.[t('name_english')]?.replace(/ /g, '-')}`
      )
    );

  return (
    employee?.unit_service?.status === 'active' && (
      <>
        <Card
          sx={{
            p: { xs: 2.5, md: 4 },
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(145, 158, 171, 0.12)',
            border: (theme) => `1px solid ${theme.palette.divider}`,
            transition: (theme) =>
              theme.transitions.create(['box-shadow', 'transform'], { duration: 200 }),
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 16px 40px rgba(60, 176, 153, 0.18)',
            },
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            justifyContent="space-between"
            gap={{ xs: 3, lg: 5 }}
          >
            {/* ---- Doctor info ---- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} gap={3} sx={{ flex: 1 }}>
              <Box
                onClick={goToDoctorPage}
                sx={{ cursor: 'pointer', textAlign: 'center', flexShrink: 0 }}
              >
                <Avatar
                  src={
                    employee?.unit_service?.company_logo ||
                    'https://hakeemna.com/static/media/3.dc47881bd18a4a9c90b3b7987f34e213.svg'
                  }
                  alt={employee.employee?.name_english}
                  variant="rounded"
                  sx={{
                    width: 130,
                    height: 130,
                    mx: 'auto',
                    bgcolor: '#F2FBF8',
                    borderRadius: 3,
                    border: '3px solid',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 12px rgba(60, 176, 153, 0.25)',
                    '& img': { objectFit: 'contain' },
                  }}
                />
              </Box>

              <Stack gap={1} sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  onClick={goToDoctorPage}
                  sx={{
                    color: 'secondary.main',
                    fontWeight: 700,
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.dark' },
                  }}
                >
                  {doctorName}
                </Typography>

                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <Chip
                    size="small"
                    icon={<Iconify icon="solar:star-bold" sx={{ color: '#FFB400 !important' }} />}
                    label={`${employee.employee?.rate || 0} (${
                      employee.employee?.rated_times || 0
                    })`}
                    sx={{
                      bgcolor: '#F2FBF8',
                      color: 'secondary.main',
                      fontWeight: 600,
                      '& .MuiChip-icon': { ml: 0.5 },
                    }}
                  />
                  {(employee?.employee?.speciality?.name_english ||
                    employee?.employee?.speciality?.name_arabic) && (
                    <Chip
                      size="small"
                      label={
                        curLangAr
                          ? employee?.employee?.speciality?.name_arabic
                          : employee?.employee?.speciality?.name_english
                      }
                      sx={{ bgcolor: 'primary.lighter', color: 'primary.dark', fontWeight: 600 }}
                    />
                  )}
                </Stack>

                <Stack direction="row" alignItems="center" gap={0.75}>
                  <Iconify
                    icon="solar:hospital-bold"
                    width={18}
                    sx={{ color: 'text.secondary', flexShrink: 0 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {curLangAr
                      ? employee?.unit_service?.name_arabic
                      : employee?.unit_service?.name_english}
                  </Typography>
                </Stack>

                {employee?.employee?.phone && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <Iconify
                      icon="solar:phone-bold"
                      width={18}
                      sx={{ color: 'text.secondary', flexShrink: 0 }}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ direction: curLangAr ? 'rtl' : 'ltr' }}
                    >
                      {employee?.employee?.phone}
                    </Typography>
                  </Stack>
                )}

                {employee?.employee?.email && (
                  <Stack direction="row" alignItems="center" gap={0.75}>
                    <Iconify
                      icon="solar:letter-bold"
                      width={18}
                      sx={{ color: 'text.secondary', flexShrink: 0 }}
                    />
                    <Typography variant="body2" sx={{ color: 'info.main' }}>
                      {employee?.employee?.email}
                    </Typography>
                  </Stack>
                )}

                {employee?.fees && (
                  <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" sx={{ mt: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('fees')}:
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: employee?.fees_after_discount ? 'line-through' : 'none',
                        textDecorationColor: 'error.main',
                        color: 'text.disabled',
                      }}
                    >
                      {fCurrency(employee?.fees, employee.currency?.symbol)}
                    </Typography>
                    {employee?.fees_after_discount && (
                      <Typography variant="subtitle2" sx={{ color: 'primary.dark', fontWeight: 700 }}>
                        {fCurrency(employee?.fees_after_discount, employee.currency?.symbol)}
                      </Typography>
                    )}
                    {employee?.fees_after_discount && (
                      <Chip
                        size="small"
                        color="success"
                        variant="soft"
                        label={t('special offer for Hakeemna users')}
                      />
                    )}
                  </Stack>
                )}

                {employee?.unit_service?.insurance?.length > 0 && (
                  <Stack gap={0.75} sx={{ mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      {t('Insurance')}:
                    </Typography>
                    <Stack direction="row" gap={0.75} flexWrap="wrap">
                      {employee?.unit_service?.insurance
                        ?.filter((one, index) => index <= 5)
                        .map((one, idx) => (
                          <Chip
                            key={idx}
                            size="small"
                            variant="outlined"
                            label={curLangAr ? one.name_arabic : one.name_english}
                            sx={{ borderColor: 'primary.light', color: 'text.secondary' }}
                          />
                        ))}
                      {employee?.unit_service?.insurance?.length > 5 && (
                        <Chip
                          size="small"
                          label={`+${employee.unit_service.insurance.length - 5}`}
                          sx={{ bgcolor: 'primary.lighter', color: 'primary.dark' }}
                        />
                      )}
                    </Stack>
                  </Stack>
                )}
              </Stack>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: 'none', lg: 'block' } }}
            />

            {/* ---- Booking calendar / times ---- */}
            <Box sx={{ width: { xs: '100%', lg: 'auto' } }}>
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
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  gap={1}
                  sx={{
                    height: '100%',
                    minHeight: 120,
                    px: 3,
                    color: 'text.secondary',
                  }}
                >
                  <Iconify icon="solar:calendar-mark-bold-duotone" width={40} />
                  <Typography variant="body2" textAlign="center">
                    {t('no online appointment for this doctor')}
                  </Typography>
                </Stack>
              )}
            </Box>
          </Stack>
        </Card>
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
                  {fDateTime(
                    appointmentsData.filter((one) => one._id === selected)?.[0]?.start_time
                  )}
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
            <LoadingButton
              variant="contained"
              color="info"
              loading={submitting}
              onClick={handleBook}
            >
              {t('confirm')}
            </LoadingButton>
          }
        />
      </>
    )
  );
}

EmployeeCard.propTypes = {
  employee: PropTypes.object,
};
