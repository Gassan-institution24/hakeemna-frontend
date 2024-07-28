import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import InvoicingView from 'src/sections/unit-service/accounting/invoicing/view/home';
// ----------------------------------------------------------------------

export default function InvoicingPage() {
    return (
        <ACLGuard category="unit_service" subcategory="accounting" acl="create">
            <Helmet>
                <title>invoicing</title>
                <meta name="description" content="meta" />
            </Helmet>

            <InvoicingView />
        </ACLGuard>
    );
}
