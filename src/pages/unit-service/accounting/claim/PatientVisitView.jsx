import { Helmet } from 'react-helmet-async';
import { useParams, Navigate } from 'react-router-dom';

import ACLGuard from 'src/auth/guard/acl-guard';

import PatientPage from 'src/sections/unit-service/accounting/claim/patientPage';

// ----------------------------------------------------------------------

export default function PatientVisitView() {
    const { userId } = useParams();

    if (!userId) {
        return <Navigate to="/dashboard/us/accounting/claim" replace />;
    }

    return (
        <ACLGuard category="unit_service" subcategory="accounting" acl="read">
            <Helmet>
                <title>Claim Company</title>
                <meta name="description" content="claim company" />
            </Helmet>

            <PatientPage userId={userId} />
        </ACLGuard>
    );
}
