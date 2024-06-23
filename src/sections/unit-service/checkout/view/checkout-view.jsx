import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';

import CheckoutCart from '../checkout-cart';

// ----------------------------------------------------------------------

export default function CheckoutView() {
  const settings = useSettingsContext();

  const { t } = useTranslate()

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {t('confirm order')}
      </Typography>
      <CheckoutCart />
    </Container>
  );
}
