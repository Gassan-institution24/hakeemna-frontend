import * as React from 'react';
import { useState } from 'react';

import {
  Box,
  Card,
  Grid,
  Link,
  Stack,
  Button,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDateAndTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useGetBlogs, useGetBlog_category } from 'src/api';

import Image from 'src/components/image/image';

export default function Blogs() {
  const { t } = useTranslate();
  const { data } = useGetBlogs({
    populate: {
      path: 'user',
      select: 'employee',
      populate: { path: 'employee', select: '_id name_english name_arabic employee_engagements' },
    },
  });
  const { Data } = useGetBlog_category();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState();

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

  // Handle search and filter
  const filteredBlogs = data?.filter((blog) => {
    const matchesSearch =
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.topic.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterBy ? blog.category === filterBy : true);

    return matchesSearch;
  });

  return (
    <Stack
      sx={{ p: { xs: 2, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Card sx={{ width: { xs: '100%', md: '70%' }, mx: 'auto' }}>
        <Box sx={{ p: { xs: 2, md: 5 }, textAlign: 'start' }}>
          <Typography
            variant="h2"
            component="h2"
            sx={{ mb: { xs: 5, md: 10 }, textAlign: 'center' }}
          >
            {t('hakeemna medical blog')}
          </Typography>

          {/* Search and filter section */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, mb: 5 }}>
            <TextField
              label={t('Search')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: { xs: '100%', md: '25%' }, mr: { md: 3 }, mb: { xs: 2, md: 0 } }}
            />
            <TextField
              select
              label={t('Filter by category')}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{ width: { xs: '100%', md: '25%' } }}
            >
              <MenuItem value="">{t('All categories')}</MenuItem>
              {Data?.map((category, index) => (
                <MenuItem key={index} value={category?._id}>
                  {category?.[t('name_english')]}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Blog Cards */}
          <Grid
            container
            spacing={3}
            sx={{
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              justifyContent: 'center',
            }}
          >
            {filteredBlogs?.map((blog, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card
                  sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <Image
                    src={blog?.file}
                    alt={blog.title}
                    sx={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                  <Box sx={{ p: 2 }}>
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
                    <Typography sx={{ color: 'gray', fontWeight: 'bold', mt: 1 }}>
                      {blog.title}
                    </Typography>
                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: formatTextWithLineBreaks(blog.topic),
                      }}
                      sx={{ mt: 1, transition: 'all 0.5s ease-in-out' }}
                    />
                    <Typography sx={{ color: 'gray', mt: 2 }}>
                      {fDateAndTime(blog.created_at)}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    sx={{ bgcolor: 'success.main', mx: 2, mb: 2 }}
                    onClick={() => router.push(paths.pages.BlogsView(blog?._id))}
                  >
                    {t('View')}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Load More Button */}
          <Stack alignItems="center" sx={{ mt: 8, mb: { xs: 10, md: 15 } }}>
            {/* Placeholder for Load More button if needed */}
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
