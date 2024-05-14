import { Helmet } from 'react-helmet-async';

import USTypesTableView from 'src/sections/super-admin/tables/view/ustypes-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: units of service Types Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <USTypesTableView />
    </>
  );
}
