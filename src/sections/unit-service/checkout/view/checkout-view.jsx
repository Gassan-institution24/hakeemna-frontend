import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

// import { PRODUCT_CHECKOUT_STEPS } from 'src/_mock/_product';

import { useSettingsContext } from 'src/components/settings';

import CheckoutCart from '../checkout-cart';
import { useCheckoutContext } from '../context';
import CheckoutOrderComplete from '../checkout-order-complete';

// ----------------------------------------------------------------------

// const PRODUCT_CHECKOUT_STEPS = ['Cart', 'Billing & address', 'Payment'];

export default function CheckoutView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ mb: 10 }}>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        Confirm order
      </Typography>

      {/* <Grid container justifyContent={checkout.completed ? 'center' : 'flex-start'}>
        <Grid xs={12} md={8}>
          <CheckoutSteps activeStep={checkout.activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
        </Grid>
      </Grid> */}

      {checkout.completed ? (
        <CheckoutOrderComplete
          open={checkout.completed}
          onReset={checkout.onReset}
          onDownloadPDF={() => {}}
        />
      ) : (
        <>
          <CheckoutCart />

          {/* {checkout.activeStep === 1 && <CheckoutBillingAddress />} */}

          {/* {checkout.activeStep === 2 && checkout.billing && <CheckoutPayment />} */}
        </>
      )}
    </Container>
  );
}
