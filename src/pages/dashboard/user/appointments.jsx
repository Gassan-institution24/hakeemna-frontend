import { Helmet } from 'react-helmet-async';

import { UserAppointmentsPage } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  return (
    <>
      <Helmet>
        <title>Appointment</title>
      </Helmet>

      <UserAppointmentsPage />
    </>
  );
}
