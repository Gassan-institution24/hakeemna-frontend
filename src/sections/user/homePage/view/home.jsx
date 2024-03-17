import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import { useSettingsContext } from 'src/components/settings';

import AppWelcome from '../app-welcome';
import AppFeatured from '../app-featured';
// import Photo from './photo.png';
// test

// ----------------------------------------------------------------------

export default function OverviewAppView() {
  const { user } = useAuthContext();
  const dialog = useBoolean(true);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const [oldpatientsdata, setOldpatientsdata] = useState([]);
  const [oldData, setOlddata] = useState();
  const [Us, setUs] = useState();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const settings = useSettingsContext();
  const currentHour = new Date().getHours();
  const isMorning = currentHour >= 0 && currentHour < 12;
  const greeting = isMorning ? t(`Good Morning ☀️`) : t(`Good Evening 🌑`);

  const yesfunction = async () => {
    try {
      const response = await axios.patch(`/api/patient/${user?.patient?.[user.index_of]?._id}/updateonboard`, {
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
      const response = await axios.patch(`/api/patient/${user?.patient?.[user.index_of]?._id}/updateonboard`, {
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
          identification_num: user?.patient?.[user.index_of]?.identification_num,
        });
        setOldpatientsdata(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    if (oldpatientsdata.length > 0) {
      const mappedData = oldpatientsdata.map((Data, idx) => Data);
      setOlddata(mappedData[0].identification_num);
    }
  }, [oldpatientsdata, oldData]);

  useEffect(() => {
    if (oldpatientsdata.length > 0) {
      const mappedData = oldpatientsdata.map((Data, idx) => Data);
      setUs(mappedData[0].unit_service);
    }
  }, [oldpatientsdata, Us]);
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <AppWelcome
            title={`${greeting} \n ${user?.patient?.[user.index_of]?.first_name} ${user?.patient?.[user.index_of]?.last_name}`}
            description={
              curLangAr
                ? 'قم بتغذية جسدك، وتمكين عقلك  فالعافية هي مفتاح الحياة النابضة بالحياة.'
                : 'Nourish your body, empower your mind – wellness is the key to a vibrant life.'
            }
            //   img={<Image src={Photo} />}
            action={
              <Button variant="contained" color="primary">
                {curLangAr ? 'احسب مؤشر كتلة الجسم' : ' Calculate your BMI'}
              </Button>
            }
          />
        </Grid>
        <Grid xs={12} md={4}>
          <AppFeatured />
        </Grid>

        <Grid xs={12} md={12} sx={{ height: '400px' }}>
          <Typography variant="h3">{t('How To Use')}</Typography>
          <Box sx={{ position: 'relative', mt: 1 }}>
            {/* <iframe
              src="https://www.youtube.com/embed/IGsRxmC40Bw?si=gULZ3W4Jy6BPk7p6"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '320px',
                width: '100%',
                borderRadius: '10px',
                border: 'none',
              }}
            /> */}
          </Box>
        </Grid>
      </Grid>
      {user?.patient?.[user.index_of]?.identification_num === oldData &&
      user?.patient?.[user.index_of]?.is_onboarded === false &&
      user?.role === 'patient' ? (
        <Dialog open={dialog.value} onClose={dialog.onTrue}>
          <DialogTitle>
            {curLangAr
              ? 'لقد وجدنا بعض معلوماتك مخزنة عند'
              : 'We found that you have data stored in'}
            <ol>
              <li> {curLangAr ? `${Us?.name_arabic}` : `${Us?.name_english}`}</li>
            </ol>
            {curLangAr
              ? 'هل تريد تخزينها في ملفك الشخصي'
              : 'do you want to store it in your profile'}
          </DialogTitle>
          <DialogActions>
            <Button onClick={yesfunction} variant="outlined" color="success" type="submit">
              {t('Yes')}
            </Button>
            <Button type="submit" variant="contained" color="inherit" onClick={nofunction}>
              {t('No')}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        ''
      )}
    </Container>
  );
}
