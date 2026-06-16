import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateAndTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetBlogs, useGetEmployeeFeedbackes, useGetEmployeeAppointments } from 'src/api';

import Image from 'src/components/image';

import BookDetails from '../book-details';
import { JwtLoginView } from '../../auth';
import DoctorHero from '../doctor/doctor-hero';
import DoctorAbout from '../doctor/doctor-about';
import FaqSection from '../components/faq-section';
import ClassicVerifyView from '../../auth/verify-email';
import SectionHeading from '../components/section-heading';
import ReviewsSection from '../components/reviews-section';
import JwtRegisterView from '../../auth/jwt-register-view';
import DoctorCredentials from '../doctor/doctor-credentials';
import StickyBookingBar from '../components/sticky-booking-bar';
import DoctorRelatedCarousel from '../doctor/doctor-related-carousel';

export default function DoctorPage({ employeeData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();

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
  const { data: blogsData } = useGetBlogs({ employee: employeeData?.employee?._id });
  const { feedbackData } = useGetEmployeeFeedbackes(employeeData?.employee?._id);

  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    setSignupDialog(true);
  };

  const hasAvailableSlots = AppointDates.some((date) => {
    const d = new Date(date);
    const now = new Date();
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  });

  const openBooking = () => {
    document.getElementById('doctor-booking-widget')?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    const phoneNumber = employeeData?.employee?.phone;
    if (!phoneNumber) return;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${phoneNumber}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${phoneNumber}`);
    }
  };

  return (
    <>
      <Container sx={{ my: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          <DoctorHero
            employeeData={employeeData}
            hasAvailableSlots={hasAvailableSlots}
            onBook={openBooking}
            onMessage={sendMessage}
          />

          {employeeData?.visibility_online_appointment && (
            <Stack id="doctor-booking-widget" spacing={1.5}>
              <SectionHeading title={t('book appointment')} />
              {AppointDates.length > 0 ? (
                <Card sx={{ p: { xs: 2, md: 3 } }}>
                  <BookDetails
                    selected={selected}
                    AppointDates={AppointDates}
                    loading={loading}
                    timeListChangeHandler={timeListChangeHandler}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    list={appointmentsData}
                  />
                </Card>
              ) : (
                <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                  {t('no online appointment for this doctor')}
                </Typography>
              )}
            </Stack>
          )}

          <Divider sx={{ borderStyle: 'dashed' }} />

          <DoctorAbout employeeData={employeeData} />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <DoctorCredentials employee={employeeData?.employee} />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Stack spacing={1.5}>
            <SectionHeading title={t('reviews')} />
            <ReviewsSection
              feedbackData={feedbackData}
              average={employeeData?.employee?.rate}
              count={employeeData?.employee?.rated_times}
            />
          </Stack>

          <FaqSection
            items={[
              employeeData?.employee?.languages?.length > 0 && {
                question: t('what languages does the doctor speak'),
                answer: employeeData.employee.languages.join(', '),
              },
              employeeData?.unit_service?.insurance?.length > 0 && {
                question: t('does this doctor accept insurance'),
                answer: employeeData.unit_service.insurance
                  .map((one) => (curLangAr ? one.name_arabic : one.name_english))
                  .join(', '),
              },
            ]}
          />

          {blogsData?.length > 0 && (
            <Stack spacing={1.5}>
              <SectionHeading title={t('Blogs')} />
              <Box
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
                {blogsData.map((blog, index) => (
                  <Card
                    key={index}
                    sx={{
                      position: 'relative',
                      overflow: 'hidden',
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => router.push(paths.pages.BlogsView(blog?._id))}
                  >
                    <Image
                      src={blog?.file}
                      alt={blog.title}
                      sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Box sx={{ p: 2, maxHeight: 150 }}>
                      <Typography>{blog.title}</Typography>
                      <Typography variant="body2" sx={{ color: 'gray', mt: 1 }}>
                        {fDateAndTime(blog.created_at)}
                      </Typography>
                    </Box>
                  </Card>
                ))}
              </Box>
            </Stack>
          )}

          {/* <DoctorRelatedCarousel
            currentId={employeeData?._id}
            specialityId={employeeData?.employee?.speciality?._id}
          /> */}
        </Stack>
      </Container>

      {employeeData?.visibility_online_appointment && (
        <StickyBookingBar
          title={curLangAr ? employeeData?.employee?.name_arabic : employeeData?.employee?.name_english}
          priceLabel={employeeData?.fees ? `${t('fees')}: ${employeeData.fees}` : undefined}
          ctaLabel={t('book appointment')}
          onBook={openBooking}
        />
      )}

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
