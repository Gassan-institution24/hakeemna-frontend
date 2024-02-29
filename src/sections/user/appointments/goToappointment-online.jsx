import PropTypes from 'prop-types';
import { useCallback } from 'react';

// import Box from '@mui/material/Box';
// import Pagination, { paginationClasses } from '@mui/material/Pagination';

// import { paths } from 'src/routes/paths';
// import { useRouter } from 'src/routes/hooks';

import axiosInstance,{ endpoints } from 'src/utils/axios';

import { useGetUnitservices } from 'src/api';

import OnlineAppointmentList from './appointment-online';

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
      await axiosInstance.patch(`${endpoints.tables.appointment(id)}/book`,
        { patient: patientData },
      );
      refetch();
    },
    [patientData, refetch]
  );
  return (
    <>
      {!loading &&
        unitservicesData.map((info) => (
          <OnlineAppointmentList
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
