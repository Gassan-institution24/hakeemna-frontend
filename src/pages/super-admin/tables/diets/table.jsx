import { Helmet } from 'react-helmet-async';

import DietsTableView from 'src/sections/super-admin/tables/view/diets-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Diets Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DietsTableView />
    </>
  );
}
