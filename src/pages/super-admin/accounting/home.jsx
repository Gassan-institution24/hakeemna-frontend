import { Helmet } from 'react-helmet-async';

import AccountingHome from 'src/sections/super-admin/accounting/homepage';

// ----------------------------------------------------------------------

export default function AccountingHomePage() {
  return (
    <>
      <Helmet>
        <title>Accounting</title>
      </Helmet>

      <AccountingHome />
    </>
  );
}
