import { Helmet } from 'react-helmet-async';

import ImagingsTableView from 'src/sections/super-admin/tables/view/doctors-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Doctors Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ImagingsTableView />
    </>
  );
}
