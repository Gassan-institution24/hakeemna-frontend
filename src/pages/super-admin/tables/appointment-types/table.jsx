import { Helmet } from 'react-helmet-async';

import AppointmentTypesTableView from 'src/sections/super-admin/tables/view/appointypes-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Appointment Types Table</title>
      </Helmet>

      <AppointmentTypesTableView />
    </>
  );
}
