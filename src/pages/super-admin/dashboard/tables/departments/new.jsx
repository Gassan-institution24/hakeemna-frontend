import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/departments/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Department</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
