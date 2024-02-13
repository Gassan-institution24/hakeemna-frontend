import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsInfoView from 'src/sections/unit-service/accounting/reciepts/view/info';
// ----------------------------------------------------------------------

export default function RecieptsInfoPage() {
  return (
    <ACLGuard hasContent category="unit_service" subcategory="accounting" acl="read">
        <Helmet>
          <title>Reciept Info</title>
        </Helmet>

        <RecieptsInfoView />
      </ACLGuard>
  );
}
