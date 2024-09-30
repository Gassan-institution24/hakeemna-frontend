import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/super-admin/tables/Blog_category/table-create-view'
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  return (
    <>
      <Helmet>
        <title>Create a new Blog category</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
