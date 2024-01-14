import { Helmet } from 'react-helmet-async';

import { Emergency } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function EmergencyStatus() {
  return (
    <>
      <Helmet>
        <title>Emergency</title>
      </Helmet>

      <Emergency />
    </>
  );
}
