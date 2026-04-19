import { Helmet } from 'react-helmet-async';

import RadiologyPage from 'src/sections/employee/appointmentsToday/radiology-page';

// ----------------------------------------------------------------------

export default function RadiologyPageview() {
  return (
    <>
      <Helmet>
        <title>record</title>
        <meta name="description" content="meta" />
      </Helmet>
      <RadiologyPage />
    </>
  );
}
