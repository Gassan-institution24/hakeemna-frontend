import { Helmet } from 'react-helmet-async';

import DietsTableView from 'src/sections/tables/view/diets-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Diets Table</title>
      </Helmet>

      <DietsTableView />
    </>
  );
}
