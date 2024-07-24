import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Stack, Dialog, Rating, Typography } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import { useGetEmployeeAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';

import BookDetails from '../book-details';
import { JwtLoginView } from '../../auth';
import FeedbackSection from '../feedback-section';
import ClassicVerifyView from '../../auth/verify-email';
import JwtRegisterView from '../../auth/jwt-register-view';

export default function DoctorPage({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [page, setPage] = useState(1);
  const [signupDialog, setSignupDialog] = useState(false);
  const [patientId, setPatientId] = useState();
  const [selected, setSelected] = useState();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { appointmentsData, AppointDates, loading, refetch } = useGetEmployeeAppointments(
    employeeData._id,
    {
      status: 'available',
      startDate: selectedDate,
    }
  );

  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    setSignupDialog(true);
    // setTimeListItem(newValue);
  };

  return (
    <>
      <Stack gap={1} margin={5} padding={3} sx={{ backgroundColor: 'white', borderRadius: 1 }}>
        <Stack
          gap={3}
          direction={{ lg: 'row' }}
          justifyContent="space-between"
          margin={5}
          padding={3}
        >
          <Stack
            direction={{ md: 'row' }}
            alignItems="center"
            justifyContent="center"
            gap={{ md: 10 }}
          >
            <Image sx={{ width: 300, height: 300 }} src={employeeData.employee?.picture} />
            <Stack mb={3}>
              <Typography variant="h6" mr={5}>
                {curLangAr
                  ? employeeData?.employee?.name_arabic
                  : employeeData?.employee?.name_english}
              </Typography>
              <Typography variant="body2">
                {curLangAr
                  ? employeeData?.employee?.speciality?.name_arabic
                  : employeeData?.employee?.speciality?.name_english}
              </Typography>
              <Typography variant="body2">
                {curLangAr
                  ? employeeData?.unit_service?.name_arabic
                  : employeeData?.unit_service?.name_english}
              </Typography>
              <Stack direction="row" alignItems="flex-end" mt={3}>
                <Rating
                  size="small"
                  readOnly
                  value={employeeData.employee?.rate}
                  precision={0.1}
                  max={5}
                />
                <Typography variant="caption" textTransform="lowercase">
                  ({employeeData.employee?.rated_times}) {t('people rate')}
                </Typography>
              </Stack>
              {employeeData?.fees && (
                <Stack direction="row" gap={1} mt={2}>
                  <Typography variant="body2">{t('fees')}:</Typography>
                  <Typography variant="body2">
                    {fCurrency(employeeData?.fees, employeeData.currency?.symbol)}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
          <Stack
            direction={{ md: 'row' }}
            alignItems="center"
            justifyContent="center"
            gap={{ md: 10 }}
          >
            {appointmentsData.length > 0 && (
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
            {appointmentsData.length < 1 && (
              <Typography>{t('no online appointment for this doctor')}</Typography>
            )}
          </Stack>
        </Stack>
        <Stack gap={3} marginX={5} padding={3}>
          <Stack gap={1} flex={1}>
            {employeeData?.unit_service?.address && (
              <>
                <Typography variant="subtitle1">{t('address')}:</Typography>
                <Typography variant="body2" sx={{ px: 3 }}>
                  {employeeData?.unit_service?.address}
                </Typography>
              </>
            )}
            {employeeData?.employee?.phone && (
              <>
                <Stack direction="row">
                  <Typography
                    variant="subtitle2"
                    sx={{ borderBottom: '2px solid #00A76F', display: 'inline' }}
                  >
                    {t('phone number')}:
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ px: 3 }}>
                  {employeeData?.employee?.phone}
                </Typography>
              </>
            )}
            {employeeData?.employee?.email && (
              <>
                <Stack direction="row">
                  <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                    {t('email')}:
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ px: 3 }}>
                  {employeeData?.employee?.email}
                </Typography>
              </>
            )}
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('insurance')}:
              </Typography>
            </Stack>
            <Stack>
              {employeeData?.unit_service?.insurance?.map((one) => (
                <Typography variant="body2" sx={{ px: 3 }}>
                  {curLangAr ? one.name_arabic : one.name_english}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('languages')}:
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ px: 3 }}>
              {employeeData?.employee?.languages?.map((one) => one).join(', ')}
            </Typography>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('certifications')}:
              </Typography>
            </Stack>
            <Stack px={3} gap={1}>
              {employeeData?.employee?.certifications?.map((one) => (
                <Stack direction="row" gap={{ md: 1, xs: 1 }}>
                  <Typography variant="body2">{one.name}</Typography>,
                  <Typography variant="body2">{one.institution}</Typography>,
                  <Typography variant="body2">{fDate(new Date(one.year), 'yyyy')}</Typography>
                </Stack>
              ))}
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('memberships')}:
              </Typography>
            </Stack>
            <Stack px={3} gap={1}>
              {employeeData?.employee?.memberships?.map((one) => (
                <Stack direction="row" gap={1}>
                  <Typography variant="body2">{one.name}</Typography>,
                  <Typography variant="body2">{one.institution}</Typography>
                </Stack>
              ))}
            </Stack>
          </Stack>
          <Stack gap={1} flex={1}>
            <FeedbackSection employee={employeeData} />
          </Stack>
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
    </>
  );
}
DoctorPage.propTypes = {
  employeeData: PropTypes.object,
};
