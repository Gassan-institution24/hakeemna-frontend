import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Login Page </title>
        <meta name="description" content="Welcome to Hakeemna website" />
      </Helmet>

      <JwtLoginView />
    </>
  );
}
