import { Helmet } from 'react-helmet-async';

import InvoiceInfo from 'src/sections/super-admin/patients/history/invoices/invoice-show/invoice-detail-view';
import { useGetEconomicMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
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
