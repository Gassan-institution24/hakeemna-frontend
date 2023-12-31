import { Helmet } from 'react-helmet-async';
import PaymentControlEditView from 'src/sections/unit-service/accounting/payment-control/view/edit'
// ----------------------------------------------------------------------

export default function PaymentControlEditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Payment Control</title>
      </Helmet>

      <PaymentControlEditView />
    </>
  );
}
