import { Helmet } from 'react-helmet-async';

import Medication from 'src/sections/employee/medical-services/medication/medication';

// ----------------------------------------------------------------------

export default function MedicationPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medicines</title>
        <meta name="description" content="meta" />
      </Helmet>
      <Medication />
    </>
  );
}
