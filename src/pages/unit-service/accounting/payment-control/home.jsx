import { Helmet } from 'react-helmet-async';
import PaymentControlView from 'src/sections/unit-service/accounting/payment-control/view/home'
// ----------------------------------------------------------------------

export default function PaymentControlPage() {
  return (
    <>
      <Helmet>
        <title>Payment Control</title>
      </Helmet>

      <PaymentControlView />
    </>
  );
}
