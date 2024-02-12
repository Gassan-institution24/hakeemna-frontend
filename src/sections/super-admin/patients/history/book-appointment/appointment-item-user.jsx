import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import Image from 'src/components/image/image';
import { useTranslate } from 'src/locales';
import EmptyContent from 'src/components/empty-content';
import { useGetAvailableAppointments, useGetUSFeedbackes, useGetUnitservices } from 'src/api';
import { fTime } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function AppointmentItem({ unitappointment, onBook, onView }) {
  const { t } = useTranslate();
  const { appointmentsData, refetch } = useGetAvailableAppointments(unitappointment?._id);
  const { unitservicesData } = useGetUnitservices();
  const { feedbackData } = useGetUSFeedbackes(unitappointment?._id);
  const kdk = (id) => {
    onBook(id);
  };
  console.log(feedbackData, 'dsd');
  return (
    <>
      {unitservicesData.map((info, su) => (
        <Box
          sx={{ display: 'flex', border: '1px solid rgba(208, 208, 208, 0.344)', width: '160%' }}
        >
          <Box sx={{ width: '55%', margin: 2 }}>
            <Box sx={{ display: 'flex' }}>
              <Image
                src={info?.company_logo}
                sx={{ width: '110px', height: '110px', borderRadius: '100%' }}
              />
              <Box sx={{ mt: 1, ml: 2 }}>
                <Typography sx={{ fontSize: 13 }}>{info?.name_english}</Typography>
                <Typography sx={{ fontSize: 13, color: 'grey' }}>
                  {info?.speciality?.name_english}
                </Typography>
                <Box sx={{ display: 'flex', mt: 0.7, ml: -0.3 }}>
                  <Iconify icon="emojione:star" />
                  &nbsp;
                  <Typography sx={{ fontSize: 13 }}>{info?.rate}</Typography>&nbsp;
                  <Typography sx={{ fontSize: 13 }}>(+100)</Typography>
                </Box>
                <Box sx={{ position: 'relative', left: '-10.1%' }}>
                  <ul style={{ listStyle: 'none' }}>
                    <li>
                      <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
                      {info?.country?.name_english} {info?.city?.name_english}
                    </li>
                    <li>
                      <Iconify
                        width={18}
                        sx={{ color: 'warning.main' }}
                        icon="mingcute:time-line"
                      />{' '}
                      Open 24h
                    </li>
                    <li>
                      <Iconify width={18} sx={{ color: 'success.main' }} icon="mdi:cash-multiple" />{' '}
                      Fees: 30 JOD (Does not include procedures){' '}
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

                    <Box sx={{ bgcolor: 'rgba(208, 208, 208, 0.566)', width: 350 }}>
                      <Box sx={{ padding: 2 }}>
                        <Typography>{feedback?.patient?.first_name}</Typography>
                        <Typography sx={{ border: '1px solid white', bgcolor:'white' }}>{feedback?.Body}</Typography>
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
            <EmptyContent filled title={t('No Data')} sx={{ borderRadius: '0' }} />
          )}
        </Box>
      ))}
    </>
  );
}

AppointmentItem.propTypes = {
  unitappointment: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};
