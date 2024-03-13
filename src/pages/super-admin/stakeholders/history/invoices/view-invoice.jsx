import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetEconomicMovement } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import InvoiceInfo from 'src/sections/super-admin/stakeholders/history/invoices/invoice-show/invoice-detail-view';
// ----------------------------------------------------------------------

export default function StakeholderAddInvoicePage() {
  const params = useParams();
  const { inid } = params;
  const { data, loading } = useGetEconomicMovement(inid);
  return (
    <>
      <Helmet>
        <title> Economic Movement </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <InvoiceInfo economicMovementData={data} />}
    </>
  );
}
