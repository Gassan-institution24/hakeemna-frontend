import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/employee_types/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Employee Type</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
