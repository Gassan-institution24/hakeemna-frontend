import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import DentalDashboardView from 'src/sections/dental/dashboard/dental-dashboard-view';

// ----------------------------------------------------------------------

export default function DentalDashboardPage() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>{t('Hakeemna 360 Dental')}</title>
      </Helmet>

      <DentalDashboardView />
    </>
  );
}
