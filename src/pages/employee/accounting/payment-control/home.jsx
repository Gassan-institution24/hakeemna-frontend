import { Helmet } from 'react-helmet-async';
import ACLGuard from 'src/auth/guard/acl-guard';
import PaymentControlView from 'src/sections/employee/accounting/payment-control/view/home';
// ----------------------------------------------------------------------

export default function PaymentControlPage() {
  return (
    <>
      <ACLGuard hasContent category="employee" subcategory="accounting" acl="read">
        <Helmet>
          <title>Payment Control</title>
        </Helmet>

        <PaymentControlView />
      </ACLGuard>
    </>
  );
}
