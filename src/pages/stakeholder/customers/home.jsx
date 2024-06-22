import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import CustomersView from 'src/sections/stakeholder/customers/view/customers';

// ----------------------------------------------------------------------

export default function CustomersPage() {
    const { t } = useTranslate();

    return (
        <>
            <Helmet>
                <title> {t('customers')} </title>
                <meta name="description" content="meta" />
            </Helmet>

            <CustomersView />
        </>
    );
}
