import { Helmet } from 'react-helmet-async';

import RecordPage from 'src/sections/employee/appointmentsToday/recordPage';

// ----------------------------------------------------------------------

export default function AppointmentsForToday() {
  return (
    <>
      <Helmet>
        <title>record</title>
        <meta name="description" content="meta" />
      </Helmet>
      <RecordPage />
    </>
  );
}
