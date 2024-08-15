import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDm, fTime } from 'src/utils/format-time';

import { useGetNearstAppointment } from 'src/api';
import { useLocales,useTranslate,  } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';

export default function DoctorCard({ info }) {
  const { nearstappointment } = useGetNearstAppointment(info?._id);
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
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
          <Typography sx={{ fontSize: 13 }}>{t('Dr.')}</Typography>&nbsp;
          <Typography sx={{ fontSize: 13 }}>
            {curLangAr ? info?.employee?.name_arabic : info?.employee?.name_english}
          </Typography>
          &nbsp;
        </Box>
        {info?.employee?.languages?.map((language, index) => (
          <Typography sx={{ fontSize: 13, display: 'inline' }} key={index}>
            {language}&nbsp;
          </Typography>
        ))}
        <Typography sx={{ fontSize: 11, color: 'grey' }}>
          {curLangAr
            ? info?.employee?.speciality?.name_arabic
            : info?.employee?.speciality?.name_english}{' '}
          /{' '}
          {curLangAr
            ? info?.employee?.sub_speciality?.name_arabic
            : info?.employee?.sub_speciality?.name_english}
        </Typography>
        <Box sx={{ position: 'relative', left: '-0.1%', mt: 1 }}>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} icon="openmoji:hospital" />{' '}
            <span style={{ position: 'relative', top: -3 }}>
              {curLangAr ? info?.unit_service?.name_arabic : info?.unit_service?.name_english}
            </span>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
            <span style={{ position: 'relative', top: -3 }}>
              {curLangAr
                ? info?.unit_service?.city?.name_arabic
                : info?.unit_service?.city?.name_english}{' '}
              -{' '}
              {curLangAr
                ? info?.unit_service?.country?.name_arabic
                : info?.unit_service?.country?.name_english}
            </span>
          </Typography>
          <Typography sx={{ fontSize: 13 }}>
            <Iconify width={18} icon="flat-color-icons:cell-phone" />{' '}
            <span style={{ position: 'relative', top: -3 }}>{info?.unit_service?.phone}</span>
          </Typography>
        </Box>
      </Box>
      {info?.visibility_online_appointment === true ? (
        <Box>
          <Typography sx={{ fontSize: 14, mb: 1 }}>{t('Nearst appointments:')} </Typography>
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
            {t('View all')}
          </Button>
        </Box>
      ) : (
        <Box>
          <Typography sx={{ fontSize: 14, mb: 1 }}>
            {t('Not available to book')} <br /> {t('an appointment online')}
          </Typography>
          <Button
            sx={{ mt: 3, display: 'block' }}
            variant="contained"
            color="success"
            // onClick={() => handleViewRow(info?._id)}
          >
            {info?.unit_service?.phone}
          </Button>
        </Box>
      )}
    </Box>
  );
}

DoctorCard.propTypes = {
  info: PropTypes.object,
};
