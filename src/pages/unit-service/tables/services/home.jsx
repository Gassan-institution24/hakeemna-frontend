import { Helmet } from 'react-helmet-async';

import ServicesHomeView from 'src/sections/unit-service/tables/services/view/home';

// ----------------------------------------------------------------------

export default function ServicesHomePage() {
  return (
    <>
      <Helmet>
        <title> services </title>
        <meta name="description" content="meta" />
      </Helmet>

      <ServicesHomeView />
    </>
  );
}
