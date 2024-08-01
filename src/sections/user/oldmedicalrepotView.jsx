import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

// import { fDate } from 'src/utils/format-time';
import { fDateAndTime } from 'src/utils/format-time';

import { useGetOneoldmedicalreports } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';

export default function OldmedicalrepotView() {
  const router = useRouter();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const params = useParams();
  const { id } = params;
  const { oldmedicalreports } = useGetOneoldmedicalreports(id);

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
          {t('File Name')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{oldmedicalreports?.name}</span>{' '}
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Specialty')}: &nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {curLangAr
              ? oldmedicalreports?.specialty.name_arabic
              : oldmedicalreports?.specialty.name_english}
          </span>
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Date')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {fDateAndTime(oldmedicalreports?.date)}
          </span>
        </Typography>
        {oldmedicalreports?.note && (
          <Typography sx={{ fontWeight: 600, p: 2 }}>
            {t('Note')}:&nbsp; &nbsp;
            <span style={{ color: 'gray', fontWeight: 400 }}>{oldmedicalreports?.note}</span>
          </Typography>
        )}
        <Button onClick={() => handleViewClick()} variant="outlined" sx={{ mt: 2 }}>
          <Iconify icon="icon-park:back" />
          &nbsp; {t('Back')}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        {oldmedicalreports?.file?.map((img) => (
          <Image
            src={`https://api.hakeemna.com/uploaded-files/patients/old_medical_reports/${img}`}
            //  src={`http://localhost:3000/uploaded-files/patients/old_medical_reports/${img}`}
            sx={{ m: 1 }}
          />
        ))}
      </Box>
    </Stack>
  );
}
