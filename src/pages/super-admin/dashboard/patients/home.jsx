import { Helmet } from 'react-helmet-async';

import PatientsView from 'src/sections/patients/home/homepage';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Patients</title>
      </Helmet>

      <PatientsView />
    </>
  );
}
