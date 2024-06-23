import { useState } from 'react';
import { useSnackbar } from 'notistack';

import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Stack, Divider, TextField } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

import { useCheckoutContext } from './context';
// import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();
  const { user } = useAuthContext()
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar()

  const [note, setNote] = useState('')

  const empty = !checkout.items.length;

  const handleConfirmOrder = async () => {
    try {
      await axiosInstance.post(endpoints.orders.all, { products: checkout.items, unit_service: user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id, note })
      checkout.onReset()
      setNote('')
      enqueueSnackbar(t('sent successfully'))
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }
  return (
    <Stack>
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6">
              {t('cart')}
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                &nbsp;({checkout.totalItems} {t('item')})
              </Typography>
            </Typography>
          }
          sx={{ mb: 3 }}
        />

        {empty ? (
          <EmptyContent
            title={t("cart is empty!")}
            description={t("Look like you have no items in your shopping cart.")}
            imgUrl="/assets/icons/empty/ic_cart.svg"
            sx={{ pt: 5, pb: 10 }}
          />
        ) : (
          <CheckoutCartProductList
            products={checkout.items}
            onDelete={checkout.onDeleteCart}
            onIncreaseQuantity={checkout.onIncreaseQuantity}
            onDecreaseQuantity={checkout.onDecreaseQuantity}
          />
        )}
        <Divider sx={{ my: 3 }} />
        <Stack sx={{ px: 3, mb: 3 }}>
          <TextField fullWidth label={t('note')} multiline rows={2} onChange={(e) => setNote(e.target.value)} />
        </Stack>
      </Card>
      <Stack alignItems='start' p={2}>
        <Button
          component={RouterLink}
          href={paths.dashboard.user.products.root}
          color="inherit"
          startIcon={<Iconify icon={curLangAr ? "eva:arrow-ios-forward-fill" : "eva:arrow-ios-back-fill"} />}
        >
          {t('continue shopping')}
        </Button>
      </Stack>

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={empty}
        onClick={handleConfirmOrder}
      >
        {t('confirm')}
      </Button>
      {/* </Grid> */}
    </Stack>
  );
}
