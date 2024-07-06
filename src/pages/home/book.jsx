import { Helmet } from 'react-helmet-async';

import BookAppointment from 'src/sections/home/view/book-appointment';
// ----------------------------------------------------------------------

export default function BookAppointmentPage() {
  return (
    <>
      <Helmet>
        <title>book an appointment</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BookAppointment />
    </>
  );
}
