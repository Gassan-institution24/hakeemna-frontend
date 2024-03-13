import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/service_types/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Service Type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
