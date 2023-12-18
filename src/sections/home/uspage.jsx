import { color, m } from 'framer-motion';
import Box from '@mui/material/Box';
import Image from 'src/components/image';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import doctors from './images/doctors.png';
import right from './images/photo_5765147929160564692_y-removebg-preview.png';
// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1d222900' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Units() {
  return (
    <Box sx={{ flexGrow: 1, height: '600px' }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={8}>
          <Item
            sx={{
              backgroundImage: ` url(${right})`,
              position: 'relative',
              left: '160px',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Image
              alt="patient"
              src={doctors}
              sx={{
                width: '500px',
                height: '400px',
              }}
            />
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item
            sx={{
              position: 'relative',
              top: '40%',
              right:"-230px"
            }}
          >
            <h1
              style={{
                position: 'relative',
                textAlign:"left",
                color: 'green',
              }}
            >
              I am a servie provider
            </h1>
            <p
              style={{
                position: 'relative',
                textAlign:"left",
              }}
            >
              {' '}
              Lorem ipsum, dolor sit amet consectetu adipisicing elit culpa
              <br /> porro aut molestiaks vitae minjus tempore odio tempore odio. <br />
              tempore odio Lorem ipsum sit amet consectetur adipjkisicing.
            </p>
            <Button
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                right: 400,
                top: 10,
                width: '130px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main'
                },
              }}
            >
              Signup
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
