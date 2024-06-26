import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetMedRecordById } from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

export default function RecordPage() {
  const { t } = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();

  const { medRecord } = useGetMedRecordById(id);

  return (
    <Stack
      component={Card}
      spacing={3}
      sx={{ p: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
    >
      <Box>
        <Typography variant="h3">{medRecord?.patient?.name_english}</Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Date')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{fDateTime(medRecord?.created_at)}</span>
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Appointment in ')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {medRecord?.service_unit?.name_english}
          </span>
        </Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          <Iconify icon="icon-park:back" />
          &nbsp; {t('Back')}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        <Image src={medRecord?.patient?.profile_picture} sx={{ m: 1 }} />
      </Box>
    </Stack>
  );
}
