import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { varFade, MotionViewport } from 'src/components/animate';
import { Button } from '@mui/material';
import { PATH_FOR_PATIENT_SERVICES,PATH_FOR_US_SERVICES  } from 'src/config-global';

 
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function Whydoc() {
  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center', position: 'relative', top: '-50px' }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2">We Provide you: </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ flexGrow: 1, position: 'relative', left: { xs: '7%', md:' 12% '}, mt: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6} md={6}>
          <Item
            sx={{
              height: '300px',
              width: '300px',
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(119, 119, 119, 0.468), rgba(171, 255, 205, 0.394)), url(https://as2.ftcdn.net/v2/jpg/03/13/90/91/1000_F_313909135_kJ9iYYjNgbhWvBJF0H6i8bMCSr48ZZZA.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              p: 5,
              '&:hover': {
                backgroundImage:
                  'linear-gradient(rgba(64, 64, 64, 0.486), rgba(64, 64, 64, 0.486)), url(https://as2.ftcdn.net/v2/jpg/03/13/90/91/1000_F_313909135_kJ9iYYjNgbhWvBJF0H6i8bMCSr48ZZZA.jpg)',
              },
            }}
          >
            <Typography variant="h5">As Patient </Typography>
            <p
              style={{
                fontWeight: '700',
                width: '250px',
                textAlign: 'left',
              }}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br /> Amet cupiditate ipsum
              porro, harum quo facere exercitationem saepe blanditiis autem maiores necessitatibus
            </p>
            <Button
              target="_blank"
              rel="noopener"
              href={PATH_FOR_PATIENT_SERVICES}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                top: '20px',
                width: '100px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              Read More
            </Button>
          </Item>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Item
            sx={{
              height: '300px',
              width: '300px',
              position: 'relative',
              backgroundImage: `linear-gradient(rgba(119, 119, 119, 0.468), rgba(171, 255, 205, 0.394)), url(https://i.pinimg.com/736x/35/57/55/355755832670880825ad87838e18d6b6.jpg)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: '#fff',
              p: 5,
              '&:hover': {
                backgroundImage:
                  'linear-gradient(rgba(64, 64, 64, 0.486), rgba(64, 64, 64, 0.486)), url(https://i.pinimg.com/736x/35/57/55/355755832670880825ad87838e18d6b6.jpg)',
              },
            }}
          >
            <Typography variant="h5">As Unitservices </Typography>
            <p
              style={{
                fontWeight: '700',
                width: '250px',
                textAlign: 'left',
              }}
            >
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br /> Amet cupiditate ipsum
              porro, harum quo facere exercitationem saepe blanditiis autem maiores necessitatibus
            </p>
            <Button
              target="_blank"
              rel="noopener"
              href={PATH_FOR_US_SERVICES}
              sx={{
                bgcolor: 'success.main',
                color: '#fff',
                position: 'relative',
                top: '20px',
                width: '100px',
                '&:hover': {
                  bgcolor: '#fff',
                  color: 'success.main',
                  border: 1,
                  borderColor: 'success.main',
                },
              }}
            >
              Read More
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 4, md: 10 },
        mt: 8,
        mb: { xs: 1, md: 0 },
      }}
    >
      {renderDescription}
      {renderContent}
    </Container>
  );
}
