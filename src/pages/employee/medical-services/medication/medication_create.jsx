import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/medication/medication_create';

// ----------------------------------------------------------------------
export default function MedicationCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medication create</title>
        <meta name="description" content="meta" />
      </Helmet>
      <TableCreateView />
    </>
  );
}
