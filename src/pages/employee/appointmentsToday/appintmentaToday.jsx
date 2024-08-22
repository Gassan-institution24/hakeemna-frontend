import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import AppointmentsToday from 'src/sections/employee/appointmentsToday/appointmentsToday';

// ----------------------------------------------------------------------

export default function AppointmentsForToday() {
  const {t} = useTranslate()
  return (
    <>
      <Helmet>
        <title>{t("appointmentsToday")}</title>
        <meta name="description" content="meta" />
      </Helmet>
      <AppointmentsToday />
    </>
  );
}
