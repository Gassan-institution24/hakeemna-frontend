import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsNewView from 'src/sections/unit-service/accounting/reciepts/view/new';
// ----------------------------------------------------------------------

export default function RecieptsNewPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="create">
        <Helmet>
          <title>New Reciept</title>
        </Helmet>

        <RecieptsNewView />
      </ACLGuard>
  );
}
