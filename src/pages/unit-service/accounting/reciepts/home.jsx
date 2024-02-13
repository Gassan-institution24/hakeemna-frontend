import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsView from 'src/sections/unit-service/accounting/reciepts/view/home';
// ----------------------------------------------------------------------

export default function RecieptsPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="read">
        <Helmet>
          <title>Reciepts</title>
        </Helmet>

        <RecieptsView />
      </ACLGuard>
  );
}
