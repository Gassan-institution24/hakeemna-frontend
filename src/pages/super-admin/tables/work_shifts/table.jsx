import { Helmet } from 'react-helmet-async';

import { WorkShiftsTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Unit Services Types Table</title>
      </Helmet>

      <WorkShiftsTableView />
    </>
  );
}
