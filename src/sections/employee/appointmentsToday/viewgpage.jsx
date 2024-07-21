import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetOneEntranceManagement } from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';
// ----------------------------------------------------------------------

export default function ViewPage() {
  const { t } = useTranslate();
  const { id } = useParams();
  const router = useRouter();

  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const handleBackClick = () => {
    router.push(paths.employee.appointmentsToday);
  };
  return (
    <Stack
      component={Card}
      spacing={3}
      sx={{ p: 3, display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
    >
      <Box>
        <Typography variant="h3">{Entrance?.patient?.name_english}</Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Date')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{fDateTime(Entrance?.created_at)}</span>
        </Typography>
        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Appointment in ')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>
            {Entrance?.service_unit?.name_english}
          </span>
        </Typography>

        <Typography sx={{ fontWeight: 600, p: 2 }}>
          {t('Note')}:&nbsp; &nbsp;
          <span style={{ color: 'gray', fontWeight: 400 }}>{Entrance?.patient_note}</span>
        </Typography>

        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => handleBackClick()}>
          <Iconify icon="icon-park:back" />
          &nbsp; {t('Back')}
        </Button>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        <Image src={Entrance?.patient?.profile_picture} sx={{ m: 1 }} />
      </Box>
    </Stack>
  );
}
