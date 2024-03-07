import React from 'react';
import PropTypes from 'prop-types';

import { Box, Stack } from '@mui/system';
import { Card, Divider, Typography } from '@mui/material';

import { fMonth } from 'src/utils/format-time';

import { useGetPatientInsurance } from 'src/api';

import Iconify from 'src/components/iconify';

export default function InsurancePage({ userId }) {
  // const params = useParams();

  // const { id } = params;
  const { patientInsuranseData } = useGetPatientInsurance(userId);
  console.log(patientInsuranseData);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns:'1fr 1fr', }}>
      {patientInsuranseData?.map((info, key) => (
        <Card key={key} sx={{ borderRadius: 0, border:'1px solid lightgray', width: '90%',mb:5 }}>
          <Stack sx={{ p: 3, pb: 2 }}>
            <Typography>{info?.insurance?.name_english}</Typography>

            <Typography>
              {info?.patient?.first_name} {info?.patient?.last_name}{' '}
            </Typography>
            <Typography>{info?.type?.Coverage_name} </Typography>

            <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
              Ex: {fMonth(info?.insurance_expiry_time)}
            </Stack>
            <Stack
              spacing={0.5}
              direction="row"
              alignItems="center"
              sx={{ color: 'primary.main', typography: 'caption' }}
            >
              <Iconify width={16} icon="ic:baseline-tag" />
              {info.code}
            </Stack>
          </Stack>
          <Divider sx={{ borderWidth: 10, borderColor: 'success.main', borderStyle: 'solid' }} />
        </Card>
      ))}
    </Box>
  );
}
InsurancePage.propTypes = {
  userId: PropTypes.object,
};
