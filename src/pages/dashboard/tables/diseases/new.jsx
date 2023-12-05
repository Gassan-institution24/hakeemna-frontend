import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/diseases/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Disease</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
