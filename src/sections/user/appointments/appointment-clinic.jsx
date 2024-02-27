import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

// import { useTranslate } from 'src/locales';
import { useGetEmployeeBySpecialty } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import { LoadingScreen } from 'src/components/loading-screen';

export default function AppointmetClinic({ onBook, onView }) {
  // const { t } = useTranslate();
  // const { feedbackData } = useGetUSFeedbackes(Units._id);
  const params = useParams();

  const { id } = params;
  const { data, loading } = useGetEmployeeBySpecialty(id);
  const router = useRouter();
  console.log(data);
  const handleViewRow = (ids) => {
    router.push(paths.dashboard.user.doctorpage(ids));
  };

  // const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient._id));
  // const numberOfUsers = uniqueUserIds.size;

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {data?.map((info, forkey) => (
        <Box
          key={forkey}
          sx={{
            margin: 5,
            padding: 2,
            width: { md: '50%', xs: '80%' },
            borderRadius: 2,
            display: 'flex',
            flexDirection: { md: 'row', xs: 'row' },
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            gap: 1,
          }}
        >
          <Box>
            <Image
              src={info?.employee?.picture}
              sx={{
                width: '100px',
                height: '100%',
                borderRight: '2px lightgray dashed',
                display: { md: 'block', xs: 'none' },
              }}
            />
          </Box>
          {/*  */}
          <Box>
            <Box sx={{ display: 'inline-flex' }}>
              <Typography sx={{ fontSize: 13 }}>Dr.</Typography>&nbsp;
              <Typography sx={{ fontSize: 13 }}>{info?.employee?.first_name}</Typography>&nbsp;
              <Typography sx={{ fontSize: 13 }}>{info?.employee?.family_name}</Typography>
            </Box>
            <Typography sx={{ fontSize: 13, color: 'grey' }}>
              {info?.employee?.speciality?.name_english}
            </Typography>
            <Box sx={{ position: 'relative', left: '-0.1%', mt: 1 }}>
              <Typography>
                <Iconify width={18} sx={{ color: 'info.main' }} icon="openmoji:hospital" />{' '}
                {info?.unit_service?.name_english}
              </Typography>
              <Typography>
                <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
                {info?.unit_service?.address}
              </Typography>
            </Box>
          </Box>
          {/* sx={{ position:'relative',left:35 }} */}
          <Box >
            <Typography sx={{ fontSize: 13, float: 'right', clear: 'both' }}>
              Nearst appointments:{' '}
            </Typography>
            <Typography>12:00</Typography>
            <Button
              // sx={{ float: 'right', clear: 'both' }}
              sx={{mt:3}}
              variant="contained"
              color="success"
              onClick={() => handleViewRow(info?._id)}
            >
              View all
            </Button>
          </Box>

          {/*  */}
        </Box>
      ))}
    </Box>
  );
}

AppointmetClinic.propTypes = {
  onView: PropTypes.func,
  onBook: PropTypes.func,
};
