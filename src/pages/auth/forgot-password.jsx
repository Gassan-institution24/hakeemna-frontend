import { Helmet } from 'react-helmet-async';

import { JwtForgetPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Forgot Password</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtForgetPasswordView />
    </>
  );
}
