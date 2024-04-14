import { Helmet } from 'react-helmet-async';

import { PatientNewUserView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function NewUserPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: New user</title>
        <meta name="description" content="meta" />
      </Helmet>

      <PatientNewUserView />
    </>
  );
}
