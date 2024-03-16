import { Helmet } from 'react-helmet-async';

import { JwtStakeholderRegisterView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Stakeholder registration</title>
        <meta name="description" content="meta" />
      </Helmet>

      <JwtStakeholderRegisterView />
    </>
  );
}
