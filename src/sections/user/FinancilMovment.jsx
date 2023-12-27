import Grid from '@mui/material/Unstable_Grid2';
import AccountBillingPayment from '../other/account/account-billing-payment';
import AccountBillingHistory from '../other/account/account-billing-history';
import AccountBillingAddress from '../other/account/account-billing-address';
// ----------------------------------------------------------------------

export default function FinancilMovment() {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <AccountBillingPayment />
        <AccountBillingAddress />
      </Grid>
      <Grid
        xs={12}
        md={4}
        title="Invoice History"
        sx={{
          position: { md: 'relative' },
          top: { md: '24px' },
        }}
      >
        <AccountBillingHistory />
      </Grid>
    </Grid>
  );
}
