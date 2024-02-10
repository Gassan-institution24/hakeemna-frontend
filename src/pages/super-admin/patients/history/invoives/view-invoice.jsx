import { Helmet } from 'react-helmet-async';

import InvoiceInfo from 'src/sections/super-admin/patients/history/invoices/invoice-show/invoice-detail-view';
import { useGetEconomicMovement } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { inid } = params;
  const { data, loading } = useGetEconomicMovement(inid);
  return (
    <>
      <Helmet>
        <title> Economic Movement </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <InvoiceInfo economicMovementData={data} />}
    </>
  );
}
