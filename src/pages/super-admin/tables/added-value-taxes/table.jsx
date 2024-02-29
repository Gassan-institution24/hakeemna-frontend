import { Helmet } from 'react-helmet-async';

import TaxesTableView from 'src/sections/super-admin/tables/view/taxes-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Taxes Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TaxesTableView />
    </>
  );
}
