import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/departments/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Department</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
