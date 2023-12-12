import { Helmet } from 'react-helmet-async';

import { JwtVerifyView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function VerifyPage() {
  return (
    <>
      <Helmet>
        <title> Verify</title>
      </Helmet>

      <JwtVerifyView />
    </>
  );
}
