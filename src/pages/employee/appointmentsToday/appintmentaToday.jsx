import { Helmet } from 'react-helmet-async';

import AppointmentsToday from 'src/sections/employee/appointmentsToday/appointmentsToday'

// ----------------------------------------------------------------------

export default function AppointmentsForToday() {
  return (
    <>
      <Helmet>
        <title>appointmentsToday</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentsToday />
    </>
  );
}
