import PropTypes from 'prop-types';
import { useState,useEffect } from 'react';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientOneAppointments } from 'src/api';

import EmptyContent from 'src/components/empty-content';

import WatingRoomDialog from './waitingRoomDialog';
// ----------------------------------------------------------------------

export default function WatingRoom({ employeeId }) {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientOneAppointments(user?.patient?._id);
  const [hasFeedback, setHasFeedback] = useState();

  useEffect(() => {
    if (!appointmentsData?.hasFeedback) {
      setHasFeedback(true);
    }
  }, [appointmentsData]);
console.log(appointmentsData );
  return hasFeedback ? <WatingRoomDialog employeesData={employeeId} /> : <EmptyContent/>
}

WatingRoom.propTypes = {
  employeeId: PropTypes.object,
};
