import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/specialties/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Specialty</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
