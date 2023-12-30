import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/appointmentTypes/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Appointment Types</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
