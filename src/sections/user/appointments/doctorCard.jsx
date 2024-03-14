import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDm, fTime } from 'src/utils/format-time';

import { useGetNearstAppointment } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';


export default function DoctorCard({ info }) {
  const { nearstappointment } = useGetNearstAppointment(info?._id);
// console.log(info);
  const router = useRouter();
  const handleViewRow = (ids) => {
    router.push(paths.dashboard.user.doctorpage(ids));
  };

  return (
    <Box
      sx={{
        margin: 5,
        padding: 2,
        borderRadius: 2,
        display: 'flex',
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
      <Box sx={{ mr: 4 }}>
        <Box sx={{ display: 'inline-flex' }}>
          <Typography sx={{ fontSize: 13 }}>Dr.</Typography>&nbsp;
          <Typography sx={{ fontSize: 13 }}>{info?.employee?.first_name}</Typography>&nbsp;
          <Typography sx={{ fontSize: 13 }}>{info?.employee?.family_name}</Typography>
        </Box>
        <Typography sx={{ fontSize: 12, color: 'grey' }}>
          {info?.employee?.speciality?.name_english}
        </Typography>
        <Box sx={{ position: 'relative', left: '-0.1%', mt: 1 }}>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} icon="openmoji:hospital" />{' '}
            <span style={{ position: 'relative', top: -3 }}>
              {info?.unit_service?.name_english}
            </span>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
            <span style={{ position: 'relative', top: -3 }}>
              {info?.unit_service?.city?.name_english} - {info?.unit_service?.country?.name_english}
            </span>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} icon="flat-color-icons:cell-phone" />{' '}
            <span style={{ position: 'relative', top: -3 }}>{info?.unit_service?.phone}</span>
          </Typography>
        </Box>
      </Box>

      <Box>
        <Typography sx={{ fontSize: 14, mb: 1 }}>Nearst appointments: </Typography>
        {nearstappointment ? (
          <Button
            sx={{ bgcolor: 'rgb(231, 231, 231)', borderRadius: 0 }}
            onClick={() => handleViewRow(info?._id)}
          >
            <Typography sx={{ fontSize: 14 }}>{`${fDm(nearstappointment?.start_time)} - ${fTime(
              nearstappointment?.start_time
            )}`}</Typography>
          </Button>
        ) : (
          <Button disabled sx={{ fontSize: 13 }}>
            -- / --
          </Button>
        )}

        <Button
          // sx={{ fontSize: 13 }}
          sx={{ mt: 3, display: 'block' }}
          variant="contained"
          color="success"
          onClick={() => handleViewRow(info?._id)}
        >
          View all
        </Button>
      </Box>

      {/*  */}
    </Box>
  );
}

DoctorCard.propTypes = {
  info: PropTypes.object,
};
