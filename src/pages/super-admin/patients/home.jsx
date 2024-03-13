import { Helmet } from 'react-helmet-async';

import PatientsView from 'src/sections/super-admin/patients/home/homepage';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Patients</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PatientsView />
    </>
  );
}
