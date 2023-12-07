import { Helmet } from 'react-helmet-async';

import USTypesTableView from 'src/sections/tables/view/ustypes-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Unit Services Types Table</title>
      </Helmet>

      <USTypesTableView />
    </>
  );
}
