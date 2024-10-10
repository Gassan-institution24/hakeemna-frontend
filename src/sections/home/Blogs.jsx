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
import { useAuthContext } from 'src/auth/hooks';
import { useGetBlogs, useGetBlog_category } from 'src/api';

import Image from 'src/components/image/image';

export default function Blogs() {
  const { t } = useTranslate();
  const { data } = useGetBlogs();
  const { Data } = useGetBlog_category();
  const { user } = useAuthContext();
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

  const filteredBlogs = data?.filter((blog) => {
    const matchesSearch =
      (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.topic.toLowerCase().includes(searchTerm.toLowerCase())) && (
        filterBy ? blog.category === filterBy : true
      )

    return matchesSearch;
  });

  return (
    <Stack sx={{ p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '70%' }}>
        <Box sx={{ p: 5, textAlign: 'start' }}>
          <Typography variant="h2" component="h2" sx={{ mb: 10, textAlign: 'center' }}>
            {t('hakeemna medical blog')}
          </Typography>

          {/* Search and filter section */}
          <Box sx={{ display: 'flex', mb: 5 }}>
            <TextField
              label={t('Search')}
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '25%', mr: 3 }}
            />
            <TextField
              select
              label={t('Filter by category')}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{ width: '25%' }}
            >
              <MenuItem value="">{t('All categorys')}</MenuItem>
              {Data?.map((category, index) => (
                <MenuItem key={index} value={category?._id}>
                  {category?.[t("name_english")]}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Blog Cards */}
          <Grid
            container
            sx={{
              display: 'grid',
              gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
              gap: 2,
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            {filteredBlogs?.map((blog, index) => (
              <Card
                key={index}
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  mb: 3,
                  width: '75%',
                  height: '300px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Image
                  src={blog?.file}
                  alt={blog.title}
                  sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <Box sx={{ p: 2,maxHeight:150 }}>
                  <Link
                    sx={{ color: 'gray' }}
                    href={paths.pages.doctor(
                      `${blog.user?.employee?.employee_engagements?.[
                        user?.employee?.selected_engagement
                      ]?._id
                      }_${blog.user?.employee?.name_english?.replace(/ /g, '_')}`
                    )}
                  >
                    {blog.user?.employee?.name_english}
                  </Link>
                  <Typography sx={{ color: 'gray' }}>{blog.title}</Typography>
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: formatTextWithLineBreaks(blog.topic),
                    }}
                    sx={{
                      mb: 3,
                      mt: 3,
                      fontWeight: 'bold',
                      transition: 'all 0.5s ease-in-out',
                    }}
                  />
                  <Typography sx={{ color: 'gray', mt: 2 }}>
                    {fDateAndTime(blog.created_at)}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'success.main',
                    mt: 3,
                  }}
                  onClick={() => router.push(paths.pages.BlogsView(blog?._id))}
                >
                  {t('View')}
                </Button>
              </Card>
            ))}
          </Grid>
          <Stack alignItems="center" sx={{ mt: 8, mb: { xs: 10, md: 15 } }}>
            {/* <Button
            size="large"
            variant="outlined"
            startIcon={<Iconify icon="svg-spinners:12-dots-scale-rotate" width={24} />}
          >
            Load More
          </Button> */}
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
