import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/blogs/table-create-view';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard : new Blog</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
