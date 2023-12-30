import { Helmet } from 'react-helmet-async';

import AddPatient from 'src/sections/super-admin/patients/add/add-patient';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Add Patient</title>
      </Helmet>

      <AddPatient />
    </>
  );
}
