import { Helmet } from 'react-helmet-async';

import InvoiceInfo from 'src/sections/super-admin/stakeholders/history/invoices/invoice-show/invoice-detail-view';
import { useGetEconomicMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
// ----------------------------------------------------------------------

export default function StakeholderAddInvoicePage() {
  const params = useParams();
  const { inid } = params;
  const { data,loading } = useGetEconomicMovement(inid);
  return (
    <>
      <Helmet>
        <title> Economic Movement </title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <InvoiceInfo economicMovementData={data} />}
    </>
  );
}
