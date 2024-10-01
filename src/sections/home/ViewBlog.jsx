import { useParams } from 'react-router';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import { fDateAndTime } from 'src/utils/format-time';

import { useGetOneBlogs } from 'src/api';

import Image from 'src/components/image';

export default function ViewBlog() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetOneBlogs(id);
  console.log(data);

  return (
    <Stack sx={{ p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '70%' }}>
        <Box sx={{ p: 5, textAlign: 'start' }}>
          <Typography variant="h2" component="h2" sx={{ mb: 10, textAlign: 'center' }}>
            {data?.title}
          </Typography>

          <Grid
            container
            sx={{
              gap: 2,
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            <Image
              src={data?.file}
              alt={data?.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ p: 2 }}>
              <Typography sx={{ color: 'gray', mt: 2 }}>
                {fDateAndTime(data?.created_at)}
              </Typography>

              <Typography
                dangerouslySetInnerHTML={{
                  __html: data?.topic,
                }}
                sx={{
                  mb: 3,
                  mt: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.5s ease-in-out',
                }}
              />
            </Box>
          </Grid>
        </Box>
      </Card>
    </Stack>
  );
}
