import * as React from 'react';

import { Box, Card, Grid, Stack, Button, TextField, Typography, Link } from '@mui/material';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image/image';

export default function Blogs() {
  const { t } = useTranslate();

  const blogs = [
    {
      title: 'Blog 1',
      topic:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis quod vero odio ab debitis optio at sequi suscipit vitae obcaecati nobis, corrupti eaque beatae, odit possimus ex quaerat similique? Ad.',
      link: 'www.dfdf;dfdfdfgergeg.com',
      date: '20/11/2024',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };
  return (
    <Stack sx={{ p: 5 }}>
      <Card sx={{ display: { md: 'grid', gridTemplateColumns: '1fr 1fr' } }}>
        <Box
          sx={{
            p: 5,
            borderLeft: '2px rgba(128, 128, 128, 0.1) dashed',
            order: { xs: 1, md: 2 },
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            {t('Have something to write about ?')}
          </Typography>
          <Box>
            <TextField placeholder={t('title')} sx={{ mb: 2 }} />
            <TextField placeholder={t('topic')} sx={{ mb: 2, display: 'block' }} />
            <Button
              variant="contained"
              sx={{ bgcolor: 'success.main', color: 'white', display: 'block' }}
            >
              {t('blog')}
            </Button>
          </Box>
        </Box>

        <Box sx={{ p: 5, order: { xs: 2, md: 1 } }}>
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            {t('Read about Medical information')}
          </Typography>

          <Box
            sx={{
              maxHeight: blogs.length > 6 ? '400px' : 'auto',
              overflowY: blogs.length > 6 ? 'auto' : 'visible',
            }}
          >
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: 2,
              }}
            >
              {blogs.map((blog, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 4,
                    position: 'relative',
                    overflow: 'hidden',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image
                    src="https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
                    alt={blog.title}
                  />
                  <Box
                    sx={{
                      p: 2,
                      transition: 'all 0.5s ease-in-out',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography sx={{ color: 'gray' }}>{blog.title}</Typography>
                    <Typography
                      sx={{
                        mb: 3,
                        mt: 3,
                        fontWeight: 'bold',
                        transition: 'all 0.5s ease-in-out',
                        opacity: hoveredIndex === index ? 0 : 1,
                      }}
                    >
                      {blog.topic.length > 50 ? `${blog.topic.substring(0, 50)}... ` : blog.topic}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'gray',
                        mb: 5,
                        transition: 'all 0.5s ease-in-out',
                        opacity: hoveredIndex === index ? 0 : 1,
                      }}
                    >
                      <Link onClick={() => alert('Coming soon')}>{blog.link}</Link>
                    </Typography>
                    <Typography sx={{ color: 'gray', opacity: hoveredIndex === index ? 0 : 1 }}>
                      {blog.date}
                    </Typography>
                  </Box>
                  {/* This box appears when hovered */}
                  {hoveredIndex === index && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        display: 'block',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        transition: 'all 0.5s ease-in-out',
                      }}
                    >
                      <Typography sx={{ mt: 5, mb: 2 }}>{blog.topic}</Typography>

                      <Link sx={{ cursor: 'pointer' }} onClick={() => alert('Coming soon')}>
                        {blog.link}
                      </Link>
                    </Box>
                  )}
                </Card>
              ))}
            </Grid>
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
