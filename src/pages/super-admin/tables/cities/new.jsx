import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/cities/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new city</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
