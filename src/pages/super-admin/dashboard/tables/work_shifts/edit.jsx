import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/tables/work_shifts/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> super: Edit Work Shifts</title>
      </Helmet>

      <TableEditView />
    </>
  );
}
