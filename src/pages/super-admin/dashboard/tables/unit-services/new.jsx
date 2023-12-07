import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/unitservices/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Unit Service</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
