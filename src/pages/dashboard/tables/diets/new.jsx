import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/diets/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Diet</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
