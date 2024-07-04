import { Helmet } from 'react-helmet-async';

import Patients from 'src/sections/home/view/patients';
// ----------------------------------------------------------------------

export default function patients() {
  return (
    <>
      <Helmet>
        <title>Beneficiaries</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Patients />
    </>
  );
}
