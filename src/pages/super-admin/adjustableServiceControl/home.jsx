import { Helmet } from 'react-helmet-async';

import AdjustableService from 'src/sections/super-admin/adjustableSeervicesControl/home';

// ----------------------------------------------------------------------

export default function AdjustableServicePage() {
  return (
    <>
      <Helmet>
        <title> Adjustable service</title>
      </Helmet>
      <AdjustableService />
    </>
  );
}
