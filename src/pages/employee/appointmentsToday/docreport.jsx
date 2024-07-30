import { Helmet } from 'react-helmet-async';

import Docreport from 'src/sections/employee/appointmentsToday/doctorReportPage';

// ----------------------------------------------------------------------

export default function DocreportPageview() {
  return (
    <>
      <Helmet>
        <title>Docreport</title>
        <meta name="description" content="meta" />
      </Helmet>
      <Docreport />
    </>
  );
}
