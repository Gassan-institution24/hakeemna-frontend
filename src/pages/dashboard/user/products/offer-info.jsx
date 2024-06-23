import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import OfferProductsView from 'src/sections/user/offers/view/offer-products';

// ----------------------------------------------------------------------

export default function OffersHomePage() {
    const { user } = useAuthContext();
    const serviceUnitName =
        user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
            ?.name_english;
    return (
        <ACLGuard category="unit_service" subcategory="offers" acl="read">
            <Helmet>
                <title>{serviceUnitName || 'unit of service'} : Offer Products </title>
                <meta name="description" content="meta" />
            </Helmet>

            <OfferProductsView />
        </ACLGuard>
    );
}
