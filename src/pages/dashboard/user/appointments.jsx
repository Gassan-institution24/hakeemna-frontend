import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserAppointmentsPage } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Sharedoctorna() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('Appointments')} </title>
      </Helmet>

      <UserAppointmentsPage />
    </>
  );
}
