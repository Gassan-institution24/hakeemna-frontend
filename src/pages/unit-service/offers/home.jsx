import { Helmet } from 'react-helmet-async';

import OffersHomeView from 'src/sections/unit-service/offers/view/home';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
  return (
    <>
      <Helmet>
        <title>Offers</title>
      </Helmet>

      <OffersHomeView />
    </>
  );
}
