import { Helmet } from 'react-helmet-async';

import { ActivitiesTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Activities Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ActivitiesTableView />
    </>
  );
}
