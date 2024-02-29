import { Helmet } from 'react-helmet-async';

import CountriesTableView from 'src/sections/super-admin/tables/view/countries-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Countries Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <CountriesTableView />
    </>
  );
}
