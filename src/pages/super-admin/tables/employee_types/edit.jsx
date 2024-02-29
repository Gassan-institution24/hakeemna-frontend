import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/super-admin/tables/employee_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Employee Type</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
