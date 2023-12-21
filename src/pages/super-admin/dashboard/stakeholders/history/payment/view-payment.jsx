import { Helmet } from 'react-helmet-async';

import PaymentInfo from 'src/sections/stakeholders/history/payment-control/payment-show/payment-detail-view';
import { useGetIncomePayment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { inid } = params;
  const { data } = useGetIncomePayment(inid);
  return (
    <>
      <Helmet>
        <title> stakeholders: Payment Control </title>
      </Helmet>

      {data && <PaymentInfo paymentData={data} />}
    </>
  );
}
