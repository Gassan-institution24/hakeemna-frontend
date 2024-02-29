import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/analyses/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Analysis</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
