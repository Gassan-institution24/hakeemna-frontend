import { Helmet } from 'react-helmet-async';
import AppointmentHomeView from 'src/sections/employee/appointments/view/home'
// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  return (
    <>
      <Helmet>
        <title>Appointments</title>
      </Helmet>

      <AppointmentHomeView />
    </>
  );
}
