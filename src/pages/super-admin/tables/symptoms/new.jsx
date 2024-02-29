import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/symptoms/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Symptom</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
