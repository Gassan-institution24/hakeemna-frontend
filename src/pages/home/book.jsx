import { Helmet } from 'react-helmet-async';

import BookAppointment from 'src/sections/home/view/book-appointment';
// ----------------------------------------------------------------------

export default function BookAppointmentPage() {
  return (
    <>
      <Helmet>
        <title>Hakeemna 360 - منصة حكيمنا الطبية :book an appointment</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BookAppointment />
    </>
  );
}
