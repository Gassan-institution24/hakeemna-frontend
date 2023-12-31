import { Helmet } from 'react-helmet-async';
import EconomicMovementEditView from 'src/sections/employee/accounting/economic-movements/view/edit'
// ----------------------------------------------------------------------

export default function EconomicMovementEditPage() {
  return (
    <>
      <Helmet>
        <title>Edit Economic Movement</title>
      </Helmet>

      <EconomicMovementEditView />
    </>
  );
}
