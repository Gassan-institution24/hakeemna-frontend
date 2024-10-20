import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import HRView from 'src/sections/unit-service/hr/view/home';

// ----------------------------------------------------------------------

export default function HRPage() {
    const { user } = useAuthContext();
    const serviceUnitName =
        user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
            ?.name_english;
    return (
        <>
            {/* <ACLGuard category="unit_service" subcategory="unit_service_info" acl="read"> */}
            <Helmet>
                <title>{serviceUnitName || 'unit of service'} : Human resourse</title>
                <meta name="description" content="meta" />
            </Helmet>

            <HRView />
            {/* </ACLGuard> */}
        </>
    );
}
