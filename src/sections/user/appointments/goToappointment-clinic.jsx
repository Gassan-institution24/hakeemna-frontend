import PropTypes from 'prop-types';
import { useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Pagination, { paginationClasses } from '@mui/material/Pagination';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

import { endpoints } from 'src/utils/axios';
import axiosHandler from 'src/utils/axios-handler';

import { useGetUnitservices } from 'src/api';

import ClinicAppointmentList from './appointment-clinic';

// ----------------------------------------------------------------------

export default function AppointmentItem({ patientData, refetch }) {
  const { unitservicesData, loading } = useGetUnitservices();
  // const router = useRouter();
  // const handleView = useCallback(
  //   (id) => {
  //     router.push(paths.dashboard.job.details(id));
  //   },
  //   [router]
  // );

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
      {!loading &&
        unitservicesData.map((info) => (
          <ClinicAppointmentList
            key={info.id}
            Units={info}
            patientData={patientData}
            onBook={handleBook}
            // onView={() => handleView(unitappointment?._id)}
          />
        ))}
    </>
  );
}

AppointmentItem.propTypes = {
  patientData: PropTypes.object,
  refetch: PropTypes.func,
};
