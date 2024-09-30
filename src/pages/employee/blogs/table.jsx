import { Helmet } from 'react-helmet-async';

import BlogsTableView from 'src/sections/employee/blogs/view/blogs-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: my Blogs</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BlogsTableView />
    </>
  );
}
