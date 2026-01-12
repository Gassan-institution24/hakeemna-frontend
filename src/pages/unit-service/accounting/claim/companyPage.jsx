import { Helmet } from 'react-helmet-async';
import { useParams, Navigate } from 'react-router-dom';

import ACLGuard from 'src/auth/guard/acl-guard';

import ClaimCompanyView from 'src/sections/unit-service/accounting/claim/companyPage';

// ----------------------------------------------------------------------

export default function ClaimCompanyPage() {
    const { companyId } = useParams();

    if (!companyId) {
        return <Navigate to="/dashboard/us/accounting/claim" replace />;
    }

    return (
        <ACLGuard category="unit_service" subcategory="accounting" acl="read">
            <Helmet>
                <title>Claim Company</title>
                <meta name="description" content="claim company" />
            </Helmet>

            <ClaimCompanyView companyId={companyId} />
        </ACLGuard>
    );
}
