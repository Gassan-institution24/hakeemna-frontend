import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetIncomePayment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import PaymentInfo from 'src/sections/super-admin/patients/history/payment-control/payment-show/payment-detail-view';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { inid } = params;
  const { data, loading } = useGetIncomePayment(inid);
  return (
    <>
      <Helmet>
        <title> Patients: Payment Control </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <PaymentInfo paymentData={data} />}
    </>
  );
}
