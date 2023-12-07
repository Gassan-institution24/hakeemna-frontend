import { Helmet } from 'react-helmet-async';

import ActivitiesTableView from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Activities Table</title>
      </Helmet>

      <ActivitiesTableView />
    </>
  );
}
