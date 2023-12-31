import { Helmet } from 'react-helmet-async';
import EconomicMovementView from 'src/sections/employee/accounting/economic-movements/view/home'
// ----------------------------------------------------------------------

export default function EconomicMovementPage() {
  return (
    <>
      <Helmet>
        <title>Economic Movements</title>
      </Helmet>

      <EconomicMovementView />
    </>
  );
}
