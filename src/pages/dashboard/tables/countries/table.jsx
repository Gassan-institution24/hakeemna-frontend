import { Helmet } from 'react-helmet-async';

import CountriesTableView from 'src/sections/tables/view/countries-table-view';


// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Countries Table</title>
      </Helmet>

      <CountriesTableView />
    </>
  );
}
