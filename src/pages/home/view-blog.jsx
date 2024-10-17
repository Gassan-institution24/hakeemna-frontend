import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { useGetOneBlogs } from 'src/api';

import BlogView from 'src/sections/home/view/ViewBlog';
// ----------------------------------------------------------------------

export default function BlogPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetOneBlogs(id, {
    populate: {
      path: 'user',
      select: 'employee role',
      populate: { path: 'employee', select: '_id name_english name_arabic employee_engagements' },
    },
  });

  return (
    <>
      <Helmet>
        <title>Hakeemna 360 - {data?.title ? data?.title : ''} </title>
        <meta property="og:title" content={data?.title} />
        <meta property="og:description" content={data?.topic} />
        <meta property="og:url" content="http://localhost:3006/blogs/67064128a641c72e14fc4820" />
        <meta property="og:image" content={data?.file} />
        <meta name="description" content={data?.topic} />
      </Helmet>

      {data && <BlogView data={data} />}
    </>
  );
}
