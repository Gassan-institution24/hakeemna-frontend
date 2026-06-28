import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ClaimsView from 'src/sections/unit-service/myClaim/claim-view';
// ----------------------------------------------------------------------

export default function ClaimPage() {
  return (
    <ACLGuard permission="claim:read">
      <Helmet>
        <title> Claim </title>
        <meta name="description" content="meta" />
      </Helmet>
      <ClaimsView />
    </ACLGuard>
  );
}
