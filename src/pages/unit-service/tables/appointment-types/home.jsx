import { Helmet } from 'react-helmet-async';

import AppointmentTypesHomeView from 'src/sections/unit-service/tables/appointment-types/view/home';

// ----------------------------------------------------------------------

export default function AppointmentTypesHomePage() {
  return (
    <>
      <Helmet>
        <title>Appointment Types</title>
      </Helmet>

      <AppointmentTypesHomeView />
    </>
  );
}
