import { Helmet } from 'react-helmet-async';

import { ChangeIDView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function ChangeIdPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna: Change ID Page</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ChangeIDView />
    </>
  );
}
