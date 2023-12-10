import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/surgeries/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Surgery</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
