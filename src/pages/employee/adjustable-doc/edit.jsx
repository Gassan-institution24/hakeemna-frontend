import { Helmet } from 'react-helmet-async';

import TableEditView from 'src/sections/employee/adjustable-doc/table-edit-view';

// ----------------------------------------------------------------------

export default function TableEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Edit adjustable document</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableEditView />
    </>
  );
}
