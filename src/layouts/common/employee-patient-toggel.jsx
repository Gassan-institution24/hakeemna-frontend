import { m } from 'framer-motion';
import { useSnackbar } from 'notistack';

import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { varHover } from 'src/components/animate';
import { paths } from 'src/routes/paths';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ServiceUnitPopover() {
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const handleChangeRole = async () => {
    try {
      await axios.patch(endpoints.auth.toggleRole);
      window.location.href = paths.dashboard.root;
    } catch (error) {
      console.error(error);
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Button
      component={m.button}
      whileTap="tap"
      whileHover="hover"
      variants={varHover(1.05)}
      onClick={handleChangeRole}
      sx={{
        p: 0,
        m: 2,
        // width: 40,
        // height: 40,
      }}
    >
      <Iconify icon="mage:exchange-b" />
      <Typography variant="body2" textTransform="lowercase" sx={{ textAlign: 'center', ml: 1 }}>
        {user.role === 'patient' ? t('switch to employee') : t('switch to patient')}
      </Typography>
    </Button>
  );
}
