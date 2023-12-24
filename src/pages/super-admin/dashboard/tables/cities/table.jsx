import { Helmet } from 'react-helmet-async';

import { TablesDetailsView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Cities Table</title>
      </Helmet>

      <TablesDetailsView />
    </>
  );
}
