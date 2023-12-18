import { m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useSettingsContext } from 'src/components/settings';
import { varFade, MotionViewport } from 'src/components/animate';
import { Button } from '@mui/material';
// ----------------------------------------------------------------------
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
export default function Whydoc() {
  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center', position: 'relative', top: '-180px' }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2">We Provide you: </Typography>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2} columns={16}>
        <Grid item xs={8}>
          <Item
            sx={{
              height:"200px",
              width:"400px",
              border: 1,
              position: 'relative',
              backgroundImage: ` url(https://img.freepik.com/premium-photo/doctor-with-his-patient_8595-5688.jpg)`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br /> Amet cupiditate ipsum
            porro, harum quo facere exercitationem saepe blanditiis autem maiores necessitatibus{' '}
            <br /> sapiente expedita architecto dignissimos quae reprehenderit odit deleniti
            consequuntur!
            <br />
            <Button
                          sx={{
                            bgcolor: 'success.main',
                            color: '#fff',
                            position: 'relative',
      
                            width: '100px',
                            '&:hover': {
                              bgcolor: '#fff',
                              color: 'success.main',
                              border: 1,
                              borderColor: 'success.main'
                            },
                          }}
            >
              test button
            </Button>
          </Item>
        </Grid>
        <Grid item xs={8}>
          <Item
            sx={{
              height:"200px",
              width:"400px",
              border: 1,
              position: 'relative',
              backgroundImage: ` url(https://iprospectcheck.com/wp-content/uploads/2022/07/physican-background-check.jpg)`,
              backgroundSize: 'cover',
              backgroundRepeat: 'no-repeat',
            }}
          >
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. <br /> Amet cupiditate ipsum
            porro, harum quo facere exercitationem saepe blanditiis autem maiores necessitatibus{' '}
            <br /> sapiente expedita architecto dignissimos quae reprehenderit odit deleniti
            consequuntur!
            <br />
            <Button
                          sx={{
                            bgcolor: 'success.main',
                            color: '#fff',
                            position: 'relative',
                            width: '100px',
                            '&:hover': {
                              bgcolor: '#fff',
                              color: 'success.main',
                              border: 1,
                              borderColor: 'success.main'
                            },
                          }}
            >
              test button
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
        py: { xs: 50, md: 25 },
        mb: 15,
        mt: 10,
        border: 1,
      }}
    >
      {renderDescription}

      {renderContent}
    </Container>
  );
}

// sx={{
//   position: 'relative',
//   backgroundImage: ` url(https://iprospectcheck.com/wp-content/uploads/2022/07/physican-background-check.jpg)`,
//   backgroundSize: 'cover',
//   backgroundRepeat: 'no-repeat',
// }}
