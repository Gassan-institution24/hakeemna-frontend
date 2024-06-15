import { useState } from 'react';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
// import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { Divider, Stack, TextField } from '@mui/material';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useSnackbar } from 'notistack';
import { useCheckoutContext } from './context';
// import CheckoutSummary from './checkout-summary';
import CheckoutCartProductList from './checkout-cart-product-list';

// ----------------------------------------------------------------------

export default function CheckoutCart() {
  const checkout = useCheckoutContext();
  const { user } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar()
  const [note, setNote] = useState('')

  const empty = !checkout.items.length;

  const handleConfirmOrder = async () => {
    try {
      await axiosInstance.post(endpoints.orders.all, { products: checkout.items, unit_service: user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id, note })
      checkout.onReset()
      setNote('')
      enqueueSnackbar('sent successfully')
    } catch (e) {
      console.log(e)
      enqueueSnackbar(e.message, { variant: 'error' })
    }
  }
  return (
    <Stack>
      {/* <Grid xs={12} md={8}> */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h6">
              Cart
              <Typography component="span" sx={{ color: 'text.secondary' }}>
                &nbsp;({checkout.totalItems} item)
              </Typography>
            </Typography>
          }
          sx={{ mb: 3 }}
        />

        {empty ? (
          <EmptyContent
            title="Cart is Empty!"
            description="Look like you have no items in your shopping cart."
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
          <TextField fullWidth label='note' multiline rows={2} onChange={(e) => setNote(e.target.value)} />
        </Stack>
      </Card>
      <Stack alignItems='start' p={2}>
        <Button
          component={RouterLink}
          href={paths.unitservice.products.root}
          color="inherit"
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        >
          Continue Shopping
        </Button>
      </Stack>
      {/* </Grid> */}

      {/* <Grid xs={12} md={4}> */}
      {/* <CheckoutSummary
          total={checkout.total}
          discount={checkout.discount}
          subTotal={checkout.subTotal}
          onApplyDiscount={checkout.onApplyDiscount}
        /> */}

      <Button
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        disabled={empty}
        onClick={handleConfirmOrder}
      >
        Confirm
      </Button>
      {/* </Grid> */}
    </Stack>
  );
}
