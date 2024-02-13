import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';

import AppointmentItem from './appointment-item-user';

// ----------------------------------------------------------------------

export default function AppointmentList({ patientData, Units, refetch }) {
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
        data: { patient: patientData },
      });
      refetch();
    },
    [patientData, refetch]
  );

  return (
    <>
      <Box
      >
        {Units.map((unitappointment) => (
          <AppointmentItem
            key={unitappointment.id}
            unitappointment={unitappointment}
            onBook={handleBook}
            onView={() => handleView(unitappointment?._id)}
          />
        ))}
      </Box>

      {Units.length > 8 && (
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
  Units: PropTypes.array,
  patientData: PropTypes.object,
  refetch: PropTypes.func,
};
