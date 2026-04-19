import { Helmet } from 'react-helmet-async';

import PrescriotionPage from 'src/sections/employee/appointmentsToday/prescription-page';

// ----------------------------------------------------------------------

export default function PrescriotionPageview() {
  return (
    <>
      <Helmet>
        <title>record</title>
        <meta name="description" content="meta" />
      </Helmet>
      <PrescriotionPage />
    </>
  );
}
