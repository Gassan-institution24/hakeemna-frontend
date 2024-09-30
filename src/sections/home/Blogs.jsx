import * as React from 'react';
import { useState } from 'react';
import { Box, Card, Grid, Stack, MenuItem, TextField, Typography } from '@mui/material';
import { fDateAndTime } from 'src/utils/format-time';
import { useGetBlogs } from 'src/api';
import { useTranslate } from 'src/locales';
import Image from 'src/components/image/image';
import BlogImage from './images/blog.png';

export default function Blogs() {
  const { t } = useTranslate();
  const { data } = useGetBlogs();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('');

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
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterBy ? blog.user?.employee?.name_english === filterBy : true;

    return matchesSearch && matchesFilter;
  });

  return (
    <Stack sx={{ p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '80%' }}>
        <Box sx={{ p: 5, textAlign: 'start' }}>
          <Typography variant="h2" component="h2" sx={{ mb: 5, textAlign: 'center' }}>
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
              label={t('Filter by Author')}
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              sx={{ width: '25%' }}
            >
              <MenuItem value="">{t('All Authors')}</MenuItem>
              {data?.map((blog, index) => (
                <MenuItem key={index} value={blog.user?.employee?.name_english}>
                  {blog.user?.employee?.name_english}
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
                  src={blog?.user?.picture || BlogImage}
                  alt={blog.title}
                  sx={{ width: '100%', height: '150px', objectFit: 'cover' }}
                />
                <Box sx={{ p: 2 }}>
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
              </Card>
            ))}
          </Grid>
        </Box>
      </Card>
    </Stack>
  );
}
