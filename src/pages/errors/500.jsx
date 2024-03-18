import { Helmet } from 'react-helmet-async';

import View500 from 'src/sections/errors/500';

// ----------------------------------------------------------------------

export default function Page500() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: 500 Internal Server Error</title>
        <meta name="description" content="meta" />
      </Helmet>

      <View500 />
    </>
  );
}
