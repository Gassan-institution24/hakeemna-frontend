import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import ACLGuard from 'src/auth/guard/acl-guard';

import ClaimCompanyView from 'src/sections/unit-service/accounting/claim/companyPage';

// ----------------------------------------------------------------------

export default function ClaimCompanyPage() {
    const { companyId } = useParams();

    return (
        <ACLGuard category="unit_service" subcategory="accounting" acl="read">
            <Helmet>
                <title>Claim</title>
                <meta name="description" content="claim" />
            </Helmet>

            <ClaimCompanyView companyId={companyId} />
        </ACLGuard>
    );
}
