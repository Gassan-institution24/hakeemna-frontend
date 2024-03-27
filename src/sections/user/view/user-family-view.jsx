import { Box } from '@mui/system';
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
          <Button
            href={paths.dashboard.user.exist}
            variant="outlined"
            color="success"
            type="submit"
          >
            {t('Yes')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="inherit"
            href={paths.dashboard.user.create}
          >
            {t('No')}
          </Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 3 }}>
        <Familymem />
      </Box>
    </Container>
  );
}
