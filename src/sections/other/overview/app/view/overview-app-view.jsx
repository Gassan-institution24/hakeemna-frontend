import React, { useState, useEffect } from 'react';
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
import axios from 'src/utils/axios';
import { useSnackbar } from 'src/components/snackbar';
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
  const { enqueueSnackbar } = useSnackbar();
  const [oldpatientsdata, setOldpatientsdata] = useState([]);
  const [oldData, setOlddata] = useState();

  console.log(user);

  const settings = useSettingsContext();
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 0 && currentHour < 12;
  const greeting = isMorning ? 'Good Morning ☀️' : 'Good Evening 🌑';

  const yesfunction = async () => {
    try {
      const response = await axios.patch(`/api/patient/${user?.patient?._id}/updateonboard`, {
        is_onboarded: true,
      });
      setOldpatientsdata(response.data);
      user.patient.is_onboarded = true;
      enqueueSnackbar(`Please check your data`, { variant: 'success' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
    router.push(paths.dashboard.user.oldpatientdata);
  };

  const nofunction = async () => {
    try {
      const response = await axios.patch(`/api/patient/${user?.patient?._id}/updateonboard`, {
        is_onboarded: true,
      });
      setOldpatientsdata(response.data);
      user.patient.is_onboarded = true;
      enqueueSnackbar(`Thanks for your cooperation`, { variant: 'success' });
    } catch (error) {
      console.error('Error updating data:', error);
    }
    dialog.onFalse();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post('/api/oldpatientsdata/details', {
          identification_num: user?.patient?.identification_num,
        });
        setOldpatientsdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user?.patient?.identification_num]);

  useEffect(() => {
    if (oldpatientsdata.length > 0) {
      const mappedData = oldpatientsdata.map((Data) => Data);
      setOlddata(mappedData[0].identification_num);
    }
  }, [oldpatientsdata, oldData]);

  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <AppWelcome
              title={`${greeting} \n ${user?.patient?.first_name} ${user?.patient?.last_name}`}
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

          <Grid xs={12} md={12} sx={{ height: '400px' }}>
            <Typography variant="h3">How To Use</Typography>
            <Box sx={{ position: 'relative', mt: 1 }}>
              <iframe
                src="https://www.youtube.com/embed/IGsRxmC40Bw?si=gULZ3W4Jy6BPk7p6"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '320px',
                  width: '100%',
                  borderRadius: '10px',
                  border: 'none',
                }}
              />
            </Box>
          </Grid>
        </Grid>
        {/* && user?.patient?.is_onboarded === false  */}
        {user?.patient?.identification_num === oldData ? (
          <Dialog open={dialog.value} onClose={dialog.onTrue}>
            <DialogTitle>
              We found that you have data stored in
              <ol>
                <li>اسم عيادة</li>
                <li>اسم عيادة</li>
                <li>اسم عيادة</li>
                <li>اسم عيادة</li>
              </ol>
              do you want to store it in your profile
            </DialogTitle>
            <DialogActions>
              <Button onClick={yesfunction} variant="outlined" color="success" type="submit">
                yes
              </Button>
              <Button type="submit" variant="contained" color="inherit" onClick={nofunction}>
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
