import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/super-admin/tables/view/unitservices-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: units of service Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
