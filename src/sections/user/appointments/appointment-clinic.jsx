import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useParams } from 'src/routes/hooks';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import {
  useGetUSFeedbackes,
  useGetUSAvailableAppointments,
  useGetEmployeeBySpecialty,
} from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import { useSnackbar } from 'src/components/snackbar';
import { width } from '@mui/system';

const AppointmentOnline = ({ Units, onBook, onView }) => {
  const { t } = useTranslate();
  const { feedbackData } = useGetUSFeedbackes(Units._id);
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeBySpecialty(id);

  const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient._id));
  const numberOfUsers = uniqueUserIds.size;

  return (
    <Box sx={{ display: 'flex' }}>
      {data?.map((info, forkey) => (
        <Box
          sx={{
            width: '45%',
            margin: 2,
            border: '1px solid lightgray',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          <Image
            src={info?.employee?.picture}
            sx={{ width: '110px', height: '100%', borderRight: '2px lightgray dashed' }}
          />
          <Box sx={{ ml: -8 }}>
            <Box sx={{ mt: 1, ml: 2 }}>
              <Box sx={{ display: 'inline-flex' }}>
                <Typography sx={{ fontSize: 13 }}>{info?.employee?.first_name}</Typography>&nbsp;
                <Typography sx={{ fontSize: 13 }}>{info?.employee?.middle_name}</Typography>&nbsp;
                <Typography sx={{ fontSize: 13 }}>{info?.employee?.family_name}</Typography>
              </Box>
              <Typography sx={{ fontSize: 13, color: 'grey' }}>
                {info?.employee?.speciality?.name_english}
              </Typography>
              <Box sx={{ display: 'flex', mt: 0.7, ml: -0.3 }}>
                <Iconify icon="emojione:star" />
                &nbsp;
                <Typography sx={{ fontSize: 13, mt: 0.3 }}>{Units?.rate}</Typography>&nbsp;
                <Typography sx={{ fontSize: 13, mt: 0.3 }}>
                  {t('From ')} {numberOfUsers <= 1 ? '' : numberOfUsers}{' '}
                  {numberOfUsers > 1 ? t('Visitors') : t('One Visitor')}{' '}
                </Typography>
              </Box>
              <Box sx={{ position: 'relative', left: '-0.1%', mt: 1 }}>
                <Typography>
                  <Iconify width={18} sx={{ color: 'info.main' }} icon="openmoji:hospital" />{' '}
                  {info?.unit_service?.name_english}
                </Typography>
                <Typography>
                  <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
                  {info?.unit_service?.address}
                </Typography>
                {Units?.work_hours && (
                  <Typography>
                    <Iconify width={18} sx={{ color: 'warning.main' }} icon="mingcute:time-line" />{' '}
                    Open {Units?.work_hours} h{' '}
                  </Typography>
                )}
                <Typography>
                  <Iconify width={18} sx={{ color: 'success.main' }} icon="mdi:cash-multiple" />{' '}
                  {t('Fees: ')} 30 JOD{' '}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Button
            sx={{ width: '150px', height: '45px', position: 'relative', left: 20, top: 138 }}
            variant="contained"
            color="success"
          >
            Book appointment
          </Button>
        </Box>
      ))}
    </Box>
  );
};

AppointmentOnline.propTypes = {
  Units: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};

export default AppointmentOnline;

// const getTodayDate = () => {
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };

// const kdk = () => {
//   if (appointmentValue) {
//     onBook(appointmentValue);
//     enqueueSnackbar(`Appointment booked successfully`, { variant: 'success' });
//     refetch();
//   } else {
//     alert('Please select the time first');
//   }
// };

// const toggleFeedbackDisplay = () => {
//   setShowAllFeedback(!showAllFeedback);
// };
// const displayedFeedback = showAllFeedback ? feedbackData : [feedbackData[0]];
// const groupedAppointments = appointmentsData.reduce(
//   (acc, appointment) => {
//     const appointmentDate = appointment.start_time.split('T')[0];

//     if (appointmentDate === getTodayDate()) {
//       acc.today.push(appointment);
//     } else {
//       if (!acc[appointmentDate]) {
//         acc[appointmentDate] = [];
//       }
//       acc[appointmentDate].push(appointment);
//     }

//     return acc;
//   },
//   { today: [] }
// );
// const [appointmentValue, setAppointmentValue] = useState();
// const [showAllFeedback, setShowAllFeedback] = useState(false);
// const { appointmentsData, refetch } = useGetUSAvailableAppointments(Units._id);

// const { enqueueSnackbar } = useSnackbar();
/* <Box
sx={{
  width: '50%',
  margin: 2,
  display: 'inline-flex',
  gap: 8,
  p: 1,
  overflowX: groupedAppointments.length > 3 ? 'scroll' : 'auto',
}}
>
{groupedAppointments.today.length === 0 && (
  <Box>
    <Typography style={{ fontWeight: 600, paddingBottom: 15 }}>Today</Typography>
    <Typography>
      <Button
        disabled
        sx={{
          bgcolor: 'rgba(208, 208, 208, 0.566)',
          borderRadius: 0,
          fontWeight: 100,
        }}
      >
        -- / --
      </Button>
    </Typography>
  </Box>
)}

{groupedAppointments.today.length > 0 && (
  <Box>
    <Typography style={{ fontWeight: 600, paddingBottom: 15 }}>Today</Typography>
    <Box
      sx={{
        display: 'block',
        overflowY: groupedAppointments.today.length > 5 ? 'scroll' : 'auto',
        overflowX: 'hidden',
        maxHeight: groupedAppointments.today.length > 5 ? '200px' : 'auto',
      }}
    >
      {groupedAppointments.today.map((appointment, i) => (
        <Typography key={i}>
          <Button
            onClick={() => {
              setAppointmentValue(appointment?._id);
            }}
            sx={{
              bgcolor: 'rgba(208, 208, 208, 0.566)',
              mb: 1,
              mr: 2,
              width: '80px',
              borderRadius: 0,
              fontWeight: 100,
              outline: 'none',
              '&:focus': {
                border: '1px solid lightgreen',
                bgcolor: 'rgba(208, 208, 208, 0.150)',
              },
            }}
          >
            {fTime(appointment?.start_time)}
          </Button>
        </Typography>
      ))}
    </Box>

    <Button
      onClick={kdk}
      sx={{ mt: 1, mb: 1, bgcolor: 'success.main' }}
      variant="contained"
    >
      Book
    </Button>
  </Box>
)}

{Object.keys(groupedAppointments).map((date, index) => {
  if (date !== 'today') {
    const appointments = groupedAppointments[date];

    return (
      <Box key={index}>
        <Typography style={{ fontWeight: 600, paddingBottom: 15, width: '100px' }}>
          {date}
        </Typography>
        <Box
          sx={{
            display: 'block',
            overflowY: appointments.length > 5 ? 'scroll' : 'auto',
            overflowX: 'hidden',
            maxHeight: appointments.length > 5 ? '100px' : 'auto',
          }}
        >
          {appointments.map((appointment, i) => (
            <Typography key={i}>
              <Button
                onClick={() => {
                  setAppointmentValue(appointment?._id);
                }}
                sx={{
                  bgcolor: 'rgba(208, 208, 208, 0.566)',
                  mb: 1,
                  mr: 2,
                  width: '80px',
                  borderRadius: 0,
                  fontWeight: 100,
                  '&:focus': {
                    border: '1px solid lightgreen',
                    bgcolor: 'rgba(208, 208, 208, 0.150)',
                  },
                }}
              >
                {fTime(appointment?.start_time)}
              </Button>
            </Typography>
          ))}
        </Box>

        <Button
          onClick={kdk}
          sx={{ mt: 1, mb: 1, bgcolor: 'success.main' }}
          variant="contained"
        >
          Book
        </Button>
      </Box>
    );
  }
  return null; */
