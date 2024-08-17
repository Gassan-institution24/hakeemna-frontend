import { Helmet } from 'react-helmet-async';

import Unitservices from 'src/sections/home/view/units-service';
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Hakeemna 360 - منصة حكيمنا الطبية : Units of service</title>
        <meta name="description" content="meta" />
      </Helmet>

      <Unitservices />
    </>
  );
}
