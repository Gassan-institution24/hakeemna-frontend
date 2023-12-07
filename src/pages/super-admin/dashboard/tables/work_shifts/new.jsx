import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/tables/work_shifts/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> super: Create a new Work Shift</title>
      </Helmet>

      <TableCreateView />
    </>
  );
}
