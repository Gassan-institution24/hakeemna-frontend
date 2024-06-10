import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/checklist/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : Create a new checklist</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
