import { Helmet } from 'react-helmet-async';

import { JwtActivationView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function ActivationPage() {
  return (
    <>
      <Helmet>
        <title> Activation</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtActivationView />
    </>
  );
}
