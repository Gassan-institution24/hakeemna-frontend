import { Helmet } from 'react-helmet-async';

import ServiceNewView from 'src/sections/unit-service/tables/services/view/new';

// ----------------------------------------------------------------------

export default function ServiceNewPage() {
  return (
    <>
      <Helmet>
        <title>New service</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ServiceNewView />
    </>
  );
}
