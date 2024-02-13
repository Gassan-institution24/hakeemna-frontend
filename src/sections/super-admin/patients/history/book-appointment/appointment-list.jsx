import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';

import AppointmentItem from './appointment-item';

// ----------------------------------------------------------------------

export default function AppointmentList({ patientData, appointments, refetch }) {
  const router = useRouter();

  const handleView = useCallback(
    (id) => {
      router.push(paths.dashboard.job.details(id));
    },
    [router]
  );
  const handleBook = useCallback(
    async (id) => {
      await axiosHandler({
        method: 'PATCH',
        path: `${endpoints.tables.appointment(id)}/book`,
        data: { patient: patientData._id },
      });
      refetch();
    },
    [patientData._id, refetch]
  );

  const handleEdit = useCallback(
    (id) => {
      router.push(paths.dashboard.job.edit(id));
    },
    [router]
  );

  const handleDelete = useCallback((id) => {
    console.info('DELETE', id);
  }, []);

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {appointments.map((appointment) => (
          <AppointmentItem
            key={appointment.id}
            appointment={appointment}
            onBook={() => handleBook(appointment._id)}
            onView={() => handleView(appointment._id)}
            onEdit={() => handleEdit(appointment._id)}
            onDelete={() => handleDelete(appointment._id)}
          />
        ))}
      </Box>

      {appointments.length > 8 && (
        <Pagination
          count={8}
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}

AppointmentList.propTypes = {
  appointments: PropTypes.array,
  patientData: PropTypes.object,
  refetch: PropTypes.func,
};
