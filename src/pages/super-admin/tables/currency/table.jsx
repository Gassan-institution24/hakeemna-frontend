import { Helmet } from 'react-helmet-async';

import CurrencyTableView from 'src/sections/super-admin/tables/view/currency-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Currency Table</title>
      </Helmet>

      <CurrencyTableView />
    </>
  );
}
