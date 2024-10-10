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
      select: 'employee',
      populate: { path: 'employee', select: '_id name_english name_arabic employee_engagements' },
    },
  });

  return (
    <>
      <Helmet>
        <title>Hakeemna 360 - {data?.title ? data?.title : ''} </title>
        <meta name="description" content={data?.title} />
      </Helmet>

      {data && <BlogView data={data} />}
    </>
  );
}
