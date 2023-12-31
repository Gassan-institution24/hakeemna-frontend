import { Helmet } from 'react-helmet-async';

import { Medicalreports } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Medicalreport() {
  return (
    <>
      <Helmet>
        <title>Medical Reports</title>
      </Helmet>

      <Medicalreports />
    </>
  );
}
