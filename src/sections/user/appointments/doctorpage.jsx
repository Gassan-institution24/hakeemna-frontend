import React, { useState, useEffect } from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {
  Box,
  Link,
  Card,
  Grid,
  Stack,
  Button,
  Select,
  Avatar,
  Dialog,
  Divider,
  MenuItem,
  Typography,
  CardHeader,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fTime, fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGetAppointment,
  useGetAppointmentTypes,
  useGetEmployeeEngagement,
  useGetEmployeeFeedbackes,
  useGetEmployeeSelectedAppointments,
} from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import FormProvider from 'src/components/hook-form/form-provider';

// Calculate the average rating from the feedback data
function calculateAverageRating(feedbackData) {
  if (!Array.isArray(feedbackData) || feedbackData.length === 0) {
    return 0; // Return 0 if the input is not a valid array or is empty
  }

  // Calculate the sum of all ratings
  const totalRating = feedbackData.reduce((sum, feedback) => {
    if (typeof feedback.Rate === 'number') {
      return sum + feedback.Rate;
    }
    return sum;
  }, 0);

  // Calculate the average rating
  const averageRating = totalRating / feedbackData.length;

  return averageRating.toFixed(1); // Round to one decimal place
}

// ----------------------------------------------------------------------

export default function Doctorpage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { appointmenttypesData } = useGetAppointmentTypes();
  const { id } = params;
  const { user } = useAuthContext();
  const [TimeData, setTimeData] = useState();
  const { fullWidth } = useState(false);
  const { maxWidth } = useState('xs');
  const dialog = useBoolean(false);
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useGetEmployeeEngagement(id);
  const datacheeck = useGetAppointment(TimeData, { populate: 'all' }).data;
  const { feedbackData } = useGetEmployeeFeedbackes(data?.employee?._id);
  const [currentDateTime, setCurrentDateTime] = useState();
  const [patientNote, setPatientNote] = useState();
  const patientData = user?.patient?._id;
  const patientinfo = user?.patient;
  const patientEmail = user?.email;
  const [selectedAppointmentType, setSelectedAppointmentType] = useState('');

  const { appointmentsData, appointmentTypes, refetch } = useGetEmployeeSelectedAppointments({
    id,
    startDate: currentDateTime, // Date selected by the user
    appointmentType: selectedAppointmentType, // Type selected by the user
  });

  const { roomsData } = useGetUSRooms(
    data?.unit_service?._id
  );
  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleTimeClick = (timeId) => {
    setTimeData(timeId);
    setSelectedTime(timeId);
  };
  const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient?._id));
  const numberOfUsers = uniqueUserIds.size;
  // Calculate the average rating
  const averageRating = calculateAverageRating(feedbackData);
  const defaultValues = {
    patient: patientData,
    title: `An appointment has been booked for ${patientinfo?.name_english}`,
    title_arabic: `تم حجز موعد ل${patientinfo?.name_arabic}`,
    photo_URL:
      'https://static.vecteezy.com/system/resources/thumbnails/017/060/777/small/3d-calendar-with-clock-checkmark-icons-marked-date-notification-bell-isolated-schedule-appointment-concept-3d-render-illustration-png.png',
    category: 'patientbooking',
    type: 'patientbooking',
  };
  const handleDateChange = (date) => {
    setTimeData();
    setSelectedTime();
    setCurrentDateTime(date);
  };

  const handleAppointmentTypeChange = (event) => {
    setSelectedAppointmentType(event.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % feedbackData.length);
    }, 3000); // Change the rating every 3 seconds

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [feedbackData.length]);
  const currentRating = feedbackData[currentIndex];
  const handleBook = async (Data) => {
    try {
      await axios.patch(`${endpoints.appointments.one(Data)}/bookappointment`, {
        patient: patientData,
        email: patientEmail,
        pInfo: patientinfo,
        appointmentinfo: datacheeck,
        note: patientNote,
        info: defaultValues,
        lang: curLangAr,
        Last_activity_atended: receptionActivity?.activities?._id
      });
      await axios.post(endpoints.history.all, {
        patient: patientData,
        name_english: 'an appointment has been created',
        name_arabic: 'تم حجز موعد',
        sub_english: `appointment in ${datacheeck?.unit_service?.name_english}`,
        sub_arabic: `موعد في  ${datacheeck?.unit_service?.name_arabic}`,
        title: 'appointment',
        actual_date: new Date(),
      });

      refetch();
      dialog.onFalse();
      enqueueSnackbar('Appointment booked successfully', { variant: 'success' });
      setTimeout(() => {
        router.push(paths.dashboard.user.patientsappointments);
      }, 1000);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  const renderHead = (
    <CardHeader
      disableTypography
      avatar={<Avatar src={data?.employee?.picture} alt="data" />}
      title={
        <Link color="inherit" variant="subtitle1">
          {data?.employee?.name_english}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {data?.employee?.speciality?.name_english}
        </Box>
      }
    />
  );

  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center' }}>
      <Typography typography="h6">
        ( {averageRating}{' '}
        <Iconify icon="emojione:star" width={22} sx={{ position: 'relative', top: 3 }} />)
        {numberOfUsers > 0 ? ` From ${numberOfUsers} visitors` : ` No rate yet`}
      </Typography>
      {currentRating && (
        <Box
          key={currentIndex}
          sx={{
            justifyContent: 'center',
            alignItems: 'center',
            m: 2,
            display: 'flex',
            bgcolor: '#F9FAFB',
            borderRadius: 2,
          }}
        >
          <Image
            sx={{ width: 40, height: 40, borderRadius: 20, m: 1 }}
            src={user?.patient?.profile_picture}
          />
          <Box sx={{ m: 1 }}>
            <Typography sx={{ float: 'left' }}>{currentRating?.patient?.name_english}</Typography>
            <br />
            <Typography sx={{ float: 'left' }}>
              {currentRating?.Body} &nbsp;
              {Array.from({ length: currentRating?.Rate }).map((_, index) => (
                <Iconify
                  key={index}
                  icon="emojione:star"
                  width={18}
                  sx={{ position: 'relative', top: 2 }}
                />
              ))}
            </Typography>
          </Box>
        </Box>
      )}
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={3} sx={{ p: 3 }}>
        {data?.employee?.description ? (
          <Box sx={{ typography: 'body2' }}>{data?.employee?.description}</Box>
        ) : (
          ''
        )}
        {data?.unit_service?.name_english ? (
          <Stack direction="row" spacing={2}>
            <Iconify icon="ic:round-business-center" width={24} />

            <Box sx={{ typography: 'body2' }}>
              {`Work at: `}
              <Link variant="subtitle2" color="inherit">
                {data?.unit_service?.name_english}
              </Link>
            </Box>
          </Stack>
        ) : (
          ''
        )}

        <Stack direction="row" spacing={2}>
          <Iconify icon="mdi:location" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Location: `}
            <Link variant="subtitle2" color="inherit">
              {data?.unit_service?.city?.name_english ? data?.unit_service?.city?.name_english : ''}{' '}
              {` - `}{' '}
              {data?.unit_service?.country?.name_english
                ? data?.unit_service?.country?.name_english
                : ''}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="typcn:phone" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`For booking: `}
            <Link variant="subtitle2" color="inherit">
              {data?.unit_service?.phone}
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          {data?.employee?.online === false ? (
            <Iconify icon="fxemoji:noentrysign" width={24} />
          ) : (
            <Iconify icon="icon-park:correct" width={24} />
          )}

          <Box sx={{ typography: 'body2' }}>{t('Available online')}</Box>
        </Stack>
      </Stack>
    </Card>
  );
  const renderPostInput = (
    <Card sx={{ p: 3 }}>
      <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
        <FormProvider>
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
            <DialogTitle>{t('Are you sure')}</DialogTitle>
            <Image
              src={datacheeck?.unit_service?.company_logo}
              sx={{
                width: '60px',
                height: '60px',
                border: '1px solid lightgreen',
                borderRadius: '50px',
              }}
            />
            <Typography sx={{ color: 'black' }}>
              {datacheeck?.unit_service?.name_english}
            </Typography>
          </div>
          <DialogContent>
            <Typography sx={{ ml: 2, mb: 1, fontSize: 15 }}>
              {t('please confirm your appointment')}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
              {t('Cancel')}
            </Button>
            <Button variant="contained" onClick={() => handleBook(TimeData)}>
              {t('Book')}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <StaticDatePicker
          disablePast
          componentsProps={{ actionBar: { actions: [''] } }}
          value={selectedAppointmentType}
          onChange={handleDateChange}
        />
      </LocalizationProvider>
      <Box sx={{ ml: 2.9 }}>
        <Typography variant="" sx={{ color: 'text.secondary', fontWeight: 'bold', mr: 5 }}>
          {t('SELECT APPOINTMENT TYPE')}{' '}
          <Iconify
            icon="teenyicons:appointments-outline"
            sx={{ ml: 1, position: 'relative', top: 1, color: '#00A76F' }}
          />
        </Typography>

        <Select
          value={selectedAppointmentType}
          onChange={handleAppointmentTypeChange}
          sx={{
            width: 150,
            height: 35,
          }}
        >
          <MenuItem value="">{t('All')}</MenuItem>
          {appointmenttypesData
            .filter((one) => appointmentTypes.includes(one._id))
            .map((type, test) => (
              <MenuItem key={test} value={type._id}>
                {type.name_english}
              </MenuItem>
            ))}
        </Select>
      </Box>
    </Card>
  );
  const renderList = (
    <Card sx={{ p: 3 }}>
      {appointmentsData.length > 0 ? (
        <Box>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
            {t('SELECT TIME')}
          </Typography>

          <Box sx={{ display: { md: 'flex', xs: 'block' }, mt: 2 }}>
            <Box
              sx={{
                width: '50%',
                height: '50%',
                display: 'grid',
                gridTemplateColumns: '1fr',
                mr: 2,
                mb: { md: 0, xs: 5 },
              }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                }}
              >
                {appointmentsData?.map((time, idx) => (
                  <Button
                    key={idx}
                    onClick={() => handleTimeClick(time?._id)}
                    sx={{
                      border:
                        time?._id === selectedTime ? '1px solid lightgreen' : '1px solid gray',
                      mb: 1,
                      ml: 0.5,
                    }}
                  >
                    {fTime(time?.start_time)}{' '}
                  </Button>
                ))}
              </Box>

              <Box sx={{ visibility: { md: 'visible', xs: 'hidden' } }}>
                {TimeData !== undefined ? (
                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'success.main' }}
                    onClick={dialog.onTrue}
                  >
                    {t('Book')}
                  </Button>
                ) : (
                  <Button disabled variant="contained" onClick={dialog.onFalse}>
                    {t('Book')}
                  </Button>
                )}
              </Box>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ borderStyle: 'dashed', display: { md: 'block', xs: 'none' } }}
            />
            <Box sx={{ ml: 2, mb: 2 }}>
              {datacheeck?.work_group?.employees &&
                datacheeck.work_group.employees.map((doctor, index) => (
                  <Typography key={index}>
                    {' '}
                    {doctor?.employee?.visibility_online_appointment === true ? (
                      <span style={{ color: 'inherit' }}>
                        <Iconify width={18} icon="noto:health-worker" />
                        &nbsp; {doctor?.employee?.employee?.name_english}
                      </span>
                    ) : null}
                  </Typography>
                ))}
              {datacheeck?.appointment_type?.name_english && (
                <Typography>
                  {' '}
                  <Iconify
                    width={18}
                    sx={{ color: 'rgb(20, 161, 255)' }}
                    icon="streamline:online-medical-service-monitor"
                  />
                  &nbsp; Appointment type: {datacheeck?.appointment_type?.name_english}{' '}
                </Typography>
              )}
              {datacheeck?.department?.name_english && (
                <Typography>
                  {' '}
                  <Iconify width={18} icon="fxemoji:departmentstore" /> &nbsp;Department:
                  {datacheeck?.department?.name_english}{' '}
                </Typography>
              )}
              {datacheeck?.price !== undefined && (
                <Typography>
                  {' '}
                  <Iconify width={18} sx={{ color: 'success.main' }} icon="mdi:cash-multiple" />
                  &nbsp; Fees: {datacheeck?.price}{' '}
                </Typography>
              )}
              {datacheeck?.start_time && (
                <Typography>
                  {' '}
                  <Iconify
                    width={18}
                    sx={{ color: 'palevioletred' }}
                    icon="lets-icons:date-range-fill"
                  />
                  &nbsp; Date: {fDateAndTime(datacheeck?.start_time)}{' '}
                </Typography>
              )}
              {datacheeck?.start_time && (
                <Typography>
                  {' '}
                  <Iconify width={18} sx={{ color: 'warning.main' }} icon="mingcute:time-line" />
                  &nbsp; Time: {fTime(datacheeck?.start_time)}{' '}
                </Typography>
              )}
              {datacheeck && (
                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ mb: 1 }}>
                    Let us know if you have any notes to follow for your appointment
                  </Typography>
                  <textarea
                    placeholder="Ex: I have..."
                    style={{
                      borderRadius: 4,
                      border: '2px solid lightgray',
                      padding: 10,
                      overflow: 'hidden',
                    }}
                    onChange={(e) => setPatientNote(e?.target?.value)}
                  />
                </Box>
              )}
            </Box>

            <Box sx={{ visibility: { md: 'hidden', xs: 'visible' }, ml: 2 }}>
              {TimeData !== undefined ? (
                <Button variant="contained" onClick={dialog.onTrue}>
                  {t('Book')}
                </Button>
              ) : (
                <Button disabled variant="contained" onClick={dialog.onFalse}>
                  {t('Book')}
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      ) : (
        <EmptyContent filled title="No Available Appointments" sx={{ py: 10 }} />
      )}
    </Card>
  );

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Iconify icon="pepicons-print:internet" /> */}
        <Link href={data?.web_page} target="_blank" rel="noopener noreferrer">
          {data?.web_page}
        </Link>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3} sx={{ gap: 2 }}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderHead}
          {renderFollows}

          {data?.unit_service?.country?.name_english ||
            data?.unit_service?.city?.name_english ||
            data?.unit_service?.name_english ||
            data?.employee?.description
            ? renderAbout
            : ''}

          {data?.web_page?.length > 1 ? renderSocials : ''}
        </Stack>
      </Grid>

      <Grid xs={12} md={7}>
        <Stack spacing={3} mb={1}>
          {renderPostInput}
        </Stack>
        <Stack>{renderList}</Stack>
      </Grid>
    </Grid>
  );
}
