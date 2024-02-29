import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsView from 'src/sections/employee/accounting/reciepts/view/home';
// ----------------------------------------------------------------------

export default function RecieptsPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="accounting" acl="read">
      <Helmet>
        <title>Reciepts</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RecieptsView />
    </ACLGuard>
  );
}
