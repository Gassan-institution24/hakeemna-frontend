import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/ustypes/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Unit Service Type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
