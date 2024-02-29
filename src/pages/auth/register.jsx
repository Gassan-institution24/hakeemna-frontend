import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Jwt: Register</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
