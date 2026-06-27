import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsInfoView from 'src/sections/employee/accounting/reciepts/view/info';
// ----------------------------------------------------------------------

export default function RecieptsInfoPage() {
  return (
    <ACLGuard permission="accounting:read">
      <Helmet>
        <title>Reciept Info</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RecieptsInfoView />
    </ACLGuard>
  );
}
