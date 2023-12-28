import { Helmet } from 'react-helmet-async';

import { JwtUSRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register As Unit Service</title>
      </Helmet>

      <JwtUSRegisterView />
    </>
  );
}
