import { Helmet } from 'react-helmet-async';

import { JwtRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Register</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtRegisterView />
    </>
  );
}
