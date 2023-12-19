import { Button, Grid, Paper } from '@mui/material';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import midical from './images/medical.png';
import left from './images/doc1-removebg-preview.png';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1d222900' : 'rgba(255, 255, 255, 0)',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Patient() {
  return (
    <Grid container sx={{mb:{md:15,xs:2}}}>
      <Grid item xs={12} md={6}>
        <Item
          sx={{
            textAlign: 'left',
            padding: '20px',
            position: { md: 'relative' },
            left: { md: '250px' },
            top: { md: '120px' },
            p:1,
            
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
      <Grid item xs={12} md={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Item
          sx={{
            backgroundImage: `url(${left})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            minHeight: '300px',
            position: { md: 'relative' },
            
          }}
        >
          <img
            src={midical}
            alt="patient"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Item>
      </Grid>
    </Grid>
  );
}
