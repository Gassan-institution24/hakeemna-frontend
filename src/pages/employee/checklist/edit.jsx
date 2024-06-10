import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/employee/checklist/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Edit checklist</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
