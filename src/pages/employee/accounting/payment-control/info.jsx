import { Helmet } from 'react-helmet-async';
import PaymentControlInfoView from 'src/sections/employee/accounting/payment-control/view/info'
// ----------------------------------------------------------------------

export default function PaymentControlInfoPage() {
  return (
    <>
      <Helmet>
        <title>Payment Control Info</title>
      </Helmet>

      <PaymentControlInfoView />
    </>
  );
}
