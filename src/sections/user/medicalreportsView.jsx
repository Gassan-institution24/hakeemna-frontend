import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { fDateAndTime } from 'src/utils/format-time';

import { useGetOnemedicalreports } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';

export default function MedicalrepotView() {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const params = useParams();
  const { id } = params;
  const { medicalreports } = useGetOnemedicalreports(id);

  const handleViewClick = () => {
    router.push(paths.dashboard.user.medicalreports);
  };
  return (
    <Stack
      component={Card}
      spacing={3}
      sx={{ p: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
    >
      <Box>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Dr.')}&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {curLangAr
              ? medicalreports?.employee?.name_arabic
              : medicalreports?.employee?.name_english}
          </span>{' '}
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('description')}: &nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{medicalreports?.description}</span>
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Date')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {fDateAndTime(medicalreports?.entrance_mangament?.Appointment_date)}
          </span>
        </Typography>
        <Button onClick={() => handleViewClick()} variant="outlined" sx={{ mt: 2 }}>
          <Iconify icon="icon-park:back" />
          &nbsp; {t('Back')}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        {medicalreports?.file?.map((img) => (
          <Image src={img} sx={{ m: 1 }} />
        ))}
      </Box>
    </Stack>
  );
}
