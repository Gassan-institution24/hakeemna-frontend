import React from 'react';

import Box from '@mui/material/Box';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeBySpecialty } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DoctorCard from './doctorCard';

export default function AppointmetClinic() {
  const params = useParams();

  const { id } = params;
  const { data, loading } = useGetEmployeeBySpecialty(id);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
      {data?.map((info, forkey) => (
        <DoctorCard key={forkey} info={info} />
      ))}
    </Box>
  );
}
