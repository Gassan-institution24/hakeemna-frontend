import { color, m } from 'framer-motion';
import SigupButton from 'src/layouts/common/signup-button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useGetPosts } from 'src/api/user';
import { varFade, MotionViewport } from 'src/components/animate';
import Image from 'src/components/image';
import Divider from '@mui/material/Divider';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import midical from './images/medical.png';
import left from './images/doc1-removebg-preview.png';
// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1d222900' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Patient() {
  return (
    <Box sx={{ flexGrow: 1, height: '600px' }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={8}>
          <Item
            sx={{
              position: 'relative',
              top: '40%',
              left:"350px"
            }}
          >
            <h1
              style={{
                textAlign:"left",
                color:"green"
              }}
            >
              I am patients
            </h1>
            <p
              style={{
                position: 'relative',
                textAlign:"left",
              }}
            >
              Lorem ipsum, dolor sit amet consectetu adipisicing elit culpa
              <br /> porro aut molestiaks vitae minjus tempore odio tempore odio. <br />
              tempore odio Lorem ipsum sit amet consectetur adipjkisicing.
            </p>
            <Button
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                left: -400,
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
        <Grid item xs={8}>
          <Item
            sx={{
              backgroundImage: ` url(${left})`,
              position: 'relative',
              right: '160px',
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Image
              alt="patient"
              src={midical}
              sx={{
                width: '400px',
                height: '400px',
              }}
            />
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
