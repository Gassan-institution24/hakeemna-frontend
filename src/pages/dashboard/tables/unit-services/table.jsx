import { Helmet } from 'react-helmet-async';

import UnitServicesTableView from 'src/sections/tables/view/unitservices-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Unit Services Table</title>
      </Helmet>

      <UnitServicesTableView />
    </>
  );
}
