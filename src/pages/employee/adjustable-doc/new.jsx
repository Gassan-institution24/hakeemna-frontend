import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/adjustable-doc/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : new adjustable document</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
