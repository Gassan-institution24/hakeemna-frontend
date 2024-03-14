import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import { useParams } from 'src/routes/hooks';

import { useGetEmployeeEngsBySpecialty } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DoctorCard from './doctorCard';

export default function AppointmetClinic({ doc }) {
  const params = useParams();
  const { id } = params;
  const { loading } = useGetEmployeeEngsBySpecialty(id);
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'column', md: '1fr 1fr' } }}>
      {doc?.map((info, forkey) => (
        <DoctorCard key={forkey} info={info} />
      ))}
    </Box>
  );
}
AppointmetClinic.propTypes = {
  doc: PropTypes.object,
};
