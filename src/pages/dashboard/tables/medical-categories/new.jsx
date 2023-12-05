import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/medCategories/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Medical Category</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
