import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import RecieptsInfoView from 'src/sections/employee/accounting/reciepts/view/info';
// ----------------------------------------------------------------------

export default function RecieptsInfoPage() {
  return (
    <ACLGuard hasContent category="employee" subcategory="accounting" acl="read">
      <Helmet>
        <title>Reciept Info</title>
      </Helmet>

      <RecieptsInfoView />
    </ACLGuard>
  );
}
