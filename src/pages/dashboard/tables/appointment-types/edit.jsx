import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/appointmentTypes/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Appointment Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
