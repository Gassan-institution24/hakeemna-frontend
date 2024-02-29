import { Helmet } from 'react-helmet-async';

import { JwtStakeholderRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Register As Stakeholder</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtStakeholderRegisterView />
    </>
  );
}
