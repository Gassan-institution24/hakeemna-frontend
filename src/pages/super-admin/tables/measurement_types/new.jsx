import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/measurement_types/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Measurement Type</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
