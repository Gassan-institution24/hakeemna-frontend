import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsEditView from 'src/sections/unit-service/accounting/reciepts/view/edit';
// ----------------------------------------------------------------------

export default function RecieptsEditPage() {
  return (
    <ACLGuard category="unit_service" subcategory="accounting" acl="update">
      <Helmet>
        <title>Edit Reciept</title>
        <meta name="description" content="meta" />
      </Helmet>

      <RecieptsEditView />
    </ACLGuard>
  );
}
