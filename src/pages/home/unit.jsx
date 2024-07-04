import { Helmet } from 'react-helmet-async';

import Unitservices from 'src/sections/home/view/units-service';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Units of service</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Unitservices />
    </>
  );
}
