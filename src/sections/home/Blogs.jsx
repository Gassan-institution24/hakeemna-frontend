import * as React from 'react';
import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Card,
  Grid,
  Link,
  Stack,
  Button,
  MenuItem,
  Checkbox,
  TextField,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetBlogs, useGetBlog_category } from 'src/api';

import Iconify from 'src/components/iconify';

export default function Blogs({ onPreview }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { Data } = useGetBlog_category();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState();
  const [myBlogs, setMyBlogs] = useState(false);

  const formatTextWithLineBreaks = (text, limit = 20) => {
    if (!text) return '';

    const chunks = [];

    for (let i = 0; i < text.length; i += 100) {
      chunks.push(text.slice(i, i + 100));
    }

    let formattedText = chunks.join('<br />');

    if (text.length > limit) {
      formattedText = `${text.slice(0, limit)}...`;
    }

    return formattedText;
  };

  // Static data for blogs
  const { data } = useGetBlogs({
    populate: {
      path: 'user',
      select: 'role employee _id',
      populate: { path: 'employee', select: '_id name_english name_arabic employee_engagements' },
    },
  });

  const filteredBlogs = data?.filter((blog) => {
    const matchesSearch =
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.topic.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterBy ? blog.category === filterBy : true);
    let filterMyBlogs = true;
    if (myBlogs) {
      filterMyBlogs = blog.user?._id === user?._id;
    }
    return matchesSearch && filterMyBlogs;
  });

  return (
    <>
      <Stack
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '35vh',
          width: '100%',
          px: 3,
          mb: '150px',
          mt: '130px',
          position: 'relative',
          backgroundImage: `linear-gradient(to right, rgba(112, 216, 192, 0.7), rgba(60, 176, 153, 0.7))`,
          borderBottomLeftRadius: '60px',
          borderBottomRightRadius: '60px',
        }}
      >
        <Typography variant="h2" component="h2" color="white">
          {t('hakeemna medical blog')}
        </Typography>
      </Stack>

      <Box sx={{ py: { xs: 2, md: 2 }, px: { xs: 2, md: 30 }, textAlign: 'start' }}>
        {/* Search and filter section */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 5 }}>
          <TextField
            label={t('Search')}
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: { xs: '100%', md: '100%' }, mr: { md: 3 }, mb: { xs: 2, md: 0 } }}
          />
          <TextField
            select
            label={t('Filter by category')}
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            sx={{ width: { xs: '100%', md: '100%' } }}
          >
            <MenuItem value="">{t('All categories')}</MenuItem>
            {Data?.map((category, index) => (
              <MenuItem key={index} value={category?._id}>
                {category?.[t('name_english')]}
              </MenuItem>
            ))}
          </TextField>
          {user?._id && data?.some((one) => one.user?._id === user?._id) && (
            <Stack ml={5} direction="row" alignItems="center">
              <Checkbox checked={myBlogs} onClick={() => setMyBlogs(!myBlogs)} />
              <Typography>{t('my blogs')}</Typography>
            </Stack>
          )}
        </Box>

        {/* Blog Cards */}
        <Grid container spacing={2}>
          {filteredBlogs?.map((blog, index) => (
            <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
              <Card
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  height: '250px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderRight: '5px solid #3CB099',
                  borderRadius: '15px',
                  bgcolor: 'rgba(216, 246, 240, 0.11)',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ color: '#3CB099', fontWeight: 'bold', mb: 1 }}>
                    {blog.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    {fDateAndTime(blog.created_at)} dsfsdfsfd
                  </Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: formatTextWithLineBreaks(blog.topic),
                    }}
                    sx={{ mt: 1 }}
                  />

                  <Stack sx={{ position: 'absolute', bottom: 60 }}>
                    {blog?.user?.role === 'superadmin' ? (
                      <Typography
                        sx={{ color: '#3CB099' }}
                        href={paths.pages.doctor(
                          `${
                            blog?.user?.employee?.employee_engagements[0]
                          }_${blog?.user?.employee?.name_english?.replace(/ /g, '_')}`
                        )}
                      >
                        {curLangAr ? 'حكيمنا ٣٦٠' : ' hakeemna 360'}
                      </Typography>
                    ) : (
                      <Link
                        sx={{ color: 'gray' }}
                        href={paths.pages.doctor(
                          `${
                            blog?.user?.employee?.employee_engagements[0]
                          }_${blog?.user?.employee?.name_english?.replace(/ /g, '_')}`
                        )}
                      >
                        {blog.user?.employee?.name_english}
                      </Link>
                    )}
                  </Stack>
                </Box>

                <Stack direction="row" sx={{ alignSelf: 'end', mb: 2, mr: 2 }}>
                  <Button
                    size="large"
                    onClick={() => {
                      if (onPreview) {
                        onPreview(blog?._id);
                      } else {
                        router.push(
                          `${paths.pages.BlogsView(blog?._id)}?title=${blog?.title?.replace(
                            / /g,
                            '-'
                          )}}&writer=${
                            blog?.user?.role === 'superadmin'
                              ? 'hakeemna 360'
                              : blog.user?.employee?.[t('name_english')]?.replace(/ /g, '-')
                          }`
                        );
                      }
                    }}
                    id="About"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      bgcolor: 'transparent',
                      padding: 0,
                      overflow: 'hidden',
                      boxShadow: 'none',
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: 'white',
                        color: '#1F2C5C',
                        fontWeight: 'bold',
                        padding: '6px 12px',
                        fontSize: '16px',
                      }}
                    >
                      {t('Read more')}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#1F2C5C',
                        padding: '6px 8px',
                        borderEndEndRadius: '10px',
                        borderStartEndRadius: '10px',
                      }}
                    >
                      {curLangAr ? (
                        <Iconify icon="icon-park-outline:left" width={24} sx={{ color: 'white' }} />
                      ) : (
                        <Iconify
                          icon="eva:arrow-ios-forward-fill"
                          width={24}
                          sx={{ color: 'white' }}
                        />
                      )}
                    </div>
                  </Button>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

Blogs.propTypes = {
  onPreview: PropTypes.func,
};
