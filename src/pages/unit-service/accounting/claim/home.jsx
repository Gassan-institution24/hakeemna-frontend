import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import ClaimView from 'src/sections/unit-service/accounting/claim/home';

// ----------------------------------------------------------------------

export default function ClaimPage() {
    return (
        <ACLGuard permission="accounting:read">
            <Helmet>
                <title>Claim</title>
                <meta name="description" content="claim" />
            </Helmet>

            <ClaimView />
        </ACLGuard>
    );
}
