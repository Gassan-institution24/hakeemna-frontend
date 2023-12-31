import { Helmet } from 'react-helmet-async';

import AppointmentsHomeView from 'src/sections/unit-service/appointments/view/home';

// ----------------------------------------------------------------------

export default function AppointmentsHomePage() {
  return (
    <>
      <Helmet>
        <title>Appointments</title>
      </Helmet>

      <AppointmentsHomeView />
    </>
  );
}
