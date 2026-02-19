import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/medication/medication_edit';
// ----------------------------------------------------------------------
export default function MedicationEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medication edit</title>
        <meta name="description" content="meta" />
      </Helmet>
      <TableCreateView />
    </>
  );
}