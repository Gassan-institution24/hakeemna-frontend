import { useNavigate } from 'react-router';

import Card from '@mui/material/Card';
import { Box, Stack } from '@mui/system';
import { Button, Divider, Typography } from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { fDateTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetMedRecord, useGetOneEntranceManagement } from 'src/api';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

export default function RecordPage() {
  const { t } = useTranslate();
  const { id } = useParams();
  const navigate = useNavigate();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { medRecord } = useGetMedRecord(Entrance?.service_unit?._id, Entrance?.patient?._id);
  console.log(medRecord);
  return (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flex: 1, mr: 1 }}>
          <Typography variant="h3">{medRecord[0]?.patient?.name_english}</Typography>
          <Typography sx={{ fontWeight: 600, p: 2 }}>The clinics private medical file</Typography>
          <Typography sx={{ fontWeight: 600, p: 2 }}>
            In this file, all appointment procedures added by the doctor are displayed
          </Typography>
        </Box>
        <Image
          src="https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/tsah7c9evnal289z5fig/IMG%20Worlds%20of%20Adventure%20Admission%20Ticket%20in%20Dubai%20-%20Klook.jpg"
          sx={{
            mr: 5,
            mt: 2,
            width: '200px',
            height: '250px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            border: 1,
          }}
        />
      </Box>
      <Divider />
      {medRecord?.map((info, index) => (
        <Box key={index} sx={{ my: 2 }}>
          {info?.doctor_report?.map((doctorReport, i) => (
            <Box key={`doctorReport-${i}`}>
              <Typography variant="h3">
                Doctor Report{' '}
                <span style={{ fontSize: 12, color: 'gray' }}>{fDateTime(info?.created_at)}</span>{' '}
              </Typography>
              <Typography>{doctorReport?.description}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
                <Image src={doctorReport?.file} sx={{ m: 1 }} />
              </Box>
            </Box>
          ))}
          {info?.medical_report?.map((medicalReport, i) => (
            <Box key={`medicalReport-${i}`}>
              <Typography variant="h3">
                Medical Report{' '}
                <span style={{ fontSize: 12, color: 'gray' }}> {fDateTime(info?.created_at)}</span>{' '}
              </Typography>
              <Typography>{medicalReport?.description}</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
                <Image src={medicalReport?.file} sx={{ m: 1 }} />
              </Box>
            </Box>
          ))}
          {info?.Drugs_report?.map((drugsReport, i) => (
            <Box key={`drugsReport-${i}`}>
              <Typography variant="h3">
                Prescription{' '}
                <span style={{ fontSize: 12, color: 'gray' }}>{fDateTime(info?.created_at)}</span>{' '}
              </Typography>
              <Typography>{drugsReport?.medicines?.trade_name}</Typography>
              <Typography>{drugsReport?.Frequency_per_day}</Typography>
              <Typography>{drugsReport?.Num_days}</Typography>
              <Typography>{drugsReport?.Doctor_Comments}</Typography>
            </Box>
          ))}
        </Box>
      ))}

      <Button
        variant="outlined"
        sx={{ mt: 2, width: { md: '10%', xs: '100%' } }}
        onClick={() => navigate(-1)}
      >
        <Iconify icon="icon-park:back" />
        &nbsp; {t('Back')}
      </Button>
    </Stack>
  );
}
