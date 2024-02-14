import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

// import { useTranslate } from 'src/locales';
import { useGetUSFeedbackes, useGetUSAvailableAppointments } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
// import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

export default function AppointmentOnline({ Units, onBook, onView }) {
  // const { t } = useTranslate();
  const { appointmentsData, refetch } = useGetUSAvailableAppointments(Units._id);
  const { feedbackData } = useGetUSFeedbackes(Units._id);
  const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient._id));
  const numberOfUsers = uniqueUserIds.size;
  const kdk = (id) => {
    onBook(id);
    refetch();
  };



  return (
    <Box sx={{ display: 'flex', border: '1px solid rgba(208, 208, 208, 0.344)', mb: 5 }}>
      <Box sx={{ width: '55%', margin: 2 }}>
        <Box sx={{ display: 'flex' }}>
          <Image
            src={Units?.company_logo}
            sx={{ width: '110px', height: '110px', borderRadius: '100%' }}
          />
          <Box sx={{ mt: 1, ml: 2 }}>
            <Typography sx={{ fontSize: 13 }}>{Units?.name_english}</Typography>
            <Typography sx={{ fontSize: 13, color: 'grey' }}>
              {Units?.speciality?.name_english}
            </Typography>
            <Box sx={{ display: 'flex', mt: 0.7, ml: -0.3 }}>
              <Iconify icon="emojione:star" />
              &nbsp;
              <Typography sx={{ fontSize: 13, mt: 0.3 }}>{Units?.rate}</Typography>&nbsp;
              {numberOfUsers === 0 ? (
                ''
              ) : (
                <Typography sx={{ fontSize: 13, mt: 0.3 }}>By {numberOfUsers} Person</Typography>
              )}
            </Box>
            <Box sx={{ position: 'relative', left: '-10.1%' }}>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
                  {Units?.country?.name_english} {Units?.city?.name_english}
                </li>
                <li>
                  <Iconify width={18} sx={{ color: 'warning.main' }} icon="mingcute:time-line" />{' '}
                  Open 24h
                </li>
                <li>
                  <Iconify width={18} sx={{ color: 'success.main' }} icon="mdi:cash-multiple" />{' '}
                  Fees: 30 JOD{' '}
                </li>
              </ul>
            </Box>

            {feedbackData.map((feedback) => (
              <>
                <Iconify
                  sx={{
                    transform: 'rotate(-20deg)',
                    color: 'success.main',
                    zIndex: 1,
                    position: 'relative',
                    top: 12,
                    left: -5,
                    width: 25,
                    height: 25,
                  }}
                  icon="material-symbols-light:rate-review-outline"
                />

                <Box sx={{ bgcolor: 'rgba(208, 208, 208, 0.250)', width: 350 }}>
                  <Box sx={{ padding: 2 }}>
                    <Box sx={{ display: 'inline-flex' }}>
                      <Image
                        sx={{
                          borderRadius: '100%',
                          width: '35px',
                          height: '35px',
                          position: 'relative',
                          top: '-5px',
                          left: '-5px',
                          border: '1px solid lightgreen',
                        }}
                        src={feedback?.patient?.profile_picture}
                      />
                      <Typography sx={{ ml: 1, mt: 0.5 }}>
                        {feedback?.patient?.first_name}
                      </Typography>
                      <Box sx={{ ml: 1, mt: 0.7 }}>
                        <Iconify width={19} icon="emojione:star" />{' '}
                        <Iconify width={19} icon="emojione:star" />{' '}
                        <Iconify width={19} icon="emojione:star" />{' '}
                        <Iconify width={19} icon="emojione:star" />{' '}
                        <Iconify width={19} icon="emojione:star" />{' '}
                      </Box>
                    </Box>
                    <Typography sx={{ ml: 5.3 }}>{feedback?.Body}</Typography>
                  </Box>
                </Box>
              </>
            ))}
          </Box>
        </Box>
      </Box>
      {/* <Typography sx={{textAlign:'center'}}>Lorem ipsum dolor sit amet.</Typography> */}
      {appointmentsData.length > 0 ? (
        <Box
          sx={{
            width: '45%',
            margin: 2,
            // display: 'grid',
            // gridTemplateColumns: '1fr 1fr 1fr',
          }}
        >
          <ul style={{ listStyle: 'none' }}>
            <h4 style={{ fontWeight: 600 }}>Today</h4>
            {appointmentsData.map((appointments, i) => (
              <li key={i}>
                <Button
                  onClick={() => kdk(appointments?._id)}
                  sx={{
                    bgcolor: 'rgba(208, 208, 208, 0.566)',
                    mb: 1,
                    width: '18%',
                    borderRadius: 0,
                    fontWeight: 100,
                  }}
                  // onClick={() => handleButtonClick(appointments)}
                >
                  {fTime(appointments?.start_time)}
                </Button>
              </li>
            ))}
            <Button sx={{ mt: 1, bgcolor: 'success.main' }} variant="contained">
              Book
            </Button>
          </ul>
        </Box>
      ) : (
        <ul style={{ listStyle: 'none' }}>
          <h4 style={{ fontWeight: 600 }}>Today</h4>
          <li>
            <Button
              sx={{
                bgcolor: 'rgba(208, 208, 208, 0.566)',
                mb: 1,
                width: '18%',
                borderRadius: 0,
                fontWeight: 100,
              }}
            >
              -- / --
            </Button>
          </li>
        </ul>
      )}
    </Box>
  );
}

AppointmentOnline.propTypes = {
  Units: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};
