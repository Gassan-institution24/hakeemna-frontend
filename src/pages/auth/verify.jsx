import { Helmet } from 'react-helmet-async';

import { JwtVerifyView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function VerifyPage() {
  return (
    <>
      <Helmet>
        <title>Hakeemna: Verify</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtVerifyView />
    </>
  );
}
