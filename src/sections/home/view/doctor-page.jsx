import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Stack, Dialog, Rating, Typography, Button, Card, Grid } from '@mui/material';

import { fDate, fDateAndTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { ConvertToHTML } from 'src/utils/convert-to-html';

import { useGetBlogs, useGetEmployeeAppointments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';

import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import BookDetails from '../book-details';
import { JwtLoginView } from '../../auth';
import FeedbackSection from '../feedback-section';
import ClassicVerifyView from '../../auth/verify-email';
import JwtRegisterView from '../../auth/jwt-register-view';

export default function DoctorPage({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter()

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
  const { data } = useGetBlogs({ employee: employeeData?.employee?._id })
  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    setSignupDialog(true);
    // setTimeListItem(newValue);
  };

  const formatTextWithLineBreaks = (text, limit = 20) => {
    if (!text) return '';

    const chunks = [];

    for (let i = 0; i < text.length; i += 100) {
      chunks.push(text.slice(i, i + 100));
    }

    let formattedText = chunks.join('<br />');

    if (text.length > limit) {
      formattedText = `${text.slice(0, limit)}...`;
    }

    return formattedText;
  };

  return (
    <>
      <Stack gap={1} margin={5} padding={3} sx={{ backgroundColor: 'white', borderRadius: 1 }}>
        <Stack
          gap={3}
          direction={{ lg: 'row' }}
          justifyContent="space-between"
          margin={{ md: 5 }}
          padding={{ md: 3 }}
        >
          <Stack
            direction={{ md: 'row' }}
            alignItems="center"
            justifyContent="center"
            gap={{ md: 10, xs: 3 }}
          >
            <Image sx={{ width: 300, height: 300 }} src={employeeData.employee?.picture} />
            <Stack mb={3}>
              <Typography variant="h6" component="h1" mr={5}>
                {curLangAr
                  ? employeeData?.employee?.name_arabic
                  : employeeData?.employee?.name_english}
              </Typography>
              <Typography variant="body2" component="h2">
                {curLangAr
                  ? employeeData?.employee?.speciality?.name_arabic
                  : employeeData?.employee?.speciality?.name_english}
              </Typography>
              <Typography variant="body2" component="h2">
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
        <Stack gap={3} marginX={{ md: 5 }} padding={{ md: 3 }}>
          <Stack gap={1} flex={1}>
            {(employeeData?.employee?.about_me || employeeData?.employee?.arabic_about_me) && (
              <>
                <Stack direction="row">
                  <Typography
                    variant="subtitle2"
                    sx={{ borderBottom: '2px solid #00A76F', display: 'inline' }}
                  >
                    {t('Introductory text')}:
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ px: { md: 3 } }}>
                  {curLangAr
                    ? ConvertToHTML(
                      employeeData?.employee?.arabic_about_me || employeeData?.employee?.about_me
                    )
                    : ConvertToHTML(
                      employeeData?.employee?.about_me || employeeData?.employee?.arabic_about_me
                    )}
                </Typography>
              </>
            )}
            {employeeData?.unit_service?.address && (
              <>
                <Typography
                  variant="subtitle2"
                  sx={{ borderBottom: '2px solid #00A76F', display: 'inline' }}
                >
                  {t('address')}:
                </Typography>
                <Typography variant="body2" sx={{ px: { md: 3 } }}>
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
                    component="h3"
                  >
                    {t('phone number')}:
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="left">
                  <Typography variant="body2" dir="ltr" sx={{ px: { md: 3 } }}>
                    {employeeData?.employee?.phone}
                  </Typography>
                </Stack>
              </>
            )}
            {employeeData?.employee?.email && (
              <>
                <Stack direction="row">
                  <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                    {t('email')}:
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ px: { md: 3 } }} component="h3">
                  {employeeData?.employee?.email}
                </Typography>
              </>
            )}
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('Insurance')}:
              </Typography>
            </Stack>
            <Stack>
              {employeeData?.unit_service?.insurance?.map((one) => (
                <Typography variant="body2" sx={{ px: { md: 3 } }} component="h3">
                  {curLangAr ? one.name_arabic : one.name_english}
                </Typography>
              ))}
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('languages')}:
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ px: { md: 3 } }}>
              {employeeData?.employee?.languages?.map((one) => one).join(', ')}
            </Typography>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('certifications')}:
              </Typography>
            </Stack>
            <Stack px={{ md: 3 }} gap={1}>
              {employeeData?.employee?.certifications?.map((one) => {
                if (one.name && one.year) {
                  return (
                    <Stack direction="row" gap={{ md: 1, xs: 1 }}>
                      <Typography variant="body2" component="h3">
                        {one.name}
                      </Typography>
                      ,
                      <Typography variant="body2" component="h3">
                        {one.institution}
                      </Typography>
                      ,<Typography variant="body2">{fDate(new Date(one.year), 'yyyy')}</Typography>
                    </Stack>
                  );
                }
                return '';
              })}
            </Stack>
            <Stack direction="row">
              <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                {t('memberships')}:
              </Typography>
            </Stack>
            <Stack px={{ md: 3 }} gap={1}>
              {employeeData?.employee?.memberships?.map((one) => {
                if (one.name && one.institution) {
                  return (
                    <Stack direction="row" gap={1}>
                      <Typography variant="body2" component="h3">
                        {one.name}
                      </Typography>
                      ,
                      <Typography variant="body2" component="h3">
                        {one.institution}
                      </Typography>
                    </Stack>
                  );
                }
                return '';
              })}
            </Stack>
            {employeeData?.employee?.other?.length > 0 && (
              <>
                <Stack direction="row">
                  <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
                    {t('other (researchs, books, and conferences)')}:
                  </Typography>
                </Stack>
                <Stack px={{ md: 3 }} gap={1}>
                  {employeeData?.employee?.other?.map((one) => {
                    if (one.kind && one.name) {
                      return (
                        <Stack direction="row" gap={1}>
                          <Typography variant="body2" component="h4">
                            {one.name}
                          </Typography>
                          ,
                          <Typography variant="body2" component="h4">
                            {t(one.kind)}
                          </Typography>
                        </Stack>
                      );
                    }
                    return '';
                  })}
                </Stack>
              </>
            )}
          </Stack>
          <Stack gap={1} flex={1}>
            <FeedbackSection employee={employeeData} />
          </Stack>
          {data?.length > 0 && <Stack direction="row">
            <Typography variant="subtitle2" sx={{ borderBottom: '2px solid #00A76F' }}>
              {t('Blogs')}:
            </Typography>
          </Stack>}
          <Grid
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)',
            }}
          >
            {data?.map((blog, index) => (
              <Card
                key={index}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 3,
                  // width: '75%',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => router.push(paths.pages.BlogsView(blog?._id))}
              >
                <Image
                  src={blog?.file}
                  alt={blog.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{ p: 2, maxHeight: 150 }}>
                  <Typography >{blog.title}</Typography>

                  <Typography variant='body2' sx={{ color: 'gray', mt: 1 }}>
                    {fDateAndTime(blog.created_at)}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Grid>
          <Stack direction="row" gap={1} flexWrap="wrap">
            {employeeData.employee?.keywords?.map((one, index) => (
              <Box
                sx={{ padding: 1, backgroundColor: 'background.neutral', borderRadius: 2 }}
                key={index}
              >
                <Typography variant="caption" component="h3">
                  {one}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Stack>
      </Stack>
      <Dialog fullWidth open={signupDialog} minWidth="lg" onClose={() => setSignupDialog(false)}>
        <Stack sx={{ p: { md: 4 } }}>
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
