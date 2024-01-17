import { Helmet } from 'react-helmet-async';

import AppointconfigDetailView from 'src/sections/employee/appoint-config/view/appoint-config-detail';

// ----------------------------------------------------------------------

export default function NewEmployeeAppointconfigPage() {
  return (
    <>
      <Helmet>
        <title> New Appointment Config</title>
      </Helmet>

        <AppointconfigDetailView/>
    </>
  );
}
