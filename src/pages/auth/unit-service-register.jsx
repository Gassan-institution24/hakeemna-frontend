import { Helmet } from 'react-helmet-async';

import { JwtUSRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Service unit registration</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtUSRegisterView />
    </>
  );
}
