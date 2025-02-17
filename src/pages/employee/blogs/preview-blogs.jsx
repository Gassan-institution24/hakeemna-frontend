import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useGetOneBlogs } from 'src/api';
import ViewBlog from 'src/sections/home/view/ViewBlog';


// ----------------------------------------------------------------------

export default function TableDetailsPage() {
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
        <title> Dashboard: preview Blog</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <ViewBlog data={data} />}
    </>
  );
}
