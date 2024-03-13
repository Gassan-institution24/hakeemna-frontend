import { Helmet } from 'react-helmet-async';

import SymptomsTableView from 'src/sections/super-admin/tables/view/symptoms-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Symptoms Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <SymptomsTableView />
    </>
  );
}
