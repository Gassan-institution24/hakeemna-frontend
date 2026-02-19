import { Helmet } from 'react-helmet-async';

import TableMedicationView from 'src/sections/employee/medical-services/medication/medication_view';

// ----------------------------------------------------------------------
export default function MedicationViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medicine details</title>
        <meta name="description" content="meta" />
      </Helmet>
      <TableMedicationView />
    </>
  );
}
