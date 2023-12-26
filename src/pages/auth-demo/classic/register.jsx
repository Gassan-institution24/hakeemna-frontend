import { Helmet } from 'react-helmet-async';

import { ClassicRegisterView } from 'src/sections/other/auth-demo/classic';

// ----------------------------------------------------------------------

export default function ClassicRegisterPage() {
  return (
    <>
      <Helmet>
        <title> Auth Classic: Register</title>
      </Helmet>

      <ClassicRegisterView />
    </>
  );
}
