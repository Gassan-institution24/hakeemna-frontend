import { Button, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUSEmployeeEngs, useGetPatientOneAppointments } from 'src/api';

import WatingRoomDialog from './watingRoomDialog';
// ----------------------------------------------------------------------

export default function WatingRoom() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientOneAppointments(user?.patient?._id);
  const { employeesData } = useGetUSEmployeeEngs(appointmentsData?.unit_service?._id);
  console.log(appointmentsData, 'appointmentsData');
  const today = new Date();
  console.log(today, 'today');

  return appointmentsData?.hasFeedback === false && today > appointmentsData?.start_time ? (
    employeesData?.map((info, index) => <WatingRoomDialog employeesData={info} key={index} />)
  ) : (
    <>
      <Typography>Are you coming?</Typography>
      <Button
        variant="contained"
        sx={{ bgcolor: 'success.main', width: '100px', mb: 3 }}
        onClick={() => {
          alert('ok');
        }}
      >
        yes
      </Button>
      <Button
        variant="contained"
        sx={{ bgcolor: 'success.main', width: '100px' }}
        onClick={() => {
          alert('ok');
        }}
      >
        no
      </Button>
    </>
  );
}
