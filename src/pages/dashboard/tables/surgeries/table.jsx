import { Helmet } from 'react-helmet-async';

import SurgeriesTableView from 'src/sections/tables/view/surgeries-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Surgeries Table</title>
      </Helmet>

      <SurgeriesTableView />
    </>
  );
}
