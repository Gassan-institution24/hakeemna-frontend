import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserAppointmentsPage } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Book() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('Appointments')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserAppointmentsPage />
    </>
  );
}
