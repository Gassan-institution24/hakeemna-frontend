import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer, note, payment, shippingAddress }) {
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <Card>
      <>
        <CardHeader
          title={t("customer info")}
        />
        <Stack direction="row" sx={{ p: 3 }}>
          <Avatar
            alt={customer?.name_english}
            src={customer?.company_logo}
            sx={{ width: 48, height: 48, mr: 2 }}
          />

          <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2">{curLangAr ? customer?.name_arabic : customer?.name_english}</Typography>

            <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>
            <Box sx={{ color: 'text.secondary' }}>{customer?.phone}</Box>
            {note && <Typography variant="subtitle2" sx={{ mt: 2 }}>{t('note')}:</Typography>}
            <Box sx={{ color: 'text.secondary' }}>{note}</Box>
          </Stack>
        </Stack>
      </>
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  note: PropTypes.string,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
