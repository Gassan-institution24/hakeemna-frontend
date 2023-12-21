import Container from '@mui/material/Container';
import { Button, Grid, Paper, Typography } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from 'src/components/animate';
import Stack from '@mui/material/Stack';
import doctors from './images/class-medical.png';
import circleside from './images/circleside.png';

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
      <Grid
        container
        sx={{ mb: { md: 15, xs: 2 }, position: { md: 'relative' }, top: { md: '-10px' } }}
      >
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
              backgroundImage: `url(${circleside})`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
              width: '500px',
              height: '500px',
              position: 'relative',
              left: '-100px',
            }}
          >
            <img
              src={doctors}
              alt="patient"
              style={{
                objectFit: 'cover',
                position: 'relative',
                right: '-10px',
                top: '15px',
                width: '250px',
                height: '250px',
              }}
            />
          </Item>
        </Grid>
        <Grid item xs={12} md={6}>
          <Item
            sx={{
              textAlign: 'left',
              position: 'relative',
              left: { md: '150px', xs: '-15px' },
              top: { md: '120px' },
              p: 1,
              width: { md: '500px', xs: '280px' },
              fontSize:18
            }}
          >
            <h1 style={{ color: 'green' }}>I am a unitservices</h1>
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
      </Grid>
    </Container>
  );
}
