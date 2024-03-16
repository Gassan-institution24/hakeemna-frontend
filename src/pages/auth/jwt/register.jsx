import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Register Page </title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
