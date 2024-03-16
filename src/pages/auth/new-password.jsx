import { Helmet } from 'react-helmet-async';

import { JwtNewPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function NewPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: New Password</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtNewPasswordView />
    </>
  );
}
