import { color, m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useGetPosts } from 'src/api/user';
import { varFade, MotionViewport } from 'src/components/animate';
import Image from 'src/components/image';
import * as React from 'react';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  // textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function HomeCleanInterfaces() {
  const { posts } = useGetPosts();
  const renderDescription = (
    <Stack>
      <Typography
        variant="h2"
        sx={{
          textAlign: { xs: 'center' },
        }}
      >
        Blog
      </Typography>
    </Stack>
  );

  const renderContent = (
    <div>
      <Stack direction="row" spacing={2}>
        {posts.map((info, index) => (
          <Item>
            <Image
              alt="blog"
              src={info.img}
              sx={{
                width: '400px',
                height: '250px',
                borderRadius: '3%',
              }}
            />
            <p
              style={{
                color: 'green',
              }}
            >
              {info.category}
            </p>
            <h2>{info.subject}</h2>
            {/* <p>{info.content}</p> */}
          </Item>
        ))}
      </Stack>
    </div>
  );

  return (
    
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      {renderDescription}
      <br />
      <br />
      {renderContent}
      <br />
    </Container>
  );
}
