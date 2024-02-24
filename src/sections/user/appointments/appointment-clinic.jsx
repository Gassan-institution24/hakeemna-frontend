import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetEmployeeBySpecialty } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import { LoadingScreen } from 'src/components/loading-screen';

  export default function AppointmetClinic({ Units, onBook, onView }) {
  const { t } = useTranslate();
  // const { feedbackData } = useGetUSFeedbackes(Units._id);
  const params = useParams();

  const { id } = params;
  const { data,loading } = useGetEmployeeBySpecialty(id);
  const router = useRouter();
  console.log(data);
  const handleViewRow = (ids) => {
    router.push(paths.dashboard.user.doctorpage(ids));
  };

  // const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient._id));
  // const numberOfUsers = uniqueUserIds.size;

  if(loading){
    return <LoadingScreen/>
  }
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
          <Box sx={{ ml: -6 }}>
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
                {/* <Typography sx={{ fontSize: 13, mt: 0.3 }}>{Units?.rate}</Typography>&nbsp;
                <Typography sx={{ fontSize: 13, mt: 0.3 }}>
                  {t('From ')} {numberOfUsers <= 1 ? '' : numberOfUsers}{' '}
                  {numberOfUsers > 1 ? t('Visitors') : t('One Visitor')}{' '}
                </Typography> */}
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
            sx={{ width: '150px', height: '45px', position: 'relative', left: 1, top: 138 }}
            variant="contained"
            color="success"
            onClick={() => handleViewRow(info?._id)}
          >
            Book appointment
          </Button>
        </Box>
      ))}
    </Box>
  );
};

AppointmetClinic.propTypes = {
  Units: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};

