import { Helmet } from 'react-helmet-async';

import { JwtForgetPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function ForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Forgot Password</title>
      </Helmet>

      <JwtForgetPasswordView />
    </>
  );
}
