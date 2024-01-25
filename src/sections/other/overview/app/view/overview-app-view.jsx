import React from 'react';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useAuthContext } from 'src/auth/hooks';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';


import { _appAuthors, _appRelated, _appFeatured, _appInvoices, _appInstalled } from 'src/_mock';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import Image from 'src/components/image/image';
import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
import Photo from './photo.png';

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useAuthContext();
  const dialog = useBoolean(true);
  const router = useRouter();

  const theme = useTheme();

  const settings = useSettingsContext();
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 0 && currentHour < 12;
  const greeting = isMorning ? 'Good Morning ☀️' : 'Good Evening 🌑';

const yesfunction = () =>{
  router.push(paths.dashboard.user.oldpatientdata);
}
const nofunction = () =>{
  dialog.onFalse() 
}

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <AppWelcome
              title={`${greeting} \n ${user?.userName}`}
              description="Nourish your body, empower your mind – wellness is the key to a vibrant life."
              img={<Image src={Photo} />}
              action={
                <Button variant="contained" color="primary">
                  Calculate your BMI
                </Button>
              }
            />
          </Grid>

          <Grid xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid>

          <Grid xs={12} md={6} lg={12}>
            <Typography variant="h3">How To Use</Typography>
            <Box sx={{ position: 'relative', mt: 1 }}>
              <div style={{ position: 'relative', paddingBottom: '56%', width: '100%' }}>
                <iframe
                  src="https://www.youtube.com/embed/IGsRxmC40Bw?si=gULZ3W4Jy6BPk7p6"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    borderRadius: '10px',
                    border: 'none',
                  }}
                />
              </div>
            </Box>
          </Grid>
        </Grid>
        {user ? (
          <Dialog open={dialog.value} onClose={dialog.onTrue}>
            <DialogTitle>We found that you have data stored in عياده ركتورنا do you want to store it in your profile</DialogTitle>
            <DialogActions>
              <Button
                onClick={yesfunction}
                variant="outlined"
                color="success"
                type="submit"
              >
                yes
              </Button>
              <Button type="submit" variant="contained"  color="inherit" onClick={nofunction}>
                no
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ''
        )}
      </Container>
    </>
  );
}
