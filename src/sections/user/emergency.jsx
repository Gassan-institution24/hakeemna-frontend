import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Image from 'src/components/image/image';
import Iconify from 'src/components/iconify';
import Emergencypic from './imges/emergency.jpg';

export default function Emergency() {
  
const test = () => {
  alert('Dont :-(');
};
return (
  <Container
    sx={{
      py: { xs: 0, md: 2 },
      maxWidth: '100%',
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Iconify
        icon="radix-icons:dot"
        sx={{
          color: '#128CA9',
          width: '45px',
          height: '45px',
          position: 'relative',
          top: '-8px',
          display: { md: 'flex', xs: 'none' },
        }}
      />
      <Typography
        sx={{
          mb: { md: 10, xs: 6 },
          mt: { md: 0, xs: 2 },
          fontSize: { md: 20, xs: 14 },
        }}
      >
        Through our doctor, we can provide advice electronically by contacting you to cover your
        consultation in the field of general medicine and children.
      </Typography>
    </div>
    <Box>
      <Image
        src={Emergencypic}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: '10px',
          display: { md: 'flex', xs: 'none' },
        }}
      />
      <Box
        sx={{
          position: 'relative',
          top: { lg: '-580px', xs: '0' },
          left: { md: '45.5%', xs: '0' },
          width: '400px',
          height: '83px',
        }}
      >
        <Iconify
          icon="material-symbols-light:person-outline"
          sx={{
            color: '#128CA9',
            width: {md:'100px',xs:'30px'},
            height: {md:'70px',xs:'50px'},
            position: 'relative',
            left: '-8px',
            top: '2px',

          }}
        />

        <Button
          onClick={test}
          sx={{
            border: 2,
            color: '#128CA9',
            bgcolor: 'white',
            position: 'relative',
            left: {md:'-8px', xs:'5px'},
            top: '-22px',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              color: 'success.main',
            },
          }}
        >
          Private consultation covered by patient
        </Button>
      </Box>
      <Box
        sx={{
          position: 'relative',
          top: { md: '-483px', xs: '0' },
          left: { md: '53%', xs: '0' },
          width: '400px',
          height: '83px',
        }}
      >
        <Iconify
          icon="streamline:insurance-hand"
          sx={{
            color: '#128CA9',
            width: {md:'100px',xs:'25px'},
            height: {md:'50px',xs:'25px'},
            position: 'relative',
            left: '-8px',
            top: '11px',
          }}
        />
        <Button
          onClick={test}
          sx={{
            border: 2,
            color: '#128CA9',
            bgcolor: 'white',
            position: 'relative',
            left: {md:'-8px', xs:'9px'},
            top: '-1px',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              color: 'success.main',
            },
          }}
        >
          Consultation covered by insurance
        </Button>
      </Box>
      <Box
        sx={{
          position: 'relative',
          top: { md: '-356px', xs: '0' },
          left: { md: '49%', xs: '0' },
          width: '400px',
          height: '83px',
        }}
      >
        <Iconify
          icon="ion:location-outline"
          sx={{
            color: '#128CA9',
            width: {md:'100px',xs:'25px'},
            height: {md:'50px',xs:'25px'},
            position: 'relative',
            left: '-8px',
            top: '11px',
          }}
        />
        <Button
          onClick={test}
          sx={{
            border: 2,
            color: '#128CA9',
            bgcolor: 'white',
            position: 'relative',
            left: {md:'-8px', xs:'10px'},
            top: '-1px',
            '&:hover': {
              backgroundColor: '#E0E0E0',
              color: 'success.main',
            },
          }}
        >
          Emergency Near Me
        </Button>
      </Box>
    </Box>
  </Container>
);

}










































