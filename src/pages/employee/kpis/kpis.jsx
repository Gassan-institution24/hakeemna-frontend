import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import KpisView from 'src/sections/employee/kpis/kpis-view';
// ----------------------------------------------------------------------

export default function KpisPage() {
  return (
    <ACLGuard permission="kpis:read">
      <Helmet>
        <title> Kpis </title>
        <meta name="description" content="meta" />
      </Helmet>
      <KpisView />
    </ACLGuard>
  );
}
