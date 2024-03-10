import React from 'react';

import { Box } from '@mui/system';
import { Card, Typography } from '@mui/material';

import { fMonth } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientInsurance } from 'src/api';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';

export default function InsurancePage() {
  const { user } = useAuthContext();

  const { patientInsuranseData } = useGetPatientInsurance(user?.patient?._id);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {patientInsuranseData?.map((info, key) => (
        <Card key={key} sx={{ borderRadius: 1, width: '75%', mb: 5, bgcolor: '#64a3aa' }}>
          <Box
            sx={{
              bgcolor: '#ddf0ee',
              borderRadius: 1,
              width: '100%',
              padding: 0.7,
              margin: 1.5,
              position: 'relative',
              display: 'inline-flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Iconify sx={{ color: '#64a3aa' }} icon="akar-icons:health" /> &nbsp;&nbsp;
            <Typography sx={{ color: '#64a3aa', fontWeight: 600, fontSize: 16 }}>
              Insurance Card
            </Typography>
          </Box>
          <Box sx={{ display: { md: 'flex', xs: 'block' }, margin: 1, gap: 2 }}>
            <Image
              src={info?.patient?.profile_picture}
              sx={{ width: '100px', height: '135px', mb: 1 }}
            />
            <Box>
              <Box sx={{ mb: 1 }}>
                <Typography>{info?.insurance?.name_english}</Typography>
                <Typography>
                  {info?.patient?.first_name} {info?.patient?.last_name}
                </Typography>
                <Typography>{info?.type?.Coverage_name}</Typography>
                <Typography> Ex: {fMonth(info?.insurance_expiry_time)}</Typography>
              </Box>

              <Image
                src="https://static.vecteezy.com/system/resources/previews/022/722/106/non_2x/barcode-qr-code-transparent-free-free-png.png"
                sx={{ width: '200px', height: '30px', ml: -1.9 }}
              />
            </Box>
            <Iconify
              icon="mi:options-vertical"
              sx={{
                position: 'relative',
                right: -75,
                color: '#ddf0ee',
                '&:hover': {
                  color: 'black',
                },
              }}
              width={23}
            />
          </Box>
        </Card>
      ))}
    </Box>
  );
}
