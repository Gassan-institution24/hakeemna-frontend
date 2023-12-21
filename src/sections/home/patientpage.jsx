import Container from '@mui/material/Container';
import { Button, Grid, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from 'src/components/animate';
import Stack from '@mui/material/Stack';
import midical from './images/medical.png';
import circle from './images/circle.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1d222900' : 'rgba(255, 255, 255, 0)',
  ...theme.typography.body2,
  padding: theme.spacing(5),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Patient() {
  return (
    <Container component={MotionViewport}>
      <Stack
        spacing={3}
        sx={{ textAlign: 'center', p: 5, position: { md: 'relative' }, bottom: { md: '-40px' } }}
      >
        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Start Now</Typography>
        </m.div>
      </Stack>

      <Grid
        container
        sx={{ mb: { md: 15, xs: 2 }, position: { md: 'relative' }, top: { md: '-10px' } }}
      >
        <Grid item xs={12} md={6}>
          <Item
            sx={{
              textAlign: 'left',
              position: 'relative',
              left: { md: '20px', xs: '-15px' },
              top: { md: '120px' },
              p: 1,
              width: { md: '500px', xs: '280px' },
              fontSize:18
            }}
          >
            <h1 style={{ color: 'green' }}>I am a patient</h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit culpa
              <br /> porro aut molestiaks vitae minjus tempore odio tempore odio. <br />
              tempore odio Lorem ipsum sit amet consectetur adipjkisicing.
            </p>
            <Button
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                width: '130px',

                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              Signup
            </Button>
          </Item>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: { xs: 'none', md: 'flex' },
            position: { md: 'relative' },
          }}
        >
          <Item
            sx={{
              backgroundImage: `url(${circle})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '500px',
              height: '500px',
              position: 'relative',
              right: '-150px',
              top: '60px',
            }}
          >
            <img
              src={midical}
              alt="patient"
              style={{
                objectFit: 'cover',
                position: 'relative',
                right: '-25px',
                top: '30px',
                width: '250px',
                height: '250px',
              }}
            />
          </Item>
        </Grid>
      </Grid>
    </Container>
  );
}
