import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import Image from 'src/components/image/image';
import Iconify from 'src/components/iconify';
import Emergencypic from '../../components/logo/doc.png';

export default function Emergency() {
  const test = () => {
    alert('Dont :-(');
  };

  const appContainerStyle = {
    display: 'flex',
  };

  const stickySidebarStyle = {
    position: 'sticky',
    top: 0,
    right: 0,
    height: '100vh',
    width: '6%',
    backgroundColor: '#f0f0f0',
    padding: '3px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  };

  return (
    
      /* <div style={appContainerStyle}>
        <div style={stickySidebarStyle}>
          <Button sx={{ border: 1 }}>
            <Iconify sx={{ color: 'green' }} icon="carbon:person" />
          </Button>
        </div>
      </div> */

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
              width: '4%',
              height: '4%',
              position: 'absolute',
              left: '25.9%',
              top: '19.2%',
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
        <Box
          sx={{
            position: 'absolute',
            height: '60%',
            width: '60%',
            // border: '1px #4E6892 solid',
            display: 'grid',
            borderRadius: 2,
            gridTemplateColumns: '1fr 1fr',
          }}
        >
          <Box
            sx={{
              width: '110%',
              borderRight: '10px #4E6892 solid',
              borderRadius: '2% 50%  50% 2%',
              bgcolor: '#FBFEFB',
              zIndex: 1,
            }}
          >
            <Image src={Emergencypic} sx={{ width: '70%', height: '70%', mt: '17%', ml: '15%' }} />

            <Box
              style={{
                border: '3px solid #4E6892',
                borderRadius: '100%',
                width: '7%',
                height: '13%',
                backgroundColor: 'white',
                position: 'absolute',
                left: '42%',
                top: '5%',
                textAlign: 'center',
              }}
            >
              <Iconify width="65%" sx={{ mt: '15%', color: '#4E6892' }} icon="carbon:person" />
            </Box>
            <Box
              style={{
                border: '3px solid #4E6892',
                borderRadius: '100%',
                width: '7%',
                height: '13%',
                backgroundColor: 'white',
                position: 'absolute',
                left: '51%',
                top: '40%',
                textAlign: 'center',
              }}
            >
              <Iconify width="65%" sx={{ mt: '15%', color: '#4E6892' }} icon="guidance:card" />
            </Box>
            <Box
              style={{
                border: '3px solid #4E6892',
                borderRadius: '100%',
                width: '7%',
                height: '13%',
                backgroundColor: 'white',
                position: 'absolute',
                left: '42%',
                top: '80%',
                textAlign: 'center',
              }}
            >
              <Iconify
                width="65%"
                sx={{ mt: '15%', color: '#4E6892' }}
                icon="fluent:location-28-regular"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#128CA9',
              width: '143%',
              position: 'relative',
              left: '-43%',
              borderRight: '#128CA9',
              borderRadius: '0% 2%  2% 0%',
            }}
          >
            <Button
              onClick={test}
              sx={{
                border: '3px solid #4E6892',
                bgcolor: 'white',
                color: '#4E6892',
                position: 'absolute',
                top: '8%',
                left: '30%',
                '&:hover': {
                  border: '3px solid green',
                  bgcolor: 'rgba(255, 255, 255, 0.829)',
                  color: 'green',
                },
              }}
            >
              Private consultation covered by patient
            </Button>
            <Button
              onClick={test}
              sx={{
                border: '3px solid #4E6892',
                bgcolor: 'white',
                color: '#4E6892',
                position: 'absolute',
                top: '45%',
                left: '43%',
                '&:hover': {
                  border: '3px solid green',
                  bgcolor: 'rgba(255, 255, 255, 0.829)',
                  color: 'green',
                },
              }}
            >
              Consultation covered by insurance
            </Button>
            <Button
              onClick={test}
              sx={{
                border: '3px solid #4E6892',
                bgcolor: 'white',
                color: '#4E6892',
                position: 'absolute',
                top: '84%',
                left: '30%',
                '&:hover': {
                  border: '3px solid green',
                  bgcolor: 'rgba(255, 255, 255, 0.829)',
                  color: 'green',
                },
              }}
            >
              Medical emergency near me
            </Button>
          </Box>
        </Box>
      </Container>
    
  );
}
