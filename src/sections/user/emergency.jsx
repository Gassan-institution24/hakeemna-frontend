import React, { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useSnackbar } from 'src/components/snackbar';
import Image from 'src/components/image/image';
import Iconify from 'src/components/iconify';
import Emergencypic from './imges/emergency.jpg';

export default function Emergency() {

  const test = ()=>{
    alert('Dont :-(')
  }
  return (
    <Container
      sx={{
        position: 'relative',
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
          }}
        />
        <Typography
          sx={{
            fontSize: 20,
            mb: 10,
          }}
        >
          Through our doctor, we can provide advice electronically by contacting you to cover your
          consultation in the field of general medicine and children.
        </Typography>
      </div>
      <Box>
        <div style={{ width: '100%' }}>
          <Image
            src={Emergencypic}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: '10px',
            }}
          />
          <Iconify
            icon="material-symbols-light:person-outline"
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-575px',
              left: '494px',
              width: '100px',
              height: '70px',
              fontWeight: '600px',
            }}
          />
          <Button
          onClick={test}
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-604px',
              left: '500px',
              border: 2,
              bgcolor: 'white',
              '&:hover': {
                backgroundColor: '#E0E0E0',
              },
            }}
          >
            Private consultation covered by patient
          </Button>
          <Iconify
            icon="streamline:insurance-hand"
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-405px',
              left: '205px',
              width: '90px',
              height: '50px',
            }}
          />
          <Button
          onClick={test}
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-425px',
              left: '210px',
              border: 2,
              bgcolor: 'white',
              '&:hover': {
                backgroundColor: '#E0E0E0',
              },
            }}
          >
            Consultation covered by insurance
          </Button>
          <Iconify
            icon="ion:location-outline"
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-190px',
              left: '-184px',
              width: '100px',
              height: '60px',
            }}
          />
          <Button
          onClick={test}
            sx={{
              color: '#128CA9',
              position: 'relative',
              top: '-215px',
              left: '-180px',
              border: 2,
              bgcolor: 'white',
              '&:hover': {
                backgroundColor: '#E0E0E0',
              },
            }}
          >
            Emergency Near Me
          </Button>
        </div>
      </Box>
    </Container>
  );
}
