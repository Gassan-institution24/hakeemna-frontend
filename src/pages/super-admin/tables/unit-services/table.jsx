import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/super-admin/tables/view/unitservices-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Unit Services Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
