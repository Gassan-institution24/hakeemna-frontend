import { Helmet } from 'react-helmet-async';

import { HospitalsTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Hospitals Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <HospitalsTableView />
    </>
  );
}
