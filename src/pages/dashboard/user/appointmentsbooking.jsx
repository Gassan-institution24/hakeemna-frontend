import { Helmet } from 'react-helmet-async';

import { UserAppointmentsBook } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  return (
    <>
      <Helmet>
        <title>Book Appointment</title>
      </Helmet>

      <UserAppointmentsBook />
    </>
  );
}
