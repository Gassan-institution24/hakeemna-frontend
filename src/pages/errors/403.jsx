import { Helmet } from 'react-helmet-async';

import View403 from 'src/sections/errors/403';

// ----------------------------------------------------------------------

export default function Page403() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: 403 Forbidden</title>
        <meta name="description" content="meta" />
      </Helmet>

      <View403 />
    </>
  );
}
