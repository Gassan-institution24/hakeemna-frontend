import { Helmet } from 'react-helmet-async';
import EconomicMovementInfoView from 'src/sections/employee/accounting/economic-movements/view/info'
// ----------------------------------------------------------------------

export default function EconomicMovementInfoPage() {
  return (
    <>
      <Helmet>
        <title>Economic Movement Info</title>
      </Helmet>

      <EconomicMovementInfoView />
    </>
  );
}
