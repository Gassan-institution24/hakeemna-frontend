import { Helmet } from 'react-helmet-async';

import SickLeave from 'src/sections/employee/appointmentsToday/sickleavePage';

// ----------------------------------------------------------------------

export default function SickleavePageview() {
  return (
    <>
      <Helmet>
        <title>sickleave</title>
        <meta name="description" content="meta" />
      </Helmet>
      <SickLeave />
    </>
  );
}
