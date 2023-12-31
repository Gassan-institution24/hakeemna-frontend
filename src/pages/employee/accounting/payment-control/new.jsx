import { Helmet } from 'react-helmet-async';
import PaymentControlNewView from 'src/sections/employee/accounting/payment-control/view/new'
// ----------------------------------------------------------------------

export default function PaymentControlNewPage() {
  return (
    <>
      <Helmet>
        <title>New Payment Control</title>
      </Helmet>

      <PaymentControlNewView />
    </>
  );
}
