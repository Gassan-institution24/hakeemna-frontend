import { Helmet } from 'react-helmet-async';

import { Financilmovment } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserAppointmentsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: User Cards</title>
      </Helmet>

      <Financilmovment />
    </>
  );
}
