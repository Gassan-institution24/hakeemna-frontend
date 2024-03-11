import React, { useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Container from '@mui/material/Container';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// ----------------------------------------------------------------------

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

import Familymem from '../familymem';

export default function Family() {
  const dialog = useBoolean(false);

  const yesfunction = async () => {
    // try {
    //   const response = await axios.patch(`/api/patient/${user?.patient?._id}/updateonboard`, {
    //     is_onboarded: true,
    //   });
    //   setOldpatientsdata(response.data);
    //   user.patient.is_onboarded = true;
    //   enqueueSnackbar(`Please check your data`, { variant: 'success' });
    // } catch (error) {
    //   console.error('Error updating data:', error);
    // }
    // router.push(paths.dashboard.user.oldpatientdata);
    alert('Sdsdsd');
  };
  const nofunction = async () => {
    // try {
    //   const response = await axios.patch(`/api/patient/${user?.patient?._id}/updateonboard`, {
    //     is_onboarded: true,
    //   });
    //   setOldpatientsdata(response.data);
    //   user.patient.is_onboarded = true;
    //   enqueueSnackbar(`Thanks for your cooperation`, { variant: 'success' });
    // } catch (error) {
    //   console.error('Error updating data:', error);
    // }
    // dialog.onFalse();
    alert('Sdsdsd');
  };

  const settings = useSettingsContext();
  const { t } = useTranslate();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('family')}
        links={[
          { name: t('dashboard'), href: paths.dashboard.root },
          { name: t('user'), href: paths.dashboard.user.root },
          { name: t('family') },
        ]}
        action={
          <Button
            component={RouterLink}
            onClick={dialog.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Add New
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <Dialog open={dialog.value} onClose={dialog.onTrue}>
        <DialogTitle>Does the user have an account?</DialogTitle>
        <DialogActions>
          <Button href={paths.dashboard.user.profile} variant="outlined" color="success" type="submit">
            {t('Yes')}
          </Button>
          <Button type="submit" variant="contained" color="inherit" href={paths.dashboard.user.profile}>
            {t('No')}
          </Button>
        </DialogActions>
      </Dialog>

      <Familymem />
    </Container>
  );
}
