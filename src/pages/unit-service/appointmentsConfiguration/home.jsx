import { Helmet } from 'react-helmet-async';

import AppointmentConfigHomeView from 'src/sections/unit-service/appointmentsConfiguration/view/home';

// ----------------------------------------------------------------------

export default function AppointmentConfigHomePage() {
  return (
    <>
      <Helmet>
        <title> Appointment Configurations</title>
      </Helmet>

       <AppointmentConfigHomeView />
    </>
  );
}
