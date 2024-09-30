import { Helmet } from 'react-helmet-async';

import { BlogCategoryView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title>Blog category Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BlogCategoryView />
    </>
  );
}
