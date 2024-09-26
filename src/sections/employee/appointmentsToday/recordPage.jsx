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
  const { medRecord } = useGetMedRecord(
    Entrance?.service_unit?._id,
    Entrance?.patient?._id,
    Entrance?.unit_service_patient
  );
  return (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ flex: 1, mr: 1 }}>
          <Typography variant="h3">{medRecord?.[0]?.patient?.name_english}</Typography>

          <Typography sx={{ fontWeight: 600, p: 2 }}>
            In this file, all appointment procedures added by the doctor are displayed
          </Typography>
        </Box>
        <Image
          src={medRecord?.[0]?.patient?.profile_picture}
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
        <>
          <Box key={index} sx={{ my: 2 }}>
            <Typography variant="h3">
              {' '}
              <mark>{fDateTime(info?.created_at)}</mark>{' '}
            </Typography>{' '}
            <br />
            {info?.doctor_report?.map(
              (doctorReport, i) =>
                doctorReport && (
                  <Box key={`doctorReport-${i}`}>
                    <Typography variant="h4">Patient record </Typography>
                    <Typography sx={{ color: 'gray' }}>{doctorReport?.description}</Typography>
                    <Box
                      sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
                    >
                      <Image src={doctorReport?.file} sx={{ m: 1 }} />
                    </Box>
                  </Box>
                )
            )}
            {info?.medical_report?.map(
              (medicalReport, i) =>
                medicalReport && (
                  <Box key={`medicalReport-${i}`}>
                    <Typography variant="h4">Medical Report </Typography>
                    <Typography sx={{ color: 'gray' }}>{medicalReport?.description}</Typography>
                    <Box
                      sx={{ display: 'grid', gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}
                    >
                      <Image src={medicalReport?.file} sx={{ m: 1 }} />
                    </Box>
                  </Box>
                )
            )}
            {info?.Drugs_report?.map(
              (drugsReport, i) =>
                drugsReport && (
                  <Box key={`drugsReport-${i}`}>
                    <Typography variant="h4">Prescription </Typography>
                    <Typography sx={{ color: 'gray' }}>
                      {drugsReport?.medicines?.trade_name}
                    </Typography>
                    <Typography sx={{ color: 'gray' }}>{drugsReport?.Frequency_per_day}</Typography>
                    <Typography sx={{ color: 'gray' }}>{drugsReport?.Num_days}</Typography>
                    <Typography sx={{ color: 'gray' }}>{drugsReport?.Doctor_Comments}</Typography>
                  </Box>
                )
            )}
          </Box>
          <Divider sx={{ border: '1px solid lightgray' }} />
        </>
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
