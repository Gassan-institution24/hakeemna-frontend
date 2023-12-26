import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';

import AccountBillingPayment from '../other/account/account-billing-payment';
// import AccountBillingHistory from '../account/account-billing-history';
// import AccountBillingAddress from '../account/account-billing-address';

// ----------------------------------------------------------------------

export default function FinancilMovment({ cards, plans, invoices, addressBook }) {
  return (
    <Grid container spacing={5} disableEqualOverflow>
      <Grid xs={12} md={8}>
        <AccountBillingPayment cards={cards} />

        {/* <AccountBillingAddress addressBook={addressBook} /> */}
        <></>
      </Grid>

      {/* <Grid xs={12} md={4}>
        <AccountBillingHistory invoices={invoices} />
      </Grid> */}
    </Grid>
  );
}

FinancilMovment.propTypes = {
  addressBook: PropTypes.array,
  cards: PropTypes.array,
  invoices: PropTypes.array,
  plans: PropTypes.array,
};
