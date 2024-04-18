import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/super-admin/tables/view/unitservices-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: unit of services Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
