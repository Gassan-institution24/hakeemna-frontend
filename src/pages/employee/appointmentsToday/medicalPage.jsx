import { Helmet } from 'react-helmet-async';

import MediaclreportPage from 'src/sections/employee/appointmentsToday/medical-report-page';

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
