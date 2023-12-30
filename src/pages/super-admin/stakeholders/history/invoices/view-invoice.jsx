import { Helmet } from 'react-helmet-async';

import InvoiceInfo from 'src/sections/super-admin/stakeholders/history/invoices/invoice-show/invoice-detail-view';
import { useGetEconomicMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function StakeholderAddInvoicePage() {
  const params = useParams();
  const { inid } = params;
  const { data } = useGetEconomicMovement(inid);
  return (
    <>
      <Helmet>
        <title> Economic Movement </title>
      </Helmet>

      {data && <InvoiceInfo economicMovementData={data} />}
    </>
  );
}
