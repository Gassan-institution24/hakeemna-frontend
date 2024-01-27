import { Helmet } from 'react-helmet-async';

import PaymentInfo from 'src/sections/super-admin/stakeholders/history/payment-control/payment-show/payment-detail-view';
import { useGetIncomePayment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { inid } = params;
  const { data, loading } = useGetIncomePayment(inid);
  return (
    <>
      <Helmet>
        <title> stakeholders: Payment Control </title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <PaymentInfo paymentData={data} />}
    </>
  );
}
