import { Helmet } from 'react-helmet-async';
import EconomicMovementNewView from 'src/sections/unit-service/accounting/economic-movements/view/new'
// ----------------------------------------------------------------------

export default function EconomicMovementNewPage() {
  return (
    <>
      <Helmet>
        <title>New Economic Movement</title>
      </Helmet>

      <EconomicMovementNewView />
    </>
  );
}
