import { Helmet } from 'react-helmet-async';

import ServiceTypesTableView from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Service Types Table</title>
      </Helmet>

      <ServiceTypesTableView />
    </>
  );
}
