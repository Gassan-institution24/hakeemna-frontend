import { Helmet } from 'react-helmet-async';

import { BookingAppointment } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Booking() {
  return (
    <>
      <Helmet>
        <title> Dashboard: book</title>
      </Helmet>

      <BookingAppointment />
    </>
  );
}
