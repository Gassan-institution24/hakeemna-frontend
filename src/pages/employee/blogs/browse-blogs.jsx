import { Helmet } from 'react-helmet-async';

import BlogsView from 'src/sections/home/Blogs';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: browse Blogs</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BlogsView />
    </>
  );
}
