import { Helmet } from 'react-helmet-async';

import WalktourView from 'src/sections/unit-service/walktour-view';

// ----------------------------------------------------------------------

export default function WalktourPage() {
  return (
    <>
      <Helmet>
        <title> Components: Walktour</title>
      </Helmet>

      <WalktourView />
    </>
  );
}
