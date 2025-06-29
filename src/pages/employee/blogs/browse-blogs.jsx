import { Helmet } from 'react-helmet-async';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import BlogsView from 'src/sections/employee/blogs/view/Blogs';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  const router = useRouter();
  return (
    <>
      <Helmet>
        <title> Dashboard: browse Blogs</title>
        <meta name="description" content="meta" />
      </Helmet>

      <BlogsView onPreview={(id) => router.push(paths.employee.previewBlog(id))} />
    </>
  );
}
