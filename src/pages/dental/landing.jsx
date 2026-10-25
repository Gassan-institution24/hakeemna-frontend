import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import DentalLandingView from 'src/sections/dental/landing/dental-landing-view';

// ----------------------------------------------------------------------

export default function DentalLandingPage() {
  const { t } = useTranslate();
  return (
    <>
      <Helmet>
        <title>Hakeemna 360 Dental : حكيمنا 360 لطب الأسنان</title>
        <meta
          name="description"
          content={t(
            'Charting, treatment plans, appointments, billing and insurance — built for dentists, on the same trusted Hakeemna 360 platform.'
          )}
        />
      </Helmet>

      <DentalLandingView />
    </>
  );
}
