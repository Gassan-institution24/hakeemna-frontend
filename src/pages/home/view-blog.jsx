import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { useGetOneBlogs } from 'src/api';
import { useTranslate } from 'src/locales';

import BlogView from 'src/sections/home/view/ViewBlog';
// ----------------------------------------------------------------------

export default function BlogPage() {
  const params = useParams();
  const { t } = useTranslate();
  const { id } = params;
  const { data } = useGetOneBlogs(id, {
    populate: {
      path: 'user',
      select: 'employee role',
      populate: { path: 'employee', select: '_id name_english name_arabic employee_engagements' },
    },
  });
  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.innerText || tempDiv.textContent || '';
  };

  return (
    <>
      <Helmet>
        <title>
          Hakeemna 360 - {data?.title ? data?.title : ''}{' '}
          {data?.user?.role === 'superadmin'
            ? 'hakeemna360'
            : data?.user?.employee?.[t('name_english')] || ''}{' '}
        </title>
        <meta property="og:title" content={data?.title} />
        <meta property="og:description" content={data?.topic} />
        <meta property="og:url" content={`https://hakeemna.com/blogs/${data?._id}`} />
        <meta property="og:image" content={stripHtmlTags(data?.file)} />
        <meta name="description" content={data?.title} />
      </Helmet>

      {data && <BlogView data={data} />}
    </>
  );
}
