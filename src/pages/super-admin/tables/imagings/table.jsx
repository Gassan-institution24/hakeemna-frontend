import { Helmet } from 'react-helmet-async';

import ImagingsTableView from 'src/sections/super-admin/tables/view/imagings-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Imaging Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ImagingsTableView />
    </>
  );
}
