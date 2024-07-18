import { Helmet } from 'react-helmet-async';

import MediaclreportPage from 'src/sections/employee/appointmentsToday/medicalreportPage';

// ----------------------------------------------------------------------

export default function MediaclreportPageview() {
  return (
    <>
      <Helmet>
        <title>record</title>
        <meta name="description" content="meta" />
      </Helmet>
      <MediaclreportPage />
    </>
  );
}
