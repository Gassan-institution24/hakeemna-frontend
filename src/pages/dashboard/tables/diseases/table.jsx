import { Helmet } from 'react-helmet-async';

import DiseasesTableView from 'src/sections/super-admin/tables/view/diseases-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Diseases Table</title>
      </Helmet>

      <DiseasesTableView />
    </>
  );
}
