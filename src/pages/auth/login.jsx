import { Helmet } from 'react-helmet-async';

import { JwtLoginView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Login Page</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtLoginView />
    </>
  );
}
