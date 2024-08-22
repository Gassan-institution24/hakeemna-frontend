import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { fDateAndTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGePrescription } from 'src/api';

import Iconify from 'src/components/iconify/iconify';

export default function OldmedicalrepotView() {
  const router = useRouter();

  const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { prescriptionData } = useGePrescription(id);
  console.log(prescriptionData, 'prescriptionData');

  const handleViewClick = () => {
    router.push(paths.dashboard.user.prescriptions);
  };

  // Get today's date
  const todayDate = fDateAndTime(new Date());

  return (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography sx={{ fontWeight: 600, p: 2}}>
        {t('Date')}:&nbsp; &nbsp;
        <span style={{ color: 'gray', fontWeight: 400 }}>{todayDate}</span>
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        {prescriptionData?.medicines?.map((info, i) => (
          <Box key={i} sx={{ border: '2px solid #2F99FF' }}>
            <Typography sx={{ fontWeight: 600, p: 2, textAlign: 'center' }}>
              <span style={{ color: 'gray', fontWeight: 400 }}>{fDateAndTime(prescriptionData?.created_at)}</span>
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('trade_name')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {info?.medicines?.trade_name}
              </span>{' '}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Start_time')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateAndTime(info?.Start_time)}
              </span>{' '}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('End_time')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>
                {fDateAndTime(info?.End_time)}
              </span>{' '}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Num_days')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>{info?.Num_days}</span>{' '}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Frequency_per_day')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>{info?.Frequency_per_day}</span>{' '}
            </Typography>
            <Typography sx={{ fontWeight: 600, p: 2 }}>
              {t('Doctor_Comments')}:&nbsp; &nbsp;
              <span style={{ color: 'gray', fontWeight: 400 }}>{info?.Doctor_Comments}</span>
            </Typography>
          </Box>
        ))}
      </Box>
      <Button onClick={() => handleViewClick()} variant="outlined" sx={{ mt: 2, width: '20%' }}>
        <Iconify icon="icon-park:back" />
        &nbsp; {t('Back')}
      </Button>
    </Stack>
  );
}
